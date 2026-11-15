import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';

const COLUMN_LABELS: Record<TaskStatus, string> = {
  todo: 'やること',
  doing: 'やってる最中',
  done: '完了',
};

interface Props {
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
}

export default function Column({ status, tasks, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className={`column${isOver ? ' column--over' : ''}`}>
      <div className="column-header">
        <span className="column-title">{COLUMN_LABELS[status]}</span>
        <span className="column-badge">{tasks.length}</span>
      </div>
      <div ref={setNodeRef} className="column-body">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
