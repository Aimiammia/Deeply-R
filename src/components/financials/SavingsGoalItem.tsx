
'use client';

import type { SavingsGoal } from '@/types';
import { useState, memo, useCallback, useMemo } from 'react'; // Added memo, useCallback, useMemo
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2, Save, X, CalendarDays, PiggyBank, CheckCircle, DollarSign, Edit3, TrendingUp } from 'lucide-react'; 
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

interface SavingsGoalItemProps {
  goal: SavingsGoal;
  onDeleteGoal: (id: string) => void;
  onEditGoal: (goal: SavingsGoal) => void; 
  onAddFunds: (id: string, amount: number) => void;
  onSetStatus: (id: string, status: SavingsGoal['status']) => void;
}

const SavingsGoalItemComponent = ({ goal, onDeleteGoal, onEditGoal, onAddFunds, onSetStatus }: SavingsGoalItemProps) => {
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [fundsToAdd, setFundsToAdd] = useState<number | ''>('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
  };

  const { progressPercentage, isAchieved, remainingAmount } = useMemo(() => {
    const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
    const achieved = goal.status === 'achieved' || goal.currentAmount >= goal.targetAmount;
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    return { progressPercentage: progress, isAchieved: achieved, remainingAmount: remaining };
  }, [goal.targetAmount, goal.currentAmount, goal.status]);


  const handleAddFundsSubmit = useCallback(() => {
    if (fundsToAdd !== '' && Number(fundsToAdd) > 0) {
      onAddFunds(goal.id, Number(fundsToAdd));
      setFundsToAdd('');
      setIsAddingFunds(false);
    }
  }, [fundsToAdd, goal.id, onAddFunds]);
  
  const getStatusTextAndColor = useCallback(() => {
    switch(goal.status) {
      case 'active': return { text: 'فعال', color: 'bg-blue-500 hover:bg-blue-600' };
      case 'achieved': return { text: 'رسیده شده', color: 'bg-green-500 hover:bg-green-600' };
      case 'cancelled': return { text: 'لغو شده', color: 'bg-red-500 hover:bg-red-600' };
      default: return { text: 'نامشخص', color: 'bg-gray-500 hover:bg-gray-600' };
    }
  }, [goal.status]);

  const statusInfo = getStatusTextAndColor();


  return (
    <li className={cn("p-4 border rounded-lg shadow-sm bg-card mb-4", isAchieved && "border-green-500 bg-green-500/5")}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-grow">
          <h4 className={cn("text-lg font-semibold flex items-center", isAchieved ? "text-green-700 dark:text-green-400" : "text-primary")}>
            <PiggyBank className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
            {goal.name}
          </h4>
          <Badge variant="default" className={cn("text-xs mt-1 text-white", statusInfo.color)}>{statusInfo.text}</Badge>
        </div>
        <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onEditGoal(goal)} aria-label="ویرایش هدف" disabled={goal.status === 'achieved' || goal.status === 'cancelled'}>
            <Edit3 className="h-5 w-5 text-blue-600" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="حذف هدف">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تایید حذف هدف پس‌انداز</AlertDialogTitle>
                <AlertDialogDescription>
                  آیا از حذف هدف پس‌انداز "{goal.name}" مطمئن هستید؟ این عمل قابل بازگشت نیست.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
        <div>
          <p className="text-muted-foreground">مبلغ هدف:</p>
          <p className="font-medium">{formatCurrency(goal.targetAmount)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">پس‌انداز شده:</p>
          <p className="font-medium">{formatCurrency(goal.currentAmount)}</p>
        </div>
        {remainingAmount > 0 && !isAchieved && (
             <div>
                <p className="text-muted-foreground">مبلغ باقیمانده:</p>
                <p className="font-medium text-orange-600 dark:text-orange-400 flex items-center">
                     <TrendingUp className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0"/>
                    {formatCurrency(remainingAmount)}
                </p>
            </div>
        )}
        {goal.targetDate && (
          <div>
            <p className="text-muted-foreground">تاریخ هدف:</p>
            <p className="flex items-center">
              <CalendarDays className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0 flex-shrink-0" />
              {format(parseISO(goal.targetDate), "PPP", { locale: faIR })}
            </p>
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <Progress value={progressPercentage} className={cn("w-full h-3 rounded-full [&>div]:rounded-full", isAchieved && "bg-green-500/30 [&>div]:bg-green-500")} />
        <p className="text-xs text-muted-foreground mt-1 text-right rtl:text-left">
          {progressPercentage.toFixed(0).toLocaleString('fa-IR')}٪ تکمیل شده
        </p>
      </div>

      {goal.status === 'active' && !isAchieved && (
        <>
          {!isAddingFunds ? (
            <Button variant="outline" size="sm" onClick={() => setIsAddingFunds(true)} className="w-full sm:w-auto">
              <DollarSign className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" /> افزودن وجه
            </Button>
          ) : (
            <div className="mt-3 p-3 border rounded-md bg-secondary/30 space-y-2">
              <Label htmlFor={`add-funds-${goal.id}`} className="text-xs">مبلغ برای افزودن (تومان)</Label>
              <Input
                id={`add-funds-${goal.id}`}
                type="number"
                value={fundsToAdd}
                onChange={(e) => setFundsToAdd(parseFloat(e.target.value) || '')}
                placeholder="مثلا: 500000"
                className="text-sm h-9"
                min="1"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddFundsSubmit} size="sm" className="flex-1" disabled={!fundsToAdd || Number(fundsToAdd) <= 0}>
                  <Save className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" /> ثبت
                </Button>
                <Button variant="ghost" onClick={() => { setIsAddingFunds(false); setFundsToAdd(''); }} size="sm" className="flex-1">
                  <X className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" /> لغو
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {isAchieved && goal.status !== 'achieved' && (
        <Button variant="default" size="sm" onClick={() => onSetStatus(goal.id, 'achieved')} className="w-full sm:w-auto mt-2 bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" /> علامت‌گذاری به عنوان رسیده شده
        </Button>
      )}
       {goal.status === 'active' && !isAchieved && (
         <Button variant="ghost" size="sm" onClick={() => onSetStatus(goal.id, 'cancelled')} className="w-full sm:w-auto mt-2 text-destructive hover:text-destructive/80">
            لغو هدف
        </Button>
       )}

      <p className="text-xs text-muted-foreground mt-3 text-right rtl:text-left">
        ایجاد شده در: {format(parseISO(goal.createdAt), "PPP", { locale: faIR })}
      </p>
    </li>
  );
};
export const SavingsGoalItem = memo(SavingsGoalItemComponent);
