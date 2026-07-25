import { axiosClient } from '../core/api/axiosClient';
import { WishlistResponse } from '../domain/wishlist.types';

export const wishlistService = {
  async getWishlist(): Promise<WishlistResponse> {
    const res = await axiosClient.get<WishlistResponse>('/wishlist');
    return res.data;
  },

  async addToWishlist(productId: string): Promise<WishlistResponse> {
    const res = await axiosClient.post<WishlistResponse>('/wishlist', { productId });
    return res.data;
  },

  async removeFromWishlist(productId: string): Promise<WishlistResponse> {
    const res = await axiosClient.delete<WishlistResponse>(`/wishlist/${productId}`);
    return res.data;
  },

  async clearWishlist(): Promise<{ message?: string }> {
    const res = await axiosClient.delete('/wishlist');
    return res.data;
  },
};
