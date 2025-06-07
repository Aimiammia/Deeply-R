
'use client';

import type { LongTermGoal } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Pencil, Trash2, Save, X, CalendarDays, Target, CheckCircle, Clock, XCircle } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LongTermGoalItemProps {
  goal: LongTermGoal;
  onDeleteGoal: (id: string) => void;
  onEditGoal: (id: string, updatedGoalData: Omit<LongTermGoal, 'id' | 'createdAt'>) => void;
}

const statusOptions: { value: LongTermGoal['status']; label: string; icon: React.ElementType }[] = [
    { value: 'not-started', label: 'شروع نشده', icon: Target },
    { value: 'in-progress', label: 'در حال انجام', icon: Clock },
    { value: 'completed', label: 'تکمیل شده', icon: CheckCircle },
    { value: 'on-hold', label: 'متوقف شده', icon: XCircle },
];


export function LongTermGoalItem({ goal, onDeleteGoal, onEditGoal }: LongTermGoalItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editDescription, setEditDescription] = useState(goal.description || '');
  const [editTargetDate, setEditTargetDate] = useState<Date | undefined>(
    goal.targetDate ? parseISO(goal.targetDate) : undefined
  );
  const [editStatus, setEditStatus] = useState<LongTermGoal['status']>(goal.status);

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onEditGoal(goal.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        targetDate: editTargetDate ? editTargetDate.toISOString() : null,
        status: editStatus,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(goal.title);
    setEditDescription(goal.description || '');
    setEditTargetDate(goal.targetDate ? parseISO(goal.targetDate) : undefined);
    setEditStatus(goal.status);
  };

  const currentStatusOption = statusOptions.find(s => s.value === goal.status) || statusOptions[0];
  const StatusIcon = currentStatusOption.icon;


  return (
    <li className="p-4 border rounded-lg shadow-sm bg-card mb-4">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor={`edit-title-${goal.id}`} className="block text-sm font-medium text-muted-foreground mb-1">عنوان هدف</label>
            <Input
              id={`edit-title-${goal.id}`}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-base"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor={`edit-desc-${goal.id}`} className="block text-sm font-medium text-muted-foreground mb-1">توضیحات</label>
            <Textarea
              id={`edit-desc-${goal.id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">تاریخ هدف</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !editTargetDate && "text-muted-foreground")}>
                  <CalendarDays className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                  {editTargetDate ? format(editTargetDate, "PPP", { locale: faIR }) : <span>انتخاب تاریخ</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={editTargetDate} onSelect={setEditTargetDate} dir="rtl"/>
              </PopoverContent>
            </Popover>
          </div>
           <div>
            <Label htmlFor={`edit-status-${goal.id}`} className="block text-sm font-medium text-muted-foreground mb-1">وضعیت</Label>
            <Select value={editStatus} onValueChange={(value) => setEditStatus(value as LongTermGoal['status'])}>
              <SelectTrigger id={`edit-status-${goal.id}`}>
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 rtl:space-x-reverse">
            <Button variant="ghost" onClick={handleCancelEdit} size="sm">
              <X className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" /> لغو
            </Button>
            <Button onClick={handleSaveEdit} size="sm">
              <Save className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" /> ذخیره
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-primary flex items-center">
              <Target className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
              {goal.title}
            </h4>
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="ویرایش هدف">
                <Pencil className="h-5 w-5 text-blue-600" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="حذف هدف">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>تایید حذف هدف</AlertDialogTitle>
                    <AlertDialogDescription>
                      آیا از حذف هدف بلندمدت "{goal.title}" مطمئن هستید؟
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>لغو</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDeleteGoal(goal.id)} variant="destructive">
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {goal.description && (
            <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">{goal.description}</p>
          )}
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground items-center">
            <Badge variant={
                goal.status === 'completed' ? 'default' : 
                goal.status === 'in-progress' ? 'secondary' :
                goal.status === 'on-hold' ? 'destructive' : 'outline' 
            } className="flex items-center gap-1 py-1 px-2">
               <StatusIcon className="h-4 w-4" />
               {statusOptions.find(s => s.value === goal.status)?.label || goal.status}
            </Badge>

            {goal.targetDate && (
              <div className="flex items-center">
                <CalendarDays className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0" />
                <span>تاریخ هدف: {format(parseISO(goal.targetDate), "PPP", { locale: faIR })}</span>
              </div>
            )}
             <div className="flex items-center">
                <span>ایجاد شده در: {format(parseISO(goal.createdAt), "PPP p", { locale: faIR })}</span>
              </div>
          </div>
        </>
      )}
    </li>
  );
}
