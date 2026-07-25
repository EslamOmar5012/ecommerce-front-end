import { axiosClient } from '../core/api/axiosClient';
import { CartResponse, NormalizedCartItem } from '../domain/cart.types';

// The raw shape the backend sends back for populated cart items
interface RawCartProduct {
  productId: {
    _id: string;
    name: string;
    price: number;
    priceAfterDiscount?: number;
    stock: number;
    gallery?: string[];
  };
  quantity: number;
}

interface RawCartResponse {
  message?: string;
  cart?: {
    _id?: string;
    products?: RawCartProduct[];
  };
  summary?: {
    totalPrice?: number;
    totalPriceAfterDiscount?: number;
  };
}

function normalize(raw: RawCartResponse): CartResponse {
  const products = raw?.cart?.products || [];
  const items: NormalizedCartItem[] = products.map((item) => {
    const prod = item.productId;
    return {
      productId: prod._id,
      name: prod.name || '',
      price: prod.priceAfterDiscount ?? prod.price ?? 0,
      stock: prod.stock ?? 999,
      quantity: item.quantity,
      gallery: prod.gallery || [],
    };
  });

  const totalPrice = raw?.summary?.totalPrice ?? 0;
  const totalPriceAfterDiscount = raw?.summary?.totalPriceAfterDiscount ?? totalPrice;

  return {
    items,
    totalPrice,
    totalPriceAfterDiscount,
    itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
  };
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const res = await axiosClient.get('/cart');
    return normalize(res.data);
  },

  async addToCart(productId: string, quantity = 1): Promise<CartResponse> {
    const res = await axiosClient.post('/cart', { productId, quantity });
    return normalize(res.data);
  },

  async updateCartQuantity(productId: string, quantity: number): Promise<CartResponse> {
    const res = await axiosClient.patch(`/cart/${productId}`, { quantity });
    return normalize(res.data);
  },

  async removeCartItem(productId: string): Promise<CartResponse> {
    const res = await axiosClient.delete(`/cart/${productId}`);
    return normalize(res.data);
  },

  async clearCart(): Promise<{ message?: string }> {
    const res = await axiosClient.delete('/cart');
    return res.data;
  },
};
