export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  category: string | null;
  memo: string | null;
  createdAt: string;
  displayOrder: number;
  priority: TaskPriority | null;
  dueDate: string | null; // "YYYY-MM-DD"
}
