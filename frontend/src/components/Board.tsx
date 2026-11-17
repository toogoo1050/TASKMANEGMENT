import type { Task, TaskStatus } from '../types/task';
import Column from './Column';

const STATUSES: TaskStatus[] = ['todo', 'doing', 'done'];

interface Props {
  tasks: Task[];
  onDeleteRequest: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export default function Board({ tasks, onDeleteRequest, onEdit }: Props) {
  return (
    <div className="board">
      {STATUSES.map((status) => (
        <Column
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onDeleteRequest={onDeleteRequest}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
