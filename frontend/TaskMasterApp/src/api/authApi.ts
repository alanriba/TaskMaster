import apiClient from './apiClient';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/User';


export const authApi = {
  login: (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/users/login/', credentials);
  },

  register: (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/users/register/', userData);
  },

  logout: (): Promise<void> => {
    return apiClient.post<void>('/users/logout/');
  },

  getCurrentUser: (): Promise<User> => {
    return apiClient.get<User>('/users/me/');
  }
};