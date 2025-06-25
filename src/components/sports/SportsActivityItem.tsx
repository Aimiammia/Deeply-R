'use client';

import type { SportsActivity } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit3, CalendarDays, Clock, MapPin, Flame, Info, Activity as ActivityIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
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
import { Label } from '@/components/ui/label';

interface SportsActivityItemProps {
  activity: SportsActivity;
  onDeleteActivity: (id: string) => void;
  onEditActivity: (activity: SportsActivity) => void; 
}

const SportsActivityItemComponent = ({ activity, onDeleteActivity, onEditActivity }: SportsActivityItemProps) => {

  const handleEdit = useCallback(() => {
    onEditActivity(activity);
  }, [activity, onEditActivity]);

  const handleDelete = useCallback(() => {
    onDeleteActivity(activity.id);
  }, [activity.id, onDeleteActivity]);

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <CardTitle className="text-lg font-headline text-primary flex items-center">
              <ActivityIcon className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
              {activity.activityType}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground flex items-center mt-1">
                <CalendarDays className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />
                {formatJalaliDateDisplay(parseISO(activity.date), 'jYYYY/jMM/jDD')}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={handleEdit} aria-label="ویرایش فعالیت">
              <Edit3 className="h-4 w-4 text-blue-500" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="حذف فعالیت">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>تایید حذف فعالیت</AlertDialogTitle>
                  <AlertDialogDescription>
                    آیا از حذف این فعالیت ورزشی ({activity.activityType} در تاریخ {formatJalaliDateDisplay(parseISO(activity.date), 'jYYYY/jMM/jDD')}) مطمئن هستید؟
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>لغو</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} variant="destructive">حذف</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-center">
            <Clock className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
            <span className="font-medium">{activity.durationMinutes.toLocaleString('fa-IR')} دقیقه</span>
        </div>
        {activity.distanceKm !== null && activity.distanceKm !== undefined && (
          <div className="flex items-center">
            <MapPin className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
            <span className="font-medium">{activity.distanceKm.toLocaleString('fa-IR')} کیلومتر</span>
          </div>
        )}
        {activity.caloriesBurned !== null && activity.caloriesBurned !== undefined && (
          <div className="flex items-center">
            <Flame className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
            <span className="font-medium">{activity.caloriesBurned.toLocaleString('fa-IR')} کالری</span>
          </div>
        )}
        {activity.notes && (
            <div className="pt-2">
                <Label className="text-xs flex items-center mb-1 text-muted-foreground">
                    <Info className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" /> یادداشت‌ها
                </Label>
                <p className="text-foreground bg-secondary/30 p-2 rounded-md text-xs whitespace-pre-wrap">
                    {activity.notes}
                </p>
            </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-3 border-t">
        <span>
          ثبت شده در: {format(parseISO(activity.createdAt), "PPP - HH:mm", { locale: faIR })}
        </span>
      </CardFooter>
    </Card>
  );
};

export const SportsActivityItem = memo(SportsActivityItemComponent);
