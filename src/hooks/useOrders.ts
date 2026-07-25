import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { orderService } from '../services/order.service';
import { useAuthStore } from '../store/useAuthStore';
import { CreateOrderDto, OrderStatus } from '../domain/order.types';

export const useMyOrders = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
    enabled: isAuthenticated,
    staleTime: 0,           // always fetch fresh data
    refetchOnMount: 'always', // refetch every time the page is opened
  });
};

export const useOrderDetails = (id?: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: Boolean(id),
  });
};

export const useCreateCashOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createCashOrder(data),
    onSuccess: () => {
      toast.success('Order placed successfully (Cash on Delivery)!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to place cash order.');
    },
  });
};

export const useCreatePaymobOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) => orderService.createPaymobOrder(data),
    onSuccess: () => {
      toast.success('Paymob checkout initiated.');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to initialize Paymob payment.');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: () => {
      toast.success('Order cancelled successfully.');
      // Refetch immediately to show updated status
      queryClient.refetchQueries({ queryKey: ['my-orders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    },
  });
};

export const useRefundOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.refundOrder(id),
    onSuccess: () => {
      toast.success('Order refunded successfully.');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to refund order.');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      toast.success('Order status updated!');
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    },
  });
};
