import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { couponService } from '../services/coupon.service';
import { CreateCouponDto } from '../domain/coupon.types';

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (code: string) => couponService.getCouponByCode(code),
    onSuccess: (coupon) => {
      toast.success(`Coupon '${coupon.code}' applied! (${coupon.discount}% off)`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon code.');
    },
  });
};

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: () => couponService.getAllCoupons(),
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponDto) => couponService.createCoupon(data),
    onSuccess: () => {
      toast.success('Coupon created successfully!');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create coupon.');
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCouponDto> }) =>
      couponService.updateCoupon(id, data),
    onSuccess: () => {
      toast.success('Coupon updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update coupon.');
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponService.deleteCoupon(id),
    onSuccess: () => {
      toast.success('Coupon deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete coupon.');
    },
  });
};
