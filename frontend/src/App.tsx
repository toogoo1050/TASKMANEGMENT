import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import type { Task, TaskStatus } from './types/task';
import Board from './components/Board';
import AddTaskForm from './components/AddTaskForm';
import TaskCard from './components/TaskCard';
import TaskEditModal from './components/TaskEditModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const STATUSES: TaskStatus[] = ['todo', 'doing', 'done'];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  const handleAdd = async (title: string) => {
    const todoTasks = tasks.filter((t) => t.status === 'todo');
    const displayOrder =
      todoTasks.length > 0 ? Math.max(...todoTasks.map((t) => t.displayOrder)) + 1 : 0;
    const newTask = await createTask(title, displayOrder);
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDeleteRequest = (task: Task) => setTaskToDelete(task);

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    await handleDelete(taskToDelete.id);
    setTaskToDelete(null);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUpdate = async (id: string, data: Partial<Task>) => {
    const updated = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const dragged = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);
    const overStatus: TaskStatus | undefined = overTask
      ? overTask.status
      : STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : undefined;

    if (!dragged || !overStatus || dragged.status === overStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, status: overStatus } : t))
    );
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const movedTask = tasks.find((t) => t.id === activeId);
    if (!movedTask) return;

    const overTask = tasks.find((t) => t.id === overId);
    const targetStatus: TaskStatus = overTask
      ? overTask.status
      : STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : movedTask.status;

    const columnTasks = tasks
      .filter((t) => t.status === targetStatus)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const newOrder =
      activeId === overId || !overTask
        ? columnTasks
        : arrayMove(
            columnTasks,
            columnTasks.findIndex((t) => t.id === activeId),
            columnTasks.findIndex((t) => t.id === overId)
          );

    const updates = newOrder.map((t, i) => ({ ...t, displayOrder: i }));

    setTasks((prev) => [
      ...prev.filter((t) => t.status !== targetStatus),
      ...updates,
    ]);

    await Promise.all(
      updates.map((t) =>
        updateTask(t.id, {
          id: t.id,
          title: t.title,
          status: targetStatus,
          category: t.category,
          memo: t.memo,
          displayOrder: t.displayOrder,
          priority: t.priority,
          dueDate: t.dueDate,
        })
      )
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">タスクボード</h1>
        <AddTaskForm onAdd={handleAdd} />
      </header>
      <main className="main">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Board tasks={tasks} onDeleteRequest={handleDeleteRequest} onEdit={handleEdit} />
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} onDeleteRequest={() => undefined} onEdit={() => undefined} />}
          </DragOverlay>
        </DndContext>
      </main>
      {isModalOpen && selectedTask && (
        <TaskEditModal key={selectedTask.id} task={selectedTask} onSave={handleUpdate} onClose={handleModalClose} />
      )}
      {taskToDelete && (
        <DeleteConfirmModal
          taskTitle={taskToDelete.title}
          onConfirm={handleDeleteConfirm}
          onClose={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
}
