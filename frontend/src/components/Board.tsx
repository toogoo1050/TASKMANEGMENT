import type { Task, TaskStatus } from '../types/task';
import Column from './Column';

const STATUSES: TaskStatus[] = ['todo', 'doing', 'done'];

interface Props {
  tasks: Task[];
  onDelete: (id: string) => void;
}

export default function Board({ tasks, onDelete }: Props) {
  return (
    <div className="board">
      {STATUSES.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
