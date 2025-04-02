import apiClient from './apiClient';
import { Category, CategoryCreate, CategoryUpdate } from '../models/Category';

export const categoryApi = {
  getAll: (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories/');
  },

  getById: (id: number): Promise<Category> => {
    return apiClient.get<Category>(`/categories/${id}/`);
  },

  create: (category: CategoryCreate): Promise<Category> => {
    return apiClient.post<Category>('/categories/', category);
  },

  update: (category: CategoryUpdate): Promise<Category> => {
    return apiClient.put<Category>(`/categories/${category.id}/`, category);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete<void>(`/categories/${id}/`);
  }
};