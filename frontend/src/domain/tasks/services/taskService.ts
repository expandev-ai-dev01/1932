import { authenticatedClient } from '@/core/lib/api';
import type { Task, TaskFilters } from '../types';
import type { TaskFormOutput } from '../types/forms';

export const taskService = {
  async list(filters?: TaskFilters): Promise<Task[]> {
    const { data } = await authenticatedClient.get('/tasks', { params: filters });
    return data.data;
  },

  async create(task: TaskFormOutput): Promise<Task> {
    const payload = {
      ...task,
      due_date: task.due_date.toISOString(),
    };
    const { data } = await authenticatedClient.post('/tasks', payload);
    return data.data;
  },

  async update(id: string, task: TaskFormOutput): Promise<Task> {
    const payload = {
      ...task,
      due_date: task.due_date.toISOString(),
    };
    const { data } = await authenticatedClient.put(`/tasks/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await authenticatedClient.delete(`/tasks/${id}`);
  },

  async changeStatus(id: string, status: string): Promise<Task> {
    const { data } = await authenticatedClient.patch(`/tasks/${id}/status`, { status });
    return data.data;
  },
};
