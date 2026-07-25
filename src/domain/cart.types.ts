// A cart item after the backend populates productId
export interface CartItem {
  // productId can be either a raw string ID or a populated product object
  productId: string | { _id: string; name: string; price: number; priceAfterDiscount?: number; stock: number; gallery?: string[] };
  quantity: number;
}

// Normalized shape that all UI components use
export interface NormalizedCartItem {
  productId: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  gallery: string[];
}

export interface CartResponse {
  items: NormalizedCartItem[];
  totalPrice: number;
  totalPriceAfterDiscount: number;
  itemCount: number;
}
