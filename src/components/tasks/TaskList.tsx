
'use client';

import type { Task } from '@/types';
import { TaskItem } from './TaskItem';
import { ListChecks } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
}

export function TaskList({ tasks, onToggleComplete, onDeleteTask, onEditTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <ListChecks className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز وظیفه‌ای اضافه نشده است.</p>
        <p>اولین وظیفه خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


  return (
    <ul className="border rounded-md shadow-sm">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </ul>
  );
}
