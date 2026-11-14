import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const getTasks = () => api.get('/api/tasks').then((r) => r.data);

export const createTask = (title, displayOrder) =>
  api.post('/api/tasks', { title, status: 'todo', displayOrder }).then((r) => r.data);

export const updateTask = (id, data) =>
  api.put(`/api/tasks/${id}`, data).then((r) => r.data);

export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
