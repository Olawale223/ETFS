import type {
  AuthResponse,
  BlogPost,
  Cart,
  Category,
  Order,
  PaginatedProducts,
  Product,
  User,
} from '@anon/types';

export interface ApiClientOptions {
  baseUrl?: string;
  getToken?: () => string | null;
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = (options.baseUrl ?? 'http://localhost:4000/api').replace(/\/$/, '');
  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const token = options.getToken?.();
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
    const payload = (await response.json().catch(() => ({}))) as { message?: string; error?: string; data?: T };
    if (!response.ok) throw new ApiError(response.status, payload.message ?? payload.error ?? 'Request failed');
    return (payload.data ?? payload) as T;
  };

  return {
    register: (body: { name: string; email: string; password: string }) =>
      request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request<{ user: User }>('/auth/me').then(response => response.user),
    products: async (query = '') => {
      const response = await request<{ items: Product[]; page: number; pages: number; total: number }>(`/products${query}`);
      return response as PaginatedProducts;
    },
    product: async (id: string) => {
      const response = await request<{ product: Product }>(`/products/${id}`);
      return response.product;
    },
    categories: async () => {
      const response = await request<{ categories: Category[] }>('/categories');
      return response.categories;
    },
    blogs: () => request<{ posts: BlogPost[] }>('/blog').then(response => response.posts),
    cart: async () => {
      const response = await request<{ cart: Cart }>('/cart');
      return response.cart;
    },
    addToCart: (productId: string, quantity = 1) =>
      request<{ cart: Cart }>('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }).then(response => response.cart),
    updateCart: (productId: string, quantity: number) =>
      request<{ cart: Cart }>(`/cart/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }).then(response => response.cart),
    removeFromCart: (productId: string) =>
      request<{ cart: Cart }>(`/cart/${productId}`, { method: 'DELETE' }).then(response => response.cart),
    wishlist: async () => {
      const response = await request<{ wishlist: Product[] }>('/wishlist');
      return response.wishlist;
    },
    toggleWishlist: (productId: string) =>
      request<{ wishlist: Product[] }>(`/wishlist/${productId}`, { method: 'POST' }).then(response => response.wishlist),
    removeFromWishlist: (productId: string) =>
      request<{ wishlist: Product[] }>(`/wishlist/${productId}`, { method: 'DELETE' }).then(response => response.wishlist),
    createOrder: () => request<{ order: Order }>('/orders', { method: 'POST' }).then(response => response.order),
    orders: () => request<{ orders: Order[] }>('/orders/my').then(response => response.orders),
    order: (id: string) => request<{ order: Order }>(`/orders/${id}`).then(response => response.order),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
