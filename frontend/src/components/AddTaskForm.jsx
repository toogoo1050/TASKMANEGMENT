import { useState } from 'react';

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-task-input"
        placeholder="タスク名を入力..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" className="add-task-btn">
        追加
      </button>
    </form>
  );
}
