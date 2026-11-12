import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from './config';
import { User, Product, Category, Cart, Order, BlogPost } from './models';
import { asyncHandler, auth, AuthRequest } from './middleware';

const router = Router();
const body = (schema: z.ZodTypeAny, req: any) => schema.parse(req.body);
const token = (id: string) => jwt.sign({ sub: id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
const id = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

router.post('/auth/register', asyncHandler(async (req, res) => {
  const data = body(z.object({ name: z.string().min(2).max(80), email: z.string().email(), password: z.string().min(8).max(128) }), req);
  const user = await User.create({ name: data.name, email: data.email.toLowerCase(), passwordHash: await bcrypt.hash(data.password, 12) });
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token: token(user.id) });
}));
router.post('/auth/login', asyncHandler(async (req, res) => {
  const data = body(z.object({ email: z.string().email(), password: z.string() }), req);
  const user = await User.findOne({ email: data.email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token: token(user.id) });
}));
router.get('/auth/me', auth, asyncHandler(async (req: AuthRequest, res) => { const user = await User.findById(req.userId).populate('wishlist'); if (!user) return res.status(404).json({ error: 'User not found' }); res.json({ user }); }));

router.get('/products', asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1), limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const filter: any = {}; if (req.query.category) filter.category = req.query.category; if (req.query.featured === 'true') filter.featured = true; if (req.query.search) filter.$text = { $search: String(req.query.search) };
  const [products, total] = await Promise.all([Product.find(filter).populate('category').sort('-createdAt').skip((page - 1) * limit).limit(limit), Product.countDocuments(filter)]);
  res.json({ products, items: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, page, pages: Math.ceil(total / limit), total });
}));
router.get('/products/:idOrSlug', asyncHandler(async (req, res) => { const product = await Product.findOne({ $or: [{ slug: req.params.idOrSlug }, ...(id.safeParse(req.params.idOrSlug).success ? [{ _id: req.params.idOrSlug }] : [])] }).populate('category'); if (!product) return res.status(404).json({ error: 'Product not found' }); res.json({ product }); }));
router.get('/categories', asyncHandler(async (_req, res) => res.json({ categories: await Category.find().sort('name') })));
router.get('/categories/:slug', asyncHandler(async (req, res) => { const category = await Category.findOne({ slug: req.params.slug }); if (!category) return res.status(404).json({ error: 'Category not found' }); res.json({ category, products: await Product.find({ category: category._id }) }); }));
router.get('/blog', asyncHandler(async (_req, res) => res.json({ posts: await BlogPost.find().sort('date') })));

router.get('/cart', auth, asyncHandler(async (req: AuthRequest, res) => res.json({ cart: await Cart.findOne({ user: req.userId }).populate('items.product') || { user: req.userId, items: [] } })));
router.post(['/cart', '/cart/items'], auth, asyncHandler(async (req: AuthRequest, res) => {
  const data = body(z.object({ productId: id, quantity: z.number().int().min(1).max(99) }), req); const product = await Product.findById(data.productId); if (!product) return res.status(404).json({ error: 'Product not found' });
  const cart = await Cart.findOneAndUpdate({ user: req.userId }, { $setOnInsert: { user: req.userId } }, { upsert: true, new: true }); const existing = cart.items.find((i: any) => i.product.toString() === data.productId); if (existing) existing.quantity = data.quantity; else cart.items.push({ product: product._id, quantity: data.quantity, price: product.price } as any); await cart.save(); res.json({ cart: await cart.populate('items.product') });
}));
router.put('/cart/:productId', auth, asyncHandler(async (req: AuthRequest, res) => {
  const data = z.object({ quantity: z.number().int().min(1).max(99) }).parse(req.body);
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  const cart = await Cart.findOneAndUpdate({ user: req.userId }, { $setOnInsert: { user: req.userId } }, { upsert: true, new: true });
  const existing = cart.items.find((i: any) => i.product.toString() === product.id);
  if (existing) existing.quantity = data.quantity; else cart.items.push({ product: product._id, quantity: data.quantity, price: product.price } as any);
  await cart.save();
  res.json({ cart: await cart.populate('items.product') });
}));
router.delete('/cart/items/:productId', auth, asyncHandler(async (req: AuthRequest, res) => { const cart = await Cart.findOne({ user: req.userId }); if (cart) { cart.items = cart.items.filter((i: any) => i.product.toString() !== req.params.productId) as any; await cart.save(); } res.json({ cart }); }));
router.delete('/cart/:productId', auth, asyncHandler(async (req: AuthRequest, res) => { const cart = await Cart.findOne({ user: req.userId }); if (cart) { cart.items = cart.items.filter((i: any) => i.product.toString() !== req.params.productId) as any; await cart.save(); } res.json({ cart }); }));
router.delete('/cart', auth, asyncHandler(async (req: AuthRequest, res) => { await Cart.findOneAndUpdate({ user: req.userId }, { items: [] }, { upsert: true }); res.json({ cart: { user: req.userId, items: [] } }); }));

router.get('/wishlist', auth, asyncHandler(async (req: AuthRequest, res) => { const user = await User.findById(req.userId).populate('wishlist'); res.json({ wishlist: user?.wishlist || [] }); }));
router.post('/wishlist/:productId', auth, asyncHandler(async (req: AuthRequest, res) => { const product = await Product.findById(req.params.productId); if (!product) return res.status(404).json({ error: 'Product not found' }); const user = await User.findById(req.userId); if (!user) return res.status(404).json({ error: 'User not found' }); const exists = user.wishlist.some((x: any) => x.toString() === product.id); user.wishlist = (exists ? user.wishlist.filter((x: any) => x.toString() !== product.id) : [...user.wishlist, product._id]) as any; await user.save(); res.json({ wishlist: await user.populate('wishlist') }); }));

router.post('/orders', auth, asyncHandler(async (req: AuthRequest, res) => {
  const data = body(z.object({ shippingAddress: z.object({ name: z.string().min(1), line1: z.string().min(1), city: z.string().min(1), state: z.string().min(1), postalCode: z.string().min(1), country: z.string().min(1) }) }), req); const cart = await Cart.findOne({ user: req.userId }).populate('items.product'); if (!cart?.items.length) return res.status(400).json({ error: 'Cart is empty' }); const items = cart.items.map((x: any) => ({ product: x.product._id, quantity: x.quantity, price: x.product.price })); const subtotal = items.reduce((sum, x) => sum + x.price * x.quantity, 0); const order = await Order.create({ user: req.userId, items, shippingAddress: data.shippingAddress, subtotal, total: subtotal }); await Cart.findOneAndUpdate({ user: req.userId }, { items: [] }); res.status(201).json({ order });
}));
router.get(['/orders', '/orders/my'], auth, asyncHandler(async (req: AuthRequest, res) => res.json({ orders: await Order.find({ user: req.userId }).populate('items.product').sort('-createdAt') })));
router.get('/orders/:id', auth, asyncHandler(async (req: AuthRequest, res) => { const order = await Order.findOne({ _id: req.params.id, user: req.userId }).populate('items.product'); if (!order) return res.status(404).json({ error: 'Order not found' }); res.json({ order }); }));
export default router;
