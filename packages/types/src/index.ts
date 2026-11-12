export type ProductBadge = 'new' | 'sale' | 'limited' | 'none';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'clothes-retail-kpis',
    title: 'Clothes Retail KPIs 2024 Guide for Fashion Executives',
    category: 'Fashion',
    author: 'Mr Admin',
    date: 'May 12, 2024',
    excerpt: 'Understanding the right KPIs is essential for any clothing retailer aiming to stay competitive. From sell-through rate to average order value, this guide breaks down the metrics that actually move the needle.',
    image: '/assets/images/blog-1.jpg',
  },
  {
    id: 'curbside-fashion-trends',
    title: 'Curbside Fashion Trends: How to Win the Pickup Battle',
    category: 'Clothes',
    author: 'Mr Robin',
    date: 'May 18, 2024',
    excerpt: 'Curbside pickup has become a permanent part of the shopping experience. Discover how leading fashion brands are turning this convenience into a powerful customer retention tool.',
    image: '/assets/images/blog-2.jpg',
  },
  {
    id: 'ebt-vendors-online-revenue',
    title: 'EBT Vendors: Claim Your Share of SNAP Online Revenue',
    category: 'Shoes',
    author: 'Mr Selsa',
    date: 'May 24, 2024',
    excerpt: 'More consumers than ever are using SNAP benefits for online purchases. Learn how shoe and apparel retailers can successfully accept EBT payments and expand their customer base.',
    image: '/assets/images/blog-3.jpg',
  },
  {
    id: 'sustainable-streetwear',
    title: 'The Rise of Sustainable Streetwear in 2024',
    category: 'Fashion',
    author: 'Mr Pawar',
    date: 'May 30, 2024',
    excerpt: 'Eco-conscious materials and transparent supply chains are no longer optional. See which streetwear labels are leading the shift toward sustainability without sacrificing style.',
    image: '/assets/images/blog-4.jpg',
  },
];

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string | Category;
  image: string;
  images?: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: ProductBadge;
  stock: number;
  featured?: boolean;
  deal?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedProducts {
  items: Product[];
  page: number;
  pages: number;
  total: number;
}
