
'use client';

import type { Task } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDeleteTask, onEditTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(task.title); // Reset editText to original title
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEditTask(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <li className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        aria-label={task.completed ? `علامت زدن وظیفه "${task.title}" به عنوان انجام نشده` : `علامت زدن وظیفه "${task.title}" به عنوان انجام شده`}
      />
      {isEditing ? (
        <>
          <Input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-grow h-9 text-base"
            aria-label="ویرایش عنوان وظیفه"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={handleSaveEdit} aria-label="ذخیره تغییرات">
            <Save className="h-5 w-5 text-green-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCancelEdit} aria-label="لغو ویرایش">
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </>
      ) : (
        <>
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              "flex-grow cursor-pointer text-base",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </label>
          <Button variant="ghost" size="icon" onClick={handleEdit} aria-label="ویرایش وظیفه">
            <Pencil className="h-5 w-5 text-blue-600" />
          </Button>
        </>
      )}
      <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)} aria-label="حذف وظیفه">
        <Trash2 className="h-5 w-5 text-red-600" />
      </Button>
    </li>
  );
}
