import axios from 'axios';
import type { Task, TaskStatus } from '../types/task';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const getTasks = (): Promise<Task[]> =>
  api.get<Task[]>('/api/tasks').then((r) => r.data);

export const createTask = (title: string, displayOrder: number): Promise<Task> =>
  api
    .post<Task>('/api/tasks', { title, status: 'todo' as TaskStatus, displayOrder })
    .then((r) => r.data);

export const updateTask = (id: string, data: Partial<Task>): Promise<Task> =>
  api.put<Task>(`/api/tasks/${id}`, data).then((r) => r.data);

export const deleteTask = (id: string): Promise<void> =>
  api.delete(`/api/tasks/${id}`);
