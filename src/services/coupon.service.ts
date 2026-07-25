import { axiosClient } from '../core/api/axiosClient';
import { Coupon, CreateCouponDto } from '../domain/coupon.types';

export const couponService = {
  async getCouponByCode(code: string): Promise<Coupon> {
    const res = await axiosClient.get(`/coupons/${code}`);
    return res.data.coupon || res.data.data || res.data;
  },

  async getAllCoupons(): Promise<Coupon[]> {
    const res = await axiosClient.get('/coupons');
    return res.data.data || res.data;
  },

  async createCoupon(data: CreateCouponDto): Promise<Coupon> {
    const res = await axiosClient.post('/coupons', data);
    return res.data.data || res.data;
  },

  async updateCoupon(id: string, data: Partial<CreateCouponDto>): Promise<Coupon> {
    const res = await axiosClient.patch(`/coupons/${id}`, data);
    return res.data.data || res.data;
  },

  async deleteCoupon(id: string): Promise<{ message: string }> {
    const res = await axiosClient.delete(`/coupons/${id}`);
    return res.data;
  },
};
