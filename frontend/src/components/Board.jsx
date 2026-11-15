import Column from './Column';

const STATUSES = ['todo', 'doing', 'done'];

export default function Board({ tasks, onDelete }) {
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
