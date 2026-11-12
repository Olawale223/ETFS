import { Schema, model, Types } from 'mongoose';

const item = new Schema({ product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, min: 1, required: true }, price: { type: Number, min: 0, required: true } }, { _id: false });
const userSchema = new Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, index: true }, passwordHash: { type: String, required: true, select: false }, wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }] }, { timestamps: true });
const categorySchema = new Schema({ name: { type: String, required: true, unique: true, trim: true }, slug: { type: String, required: true, unique: true, index: true }, image: String }, { timestamps: true });
const productSchema = new Schema({ name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, index: true }, description: String, price: { type: Number, required: true, min: 0 }, compareAtPrice: { type: Number, min: 0 }, image: { type: String, required: true }, images: [String], category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, stock: { type: Number, min: 0, default: 0 }, featured: { type: Boolean, default: false } }, { timestamps: true });
productSchema.index({ name: 'text', description: 'text' });
const blogPostSchema = new Schema({ slug: { type: String, required: true, unique: true, index: true }, title: { type: String, required: true }, category: { type: String, required: true }, author: { type: String, required: true }, date: { type: String, required: true }, excerpt: { type: String, required: true }, image: { type: String, required: true } }, { timestamps: true });
const cartSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true }, items: [item] }, { timestamps: true });
const orderSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, items: [item], status: { type: String, enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }, shippingAddress: { name: String, line1: String, city: String, state: String, postalCode: String, country: String }, subtotal: { type: Number, required: true }, total: { type: Number, required: true } }, { timestamps: true });
export const User = model('User', userSchema);
export const Category = model('Category', categorySchema);
export const Product = model('Product', productSchema);
export const BlogPost = model('BlogPost', blogPostSchema);
export const Cart = model('Cart', cartSchema);
export const Order = model('Order', orderSchema);
export type Id = Types.ObjectId;
