
'use client';

import type { Budget, FinancialTransaction } from '@/types';
import { useMemo, memo } from 'react'; // Added memo
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, Edit3, AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react';
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
import { parseISO, isSameMonth, getMonth, getYear } from 'date-fns';
import { cn, formatCurrency } from '@/lib/utils'; // Ensured formatCurrency is imported

interface BudgetItemProps {
  budget: Budget;
  transactions: FinancialTransaction[];
  onDeleteBudget: (budgetId: string) => void; 
  onEditBudget: (budget: Budget) => void; 
}

const BudgetItemComponent = ({ budget, transactions, onDeleteBudget, onEditBudget }: BudgetItemProps) => {

  const { currentMonthExpenses, remainingAmount, progressPercentage, isOverBudget } = useMemo(() => {
    const now = new Date();
    const expenses = transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === budget.category &&
        isSameMonth(parseISO(t.date), now) &&
        getYear(parseISO(t.date)) === getYear(now)
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const remaining = budget.amount - expenses;
    const progress = budget.amount > 0 ? Math.min((expenses / budget.amount) * 100, 100) : 0;
    const overBudget = expenses > budget.amount;

    return { currentMonthExpenses: expenses, remainingAmount: remaining, progressPercentage: progress, isOverBudget: overBudget };
  }, [budget, transactions]);


  return (
    <li className="p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors bg-card shadow-sm rounded-md mb-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-md font-semibold text-foreground">{budget.category}</h4>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEditBudget(budget)} aria-label={`ویرایش بودجه ${budget.category}`}>
            <Edit3 className="h-4 w-4 text-blue-600" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`حذف بودجه ${budget.category}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تایید حذف بودجه</AlertDialogTitle>
                <AlertDialogDescription>
                  آیا از حذف بودجه برای دسته‌بندی "{budget.category}" مطمئن هستید؟
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>لغو</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteBudget(budget.id)} variant="destructive"> 
                  حذف بودجه
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="text-sm space-y-1 mb-3">
        <p>بودجه: <span className="font-medium">{formatCurrency(budget.amount)}</span></p>
        <p>هزینه شده (این ماه): <span className={cn("font-medium", isOverBudget ? "text-destructive" : "text-green-600")}>{formatCurrency(currentMonthExpenses)}</span></p>
        
        {isOverBudget ? (
          <p className="text-destructive font-medium flex items-center">
            <TrendingDown className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0" /> 
            {formatCurrency(Math.abs(remainingAmount))} بیش از بودجه
          </p>
        ) : (
          <p className="text-foreground font-medium flex items-center">
             <TrendingUp className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0 text-green-600" /> 
            باقی‌مانده: {formatCurrency(remainingAmount)}
          </p>
        )}
      </div>
      
      <Progress 
        value={progressPercentage} 
        className={cn(
            "w-full h-3 rounded-full", 
            progressPercentage > 100 ? "bg-destructive/20" : "bg-secondary",
            "[&>div]:rounded-full" 
        )}
      >
        <div
            className={cn(
                "h-full transition-all",
                isOverBudget ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }} 
        />
      </Progress>

      {isOverBudget && (
         <p className="text-xs text-destructive mt-1 text-right rtl:text-left flex items-center justify-end">
            <AlertTriangle className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0"/>
            از بودجه عبور کرده‌اید!
        </p>
      )}
      {!isOverBudget && progressPercentage > 80 && progressPercentage <= 100 && (
        <p className="text-xs text-orange-500 mt-1 text-right rtl:text-left flex items-center justify-end">
            <Info className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0"/>
            نزدیک به سقف بودجه!
        </p>
      )}
    </li>
  );
};

export const BudgetItem = memo(BudgetItemComponent);
