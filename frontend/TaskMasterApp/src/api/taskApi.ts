import { Tag } from '../models/Tag';
import { Task, TaskCreate, TaskUpdate, StatusUpdate } from '../models/Task';
import apiClient from './apiClient';

export interface TaskQueryParams {
  status?: Task['status'];
  priority?: Task['priority'];
  category?: number;
  due_date_before?: string;
  due_date_after?: string;
  search?: string;
  ordering?: string;
  tags?: string; 
}

export const TaskServiceApi = {
  getAll: (params?: TaskQueryParams): Promise<Task[]> => {
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
  },
  
  getAllTags: (): Promise<Tag[]> => {
    return apiClient.get<Tag[]>('/tags/'); // asegúrate que este endpoint esté en tu backend
  },

  createTag: (name: string): Promise<Tag> => {
    return apiClient.post<Tag>('/tags/', { name });
  }

};
