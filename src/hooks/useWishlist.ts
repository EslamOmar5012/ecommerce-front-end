import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wishlistService } from '../services/wishlist.service';
import { useAuthStore } from '../store/useAuthStore';
import { Product } from '../domain/product.types';

export const useWishlist = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist(),
    enabled: isAuthenticated,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData<any>(['wishlist']);

      // Optimistic updates
      queryClient.setQueryData(['wishlist'], (old: any) => {
        if (!old) return old;
        const currentData = Array.isArray(old) ? old : old.wishlist || [];
        return {
          ...old,
          wishlist: [...currentData, { _id: productId } as Product],
        };
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      toast.success('Added to wishlist ❤️');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (err: any, _, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
      }
      toast.error(err.response?.data?.message || 'Failed to add to wishlist.');
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData<any>(['wishlist']);

      queryClient.setQueryData(['wishlist'], (old: any) => {
        if (!old) return old;
        const currentData = Array.isArray(old) ? old : old.wishlist || [];
        return {
          ...old,
          wishlist: currentData.filter((item: Product) => item._id !== productId),
        };
      });

      return { previousWishlist };
    },
    onSuccess: () => {
      toast.success('Removed from wishlist');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (err: any, _, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
      }
      toast.error(err.response?.data?.message || 'Failed to remove item.');
    },
  });
};

export const useClearWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistService.clearWishlist(),
    onSuccess: () => {
      toast.success('Wishlist cleared');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to clear wishlist.');
    },
  });
};
