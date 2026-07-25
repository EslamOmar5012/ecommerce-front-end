import { axiosClient } from '../core/api/axiosClient';
import { Brand } from '../domain/brand.types';

export const brandService = {
  async getBrands(search?: string) {
    const res = await axiosClient.get<{ data: Brand[] }>('/brands', {
      params: search ? { search } : undefined,
    });
    return res.data;
  },
};
