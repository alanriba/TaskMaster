
import apiClient from './apiClient';
import { Task, TaskCreate, TaskUpdate, StatusUpdate } from '../models/Task';

// Patrón de Fachada para API de tareas
export const taskApi = {
  getAll: (params?: any): Promise<Task[]> => {
    return apiClient.get<Task[]>('/tasks/', { params });
  },

  getById: (id: number): Promise<Task> => {
    return apiClient.get<Task>(`/tasks/${id}/`);
  },

  create: (task: TaskCreate): Promise<Task> => {
    return apiClient.post<Task>('/tasks/', task);
  },

  update: (task: TaskUpdate): Promise<Task> => {
    return apiClient.put<Task>(`/tasks/${task.id}/`, task);
  },

  changeStatus: (id: number, statusUpdate: StatusUpdate): Promise<Task> => {
    return apiClient.post<Task>(`/tasks/${id}/change_status/`, statusUpdate);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete<void>(`/tasks/${id}/`);
  }
};