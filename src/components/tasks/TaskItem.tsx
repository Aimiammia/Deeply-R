
'use client';

import type { Task } from '@/types';
import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Save, X, CalendarDays, AlertTriangle, Tag, BookCopy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    setEditText(task.title);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEditTask(task.id, editText.trim());
      setIsEditing(false);
    }
  };

  const getPriorityBadgeVariant = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'زیاد';
      case 'medium':
        return 'متوسط';
      case 'low':
        return 'کم';
      default:
        return '';
    }
  };

  return (
    <li className="flex flex-col gap-2 p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 w-full">
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="حذف وظیفه">
              <Trash2 className="h-5 w-5 text-red-600" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تایید حذف وظیفه</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از حذف وظیفه "{task.title}" مطمئن هستید؟ این عمل قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>لغو</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteTask(task.id)} variant="destructive">
                حذف وظیفه
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="pl-10 rtl:pr-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {task.dueDate && (
          <div className="flex items-center">
            <CalendarDays className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
            <span>سررسید: {format(parseISO(task.dueDate), "PPP", { locale: faIR })}</span>
          </div>
        )}
        {task.priority && (
          <div className="flex items-center">
            <AlertTriangle className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
            <span>اهمیت:</span> <Badge variant={getPriorityBadgeVariant(task.priority)} className="mr-1 text-xs px-1.5 py-0.5">{getPriorityText(task.priority)}</Badge>
          </div>
        )}
        {task.category && (
          <div className="flex items-center">
            <Tag className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
            <span>دسته‌بندی:</span> <Badge variant="outline" className="mr-1 text-xs px-1.5 py-0.5">{task.category}</Badge>
          </div>
        )}
        {task.category === 'درس' && task.subjectName && (
          <div className="flex items-center text-primary">
            <BookCopy className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
            <span>{task.subjectName}</span>
            {task.startChapter && task.endChapter && (
              <span className="mr-1 rtl:ml-1 rtl:mr-0">(فصل {task.startChapter} تا {task.endChapter})</span>
            )}
             {task.startChapter && !task.endChapter && (
              <span className="mr-1 rtl:ml-1 rtl:mr-0">(فصل {task.startChapter})</span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
