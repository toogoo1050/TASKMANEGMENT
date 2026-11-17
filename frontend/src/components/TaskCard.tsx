import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types/task';

const PRIORITY_LABEL: Record<string, string> = { high: '高', medium: '中', low: '低' };

interface Props {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onDelete, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isOverdue = task.dueDate ? new Date(task.dueDate) < new Date(new Date().toDateString()) : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header">
        <span className="task-card-title">{task.title}</span>
        <div className="task-card-actions">
          <button
            className="task-card-edit"
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            ✎
          </button>
          <button
            className="task-card-delete"
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            ×
          </button>
        </div>
      </div>

      {(task.priority || task.dueDate) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {task.priority && (
            <span className={`task-card-priority task-card-priority--${task.priority}`}>
              {PRIORITY_LABEL[task.priority]}
            </span>
          )}
          {task.dueDate && (
            <span className={`task-card-due${isOverdue ? ' task-card-due--overdue' : ''}`}>
              📅 {task.dueDate}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
