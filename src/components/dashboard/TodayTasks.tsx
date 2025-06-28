'use client';

import type { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { FilePlus } from 'lucide-react';

interface TodayTasksProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

export function TodayTasks({ tasks, onToggleTask }: TodayTasksProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <p className="mb-4">هیچ وظیفه‌ای برای امروز ندارید. عالیه!</p>
        <Button asChild variant="secondary">
          <Link href="/section/1">
             <FilePlus className="ml-2 h-4 w-4" />
             افزودن وظیفه جدید
          </Link>
        </Button>
      </div>
    );
  }
  
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const priorityA = a.priority ? priorityOrder[a.priority] : 4;
    const priorityB = b.priority ? priorityOrder[b.priority] : 4;
    return priorityA - priorityB;
  });

  return (
    <ul className="space-y-3">
      {sortedTasks.map(task => (
        <li key={task.id} className="flex items-center gap-3 p-3 rounded-md transition-colors hover:bg-muted/50">
          <Checkbox 
            id={`dashboard-task-${task.id}`} 
            onCheckedChange={() => onToggleTask(task.id)}
          />
          <label 
            htmlFor={`dashboard-task-${task.id}`}
            className="flex-grow cursor-pointer text-base"
          >
            {task.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
