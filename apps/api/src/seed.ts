import path from 'path';
import mongoose from 'mongoose';
import { config } from './config';
import { Category, Product } from './models';
import { BlogPost } from './models';
import { blogPosts } from '@anon/types';

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const files = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', 'belt.jpg', 'clothes-1.jpg', 'jacket-1.jpg', 'jewellery-1.jpg', 'party-wear-1.jpg', 'perfume.jpg', 'shampoo.jpg', 'shirt-1.jpg', 'shoe-1.jpg', 'shorts-1.jpg', 'sports-1.jpg', 'watch-1.jpg'];
async function seed() {
  await mongoose.connect(config.mongoUri); await Promise.all([Product.deleteMany({}), Category.deleteMany({}), BlogPost.deleteMany({})]);
  const names = ['Clothing', 'Footwear', 'Jewellery', 'Cosmetics', 'Accessories']; const categories = await Category.insertMany(names.map(name => ({ name, slug: slug(name), image: `/assets/images/icons/${slug(name)}.svg` })));
  await Product.insertMany(files.map((file, i) => ({ name: `Anon ${file.replace(/\.[^.]+$/, '').replace(/-/g, ' ')} product`, slug: slug(`anon-${file}-${i}`), description: 'A carefully selected product from the Anon collection.', price: 19.99 + i * 7.5, image: path.posix.join('/assets/images/products', file), images: [path.posix.join('/assets/images/products', file)], category: categories[i % categories.length]._id, stock: 25 + i, featured: i < 6 })));
  await BlogPost.insertMany(blogPosts.map(post => ({ ...post, slug: post.id })));
  console.log(`Seeded ${files.length} products and ${blogPosts.length} blog posts`); await mongoose.disconnect();
}
seed().catch(err => { console.error(err); process.exit(1); });
