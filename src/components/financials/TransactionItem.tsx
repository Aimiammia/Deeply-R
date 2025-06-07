
'use client';

import type { FinancialTransaction } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ArrowUpCircle, ArrowDownCircle, CalendarDays, Tag } from 'lucide-react';
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

interface TransactionItemProps {
  transaction: FinancialTransaction;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionItem({ transaction, onDeleteTransaction }: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const TypeIcon = isIncome ? ArrowUpCircle : ArrowDownCircle;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
  };

  return (
    <li className="flex flex-col gap-2 p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3 w-full">
        <TypeIcon className={cn("h-6 w-6 mt-0.5 flex-shrink-0", isIncome ? 'text-green-500' : 'text-red-500')} />
        <div className="flex-grow">
          <p className="font-semibold text-foreground">{transaction.description}</p>
          <p className={cn("text-lg font-bold", amountColor)}>
            {formatCurrency(transaction.amount)}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="حذف تراکنش">
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تایید حذف تراکنش</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از حذف تراکنش "{transaction.description}" با مبلغ {formatCurrency(transaction.amount)} مطمئن هستید؟ این عمل قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>لغو</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteTransaction(transaction.id)} className={cn( "bg-destructive text-destructive-foreground hover:bg-destructive/90")}>
                حذف تراکنش
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="pl-9 rtl:pr-9 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center">
          <CalendarDays className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
          <span>{format(parseISO(transaction.date), "PPP", { locale: faIR })}</span>
        </div>
        {transaction.category && (
          <div className="flex items-center">
            <Tag className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
            <span>{transaction.category}</span>
          </div>
        )}
      </div>
    </li>
  );
}
