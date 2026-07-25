import { axiosClient } from '../core/api/axiosClient';
import { Category, SubCategory } from '../domain/category.types';

export const categoryService = {
  async getCategories(params?: { page?: number; limit?: number; search?: string; includeInactive?: boolean }) {
    const res = await axiosClient.get<{ data: Category[]; results?: number }>('/categories', { params });
    return res.data;
  },

  async getCategoryById(id: string) {
    const res = await axiosClient.get<{ data: Category }>(`/categories/${id}`);
    return res.data;
  },

  async getSubcategories(categoryId?: string) {
    const res = await axiosClient.get<{ data: SubCategory[] }>('/subcategories', {
      params: categoryId ? { categoryId } : undefined,
    });
    return res.data;
  },
};
