import { axiosClient } from '../core/api/axiosClient';
import { Product, ProductQuery, ProductsResponse } from '../domain/product.types';

export const productService = {
  async getProducts(params?: ProductQuery): Promise<ProductsResponse> {
    const res = await axiosClient.get('/products', { params });
    const raw = res.data;
    // API returns { data: [], total, page, limit, totalPages }
    if (Array.isArray(raw)) {
      return { data: raw, total: raw.length };
    }
    return {
      data: raw.data || [],
      total: raw.total,
      page: raw.page,
      limit: raw.limit,
      totalPages: raw.totalPages,
      totalProducts: raw.total,
    };
  },

  async getProductById(id: string): Promise<Product> {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data.product || res.data.data || res.data;
  },

  async createProduct(formData: FormData): Promise<Product> {
    const res = await axiosClient.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data || res.data;
  },

  async updateProduct(id: string, formData: FormData): Promise<Product> {
    const res = await axiosClient.patch(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data || res.data;
  },

  async removeGalleryImage(id: string, url: string): Promise<{ message: string }> {
    const res = await axiosClient.delete(`/products/${id}/gallery`, { params: { url } });
    return res.data;
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const res = await axiosClient.delete(`/products/${id}`);
    return res.data;
  },
};
