import { useEffect, useState } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../types/task';

interface Props {
  task: Task;
  onSave: (id: string, data: Partial<Task>) => Promise<void>;
  onClose: () => void;
}

export default function TaskEditModal({ task, onSave, onClose }: Props) {
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority | ''>(task.priority ?? '');
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [category, setCategory] = useState(task.category ?? '');
  const [memo, setMemo] = useState(task.memo ?? '');

  useEffect(() => {
    setTitle(task.title);
    setStatus(task.status);
    setPriority(task.priority ?? '');
    setDueDate(task.dueDate ?? '');
    setCategory(task.category ?? '');
    setMemo(task.memo ?? '');
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSave(task.id, {
      title: title.trim(),
      status,
      priority: priority === '' ? null : priority,
      dueDate: dueDate === '' ? null : dueDate,
      category: category.trim() === '' ? null : category.trim(),
      memo: memo.trim() === '' ? null : memo.trim(),
      displayOrder: task.displayOrder,
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">タスクを編集</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="modal-field">
            <label className="modal-label">タイトル *</label>
            <input
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">ステータス</label>
              <select
                className="modal-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="todo">やること</option>
                <option value="doing">やってる最中</option>
                <option value="done">完了</option>
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">優先度</label>
              <select
                className="modal-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority | '')}
              >
                <option value="">未設定</option>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">期限日</label>
            <input
              className="modal-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">カテゴリ</label>
            <input
              className="modal-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="任意"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">メモ</label>
            <textarea
              className="modal-textarea"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="任意"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="modal-btn-save">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
