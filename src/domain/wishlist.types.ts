import { Product } from './product.types';

export interface WishlistResponse {
  message?: string;
  wishlist: Product[] | string[];
}
