import { fetchApi } from './apiClient';
import { User } from '@/types';

export const profileApi = {
  getProfile: (): Promise<User> => fetchApi('/profile', { method: 'GET' }),
  updateProfile: (data: Partial<User>): Promise<User> => fetchApi('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
