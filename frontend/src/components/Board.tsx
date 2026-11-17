import type { Task, TaskStatus } from '../types/task';
import Column from './Column';

const STATUSES: TaskStatus[] = ['todo', 'doing', 'done'];

interface Props {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function Board({ tasks, onDelete, onEdit }: Props) {
  return (
    <div className="board">
      {STATUSES.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
