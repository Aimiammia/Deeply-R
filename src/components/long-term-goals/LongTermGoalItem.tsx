
'use client';

import type { LongTermGoal, Milestone } from '@/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CalendarDays, Target, CheckCircle, Clock, XCircle, ListChecks, CheckSquare, Square } from 'lucide-react';
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
import { CreateLongTermGoalForm } from './CreateLongTermGoalForm'; // For editing
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface LongTermGoalItemProps {
  goal: LongTermGoal;
  onDeleteGoal: (id: string) => void;
  onUpdateGoal: (id: string, updatedGoalData: Omit<LongTermGoal, 'id' | 'createdAt'>) => void;
}

const statusOptions: { value: LongTermGoal['status']; label: string; icon: React.ElementType; className: string }[] = [
    { value: 'not-started', label: 'شروع نشده', icon: Target, className: 'bg-gray-500 text-gray-50' },
    { value: 'in-progress', label: 'در حال انجام', icon: Clock, className: 'bg-blue-500 text-blue-50' },
    { value: 'completed', label: 'تکمیل شده', icon: CheckCircle, className: 'bg-green-500 text-green-50' },
    { value: 'on-hold', label: 'متوقف شده', icon: XCircle, className: 'bg-orange-500 text-orange-50' },
];


export function LongTermGoalItem({ goal, onDeleteGoal, onUpdateGoal }: LongTermGoalItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveEdit = (updatedGoalData: Omit<LongTermGoal, 'id' | 'createdAt'>) => {
    onUpdateGoal(goal.id, updatedGoalData);
    setIsEditing(false);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = goal.milestones?.map(m => 
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    ) || [];
    onUpdateGoal(goal.id, { ...goal, milestones: updatedMilestones });
  };

  const currentStatusOption = statusOptions.find(s => s.value === goal.status) || statusOptions[0];
  const StatusIcon = currentStatusOption.icon;


  if (isEditing) {
    return (
      <Card className="mb-4 shadow-lg">
        <CardHeader>
          <CardTitle>ویرایش هدف: {goal.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateLongTermGoalForm onSaveGoal={handleSaveEdit} existingGoal={goal} />
        </CardContent>
        <CardFooter>
           <Button variant="ghost" onClick={() => setIsEditing(false)} className="w-full">لغو ویرایش</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <CardTitle className="text-xl font-headline text-primary flex items-center">
                        <Target className="mr-2 h-6 w-6 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
                        {goal.title}
                    </CardTitle>
                    <Badge variant="outline" className={cn("mt-1 text-xs", currentStatusOption.className)}>
                        <StatusIcon className="ml-1 h-3 w-3 rtl:mr-1 rtl:ml-0" />
                        {currentStatusOption.label}
                    </Badge>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
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
        </CardHeader>
        <CardContent className="space-y-3">
            {goal.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap border-r-2 border-primary pr-2 rtl:border-l-2 rtl:border-r-0 rtl:pl-2">
                    {goal.description}
                </p>
            )}
             {goal.successCriteria && (
                <div>
                    <h5 className="text-sm font-semibold text-foreground mb-1">معیارهای موفقیت:</h5>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/30 p-2 rounded-md">{goal.successCriteria}</p>
                </div>
            )}

            {goal.milestones && goal.milestones.length > 0 && (
            <div>
                <h5 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                    <ListChecks className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-primary" />
                    نقاط عطف:
                </h5>
                <ul className="space-y-1.5 pl-2 rtl:pr-2">
                {goal.milestones.map(milestone => (
                    <li key={milestone.id} className="flex items-center text-sm">
                    <Checkbox
                        id={`milestone-${goal.id}-${milestone.id}`}
                        checked={milestone.completed}
                        onCheckedChange={() => handleToggleMilestone(milestone.id)}
                        className="ml-2 rtl:mr-2"
                        aria-label={`تکمیل نقطه عطف ${milestone.name}`}
                    />
                    <label 
                        htmlFor={`milestone-${goal.id}-${milestone.id}`}
                        className={cn("cursor-pointer", milestone.completed && "line-through text-muted-foreground")}
                    >
                        {milestone.name}
                    </label>
                    </li>
                ))}
                </ul>
            </div>
            )}
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground items-center pt-2 border-t mt-3">
                {goal.targetDate && (
                <div className="flex items-center">
                    <CalendarDays className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
                    <span>تاریخ هدف: {format(parseISO(goal.targetDate), "PPP", { locale: faIR })}</span>
                </div>
                )}
                <div className="flex items-center">
                    <span>ایجاد: {format(parseISO(goal.createdAt), "PPP p", { locale: faIR })}</span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
