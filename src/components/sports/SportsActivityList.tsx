
'use client';

import type { SportsActivity } from '@/types';
import { SportsActivityItem } from './SportsActivityItem';
import { Dumbbell } from 'lucide-react';

interface SportsActivityListProps {
  activities: SportsActivity[];
  onDeleteActivity: (id: string) => void;
  onEditActivity: (activity: SportsActivity) => void;
}

export function SportsActivityList({ activities, onDeleteActivity, onEditActivity }: SportsActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card mt-6">
        <Dumbbell className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز فعالیتی ورزشی ثبت نشده است.</p>
        <p>اولین فعالیت خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedActivities = [...activities].sort((a, b) => {
    // Sort by date first (newest first), then by creation time (newest first)
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-4">لیست فعالیت‌های ورزشی شما</h3>
      <ul className="space-y-0">
        {sortedActivities.map((activity) => (
          <SportsActivityItem
            key={activity.id}
            activity={activity}
            onDeleteActivity={onDeleteActivity}
            onEditActivity={onEditActivity}
          />
        ))}
      </ul>
    </div>
  );
}
