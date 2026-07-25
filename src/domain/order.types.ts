export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentType = 'cash' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type RefundStatus = 'none' | 'requested' | 'refunded' | 'rejected';

export interface ShippingAddress {
  street: string;
  city: string;
  country?: string;
  phone?: string;
}

export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  totalPrice: number;
  discount?: number;
  finalPrice: number;
  couponId?: string;
  shippingAddress: ShippingAddress;
  phone: string;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  refundStatus?: RefundStatus;
  refundReason?: string;
  paymobOrderId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  shippingAddress: ShippingAddress;
  phone: string;
  couponCode?: string;
}

export interface CashOrderResponse extends Order {}

export interface PaymobOrderResponse {
  order: Order;
  paymentUrl?: string;
}
