import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >
      <span className="task-card-title">{task.title}</span>
      <button
        className="task-card-delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        ×
      </button>
    </div>
  );
}
