import { fetchApi } from './apiClient';
import { AuthResponse, User } from '@/types';

export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> => 
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    
  signup: (email: string, password: string, name: string): Promise<AuthResponse> => 
    fetchApi('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
    
  getMe: (): Promise<User> => fetchApi('/auth/me', { method: 'GET' }),
};
