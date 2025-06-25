
'use client';

import type { FastingSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Calendar, Info, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
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
import { memo, useCallback } from 'react';

interface FastingHistoryItemProps {
  session: FastingSession;
  onDelete: (sessionId: string) => void;
}

const FastingHistoryItemComponent = ({ session, onDelete }: FastingHistoryItemProps) => {
  const startTime = parseISO(session.startTime);
  const endTime = parseISO(session.endTime);

  const handleDelete = useCallback(() => {
    onDelete(session.id);
  }, [onDelete, session.id]);

  return (
    <li className="p-4 border rounded-lg shadow-sm bg-card transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-grow">
            <h4 className="text-md font-semibold text-primary flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 flex-shrink-0 text-green-500" />
                جلسه فستینگ تکمیل شده
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
                در تاریخ: {formatJalaliDateDisplay(startTime, 'eeee, jD jMMMM')}
            </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="حذف جلسه">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>تایید حذف جلسه</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از حذف این جلسه فستینگ مطمئن هستید؟ این عمل قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>لغو</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} variant="destructive">حذف</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm mb-3 text-foreground">
        <div>
            <p className="text-xs text-muted-foreground">شروع</p>
            <p className="font-medium flex items-center">
                <Calendar className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0" />
                {format(startTime, 'HH:mm')}
            </p>
        </div>
         <div>
            <p className="text-xs text-muted-foreground">پایان</p>
            <p className="font-medium flex items-center">
                <Calendar className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0" />
                {format(endTime, 'HH:mm')}
            </p>
        </div>
        <div>
            <p className="text-xs text-muted-foreground">مدت زمان</p>
            <p className="font-medium flex items-center">
                <Clock className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0" />
                {session.durationHours.toLocaleString('fa-IR')} ساعت
            </p>
        </div>
      </div>
      
      {session.notes && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground mb-1 flex items-center"><Info className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/>یادداشت‌ها:</p>
          <p className="text-sm text-foreground whitespace-pre-wrap bg-secondary/30 p-2 rounded-md">{session.notes}</p>
        </div>
      )}
    </li>
  );
};

export const FastingHistoryItem = memo(FastingHistoryItemComponent);
