export type CouponDiscountType = 'percentage' | 'fixed';

export interface Coupon {
  _id: string;
  code: string;
  discount: number;
  type: CouponDiscountType;
  expireAt: string;
  usageLimit?: number;
  usedCount?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCouponDto {
  code: string;
  discount: number;
  type: CouponDiscountType;
  expireAt: string;
  usageLimit?: number;
}
