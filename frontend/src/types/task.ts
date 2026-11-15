export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  category: string | null;
  memo: string | null;
  createdAt: string;
  displayOrder: number;
}
