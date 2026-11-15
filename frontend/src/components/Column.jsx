import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const COLUMN_LABELS = {
  todo: 'やること',
  doing: 'やってる最中',
  done: '完了',
};

export default function Column({ status, tasks, onDelete }) {
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
