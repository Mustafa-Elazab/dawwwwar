import { api } from '../client';
import type { ApiResponse } from '@dawwar/types';

export const authApi = {
  getMe: async (): Promise<ApiResponse<any>> => {
    const { data } = await api.get('/users/me');
    return data;
  },
};
