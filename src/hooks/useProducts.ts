import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import { brandService } from '../services/brand.service';
import { ProductQuery } from '../domain/product.types';

export const useProducts = (params?: ProductQuery) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: Boolean(id),
  });
};

export const useCategories = (params?: { page?: number; limit?: number; search?: string; includeInactive?: boolean }) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.getCategories(params),
  });
};

export const useSubcategories = (categoryId?: string) => {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => categoryService.getSubcategories(categoryId),
  });
};

export const useBrands = (search?: string) => {
  return useQuery({
    queryKey: ['brands', search],
    queryFn: () => brandService.getBrands(search),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => productService.createProduct(formData),
    onSuccess: () => {
      toast.success('Product created successfully!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create product.');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      productService.updateProduct(id, formData),
    onSuccess: (_, variables) => {
      toast.success('Product updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update product.');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete product.');
    },
  });
};
