import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartService } from '../services/cart.service';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  const { setCartCount } = useCartStore();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (cartQuery.data) {
      setCartCount(cartQuery.data.itemCount || 0);
    }
  }, [cartQuery.data, setCartCount]);

  return cartQuery;
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { openCart } = useCartStore();

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: string; quantity?: number }) =>
      cartService.addToCart(productId, quantity),
    onSuccess: () => {
      toast.success('Product added to cart!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      openCart();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add item to cart.');
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartService.updateCartQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update quantity.');
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartService.removeCartItem(productId),
    onSuccess: () => {
      toast.success('Item removed from cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to remove item.');
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { setCartCount } = useCartStore();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      toast.success('Cart cleared');
      setCartCount(0);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to clear cart.');
    },
  });
};
