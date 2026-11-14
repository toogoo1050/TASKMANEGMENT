import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import Board from './components/Board';
import AddTaskForm from './components/AddTaskForm';
import TaskCard from './components/TaskCard';

const STATUSES = ['todo', 'doing', 'done'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleAdd = async (title) => {
    const todoTasks = tasks.filter((t) => t.status === 'todo');
    const displayOrder = todoTasks.length > 0
      ? Math.max(...todoTasks.map((t) => t.displayOrder)) + 1
      : 0;
    const newTask = await createTask(title, displayOrder);
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);
    const overStatus = overTask ? overTask.status : (STATUSES.includes(overId) ? overId : null);

    if (!activeTask || !overStatus) return;
    if (activeTask.status === overStatus) return;

    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === activeId ? { ...t, status: overStatus } : t
      );
      return updated;
    });
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const movedTask = tasks.find((t) => t.id === activeId);
    if (!movedTask) return;

    const overTask = tasks.find((t) => t.id === overId);
    const targetStatus = overTask
      ? overTask.status
      : STATUSES.includes(overId)
      ? overId
      : movedTask.status;

    const columnTasks = tasks
      .filter((t) => t.status === targetStatus)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    let newOrder;
    if (activeId === overId || !overTask) {
      newOrder = columnTasks;
    } else {
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);
      newOrder = arrayMove(columnTasks, oldIndex === -1 ? columnTasks.length - 1 : oldIndex, newIndex);
    }

    const updates = newOrder.map((t, i) => ({ ...t, displayOrder: i }));

    setTasks((prev) => {
      const otherTasks = prev.filter((t) => t.status !== targetStatus);
      return [...otherTasks, ...updates];
    });

    await Promise.all(
      updates.map((t) =>
        updateTask(t.id, {
          id: t.id,
          title: t.title,
          status: targetStatus,
          category: t.category,
          memo: t.memo,
          displayOrder: t.displayOrder,
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
          <Board tasks={tasks} onDelete={handleDelete} />
          <DragOverlay>
            {activeTask && (
              <TaskCard task={activeTask} onDelete={() => {}} />
            )}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
