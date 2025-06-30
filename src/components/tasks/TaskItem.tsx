
'use client';

import type { Task } from '@/types';
import { useState, memo, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Save, X, CalendarDays, AlertTriangle, Tag, BookCopy, Clock, FolderKanban, ChevronDown, ChevronUp, Timer } from 'lucide-react';
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
import Link from 'next/link';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
}

const TaskItemComponent = ({ task, onToggleComplete, onDeleteTask, onEditTask }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);
  const [isExpanded, setIsExpanded] = useState(false);

  const totalPomodoros = useMemo(() => {
    return task.estimatedMinutes ? Math.ceil(task.estimatedMinutes / 25) : 0;
  }, [task.estimatedMinutes]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditText(task.title);
  }, [task.title]);

  const handleSaveEdit = useCallback(() => {
    if (editText.trim()) {
      onEditTask(task.id, editText.trim());
      setIsEditing(false);
    }
  }, [editText, onEditTask, task.id]);

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
  
  const hasDetails = task.dueDate || task.priority || task.category || task.projectId || task.subjectName || task.estimatedMinutes;

  return (
    <li className="flex flex-col p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
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
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit() }}
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
            {hasDetails && (
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} aria-label="نمایش جزئیات">
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            )}
          </>
        )}
      </div>
      
      {isExpanded && hasDetails && (
        <div className="pl-10 rtl:pr-10 pt-2 mt-2 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center">
                <CalendarDays className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
                <span>سررسید: {format(parseISO(task.dueDate), "PPP", { locale: faIR })}</span>
                {task.dueTime && (
                    <span className="mr-1 rtl:ml-1 rtl:mr-0 flex items-center">
                        <Clock className="ml-1 h-3 w-3 rtl:mr-1 rtl:ml-0" />
                        {task.dueTime}
                    </span>
                )}
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
            {task.projectId && task.projectName && (
              <div className="flex items-center">
                <FolderKanban className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
                <span>پروژه:</span> 
                <Link href={`/section/11#project-${task.projectId}`} passHref>
                    <Badge variant="secondary" className="mr-1 text-xs px-1.5 py-0.5 hover:bg-primary/20 cursor-pointer">{task.projectName}</Badge>
                </Link>
              </div>
            )}
             {task.estimatedMinutes && totalPomodoros > 0 && (
              <div className="flex items-center">
                <Timer className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
                <span>پومودورو:</span>
                <Badge variant="secondary" className="mr-1 text-xs px-1.5 py-0.5">
                    🍅 {task.pomodorosCompleted?.toLocaleString('fa-IR') || '۰'} / {totalPomodoros.toLocaleString('fa-IR')}
                </Badge>
              </div>
            )}
            {task.category === 'درس' && task.subjectName && (
              <div className="flex items-center text-primary">
                <BookCopy className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
                <span>{task.subjectName}</span>
                {task.startChapter && task.endChapter && (
                  <span className="mr-1 rtl:ml-1 rtl:mr-0">(فصل {task.startChapter.toLocaleString('fa-IR')} تا {task.endChapter.toLocaleString('fa-IR')})</span>
                )}
                 {task.startChapter && !task.endChapter && (
                  <span className="mr-1 rtl:ml-1 rtl:mr-0">(فصل {task.startChapter.toLocaleString('fa-IR')})</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
};

export const TaskItem = memo(TaskItemComponent);
