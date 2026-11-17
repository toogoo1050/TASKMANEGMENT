import { useEffect } from 'react';

interface Props {
  taskTitle: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({ taskTitle, onConfirm, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">タスクを削除</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569' }}>
          「{taskTitle}」を削除しますか？<br />
          この操作は元に戻せません。
        </p>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            キャンセル
          </button>
          <button className="modal-btn-danger" onClick={onConfirm}>
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
