
'use client';

import { type ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirestore } from '@/hooks/useFirestore';
import { Brain } from 'lucide-react';
import type { Task, Habit, CalendarEvent, BirthdayEntry } from '@/types';

/**
 * AppGuard handles the initial loading state for the application.
 * It ensures that essential data is fetched before rendering any page,
 * displaying a global loading screen in the meantime.
 */
export function AppGuard({ children }: { children: ReactNode }) {
  // Pre-fetch all data needed for the main dashboard to ensure a smooth initial load.
  // The 'isLoading' states from these hooks will determine the global loading screen.
  const [, , tasksLoading] = useFirestore<Task[]>('dailyTasksPlanner', []);
  const [, , habitsLoading] = useFirestore<Habit[]>('userHabitsDeeply', []);
  const [, , eventsLoading] = useFirestore<CalendarEvent[]>('calendarEventsDeeply', []);
  const [, , birthdaysLoading] = useFirestore<BirthdayEntry[]>('calendarBirthdaysDeeply', []);

  // Combine all loading states into one. The app is loading if any data source is loading.
  const isAppLoading = tasksLoading || habitsLoading || eventsLoading || birthdaysLoading;

  if (isAppLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
        <p className="mt-4 text-muted-foreground">در حال بارگذاری...</p>
      </div>
    );
  }

  // Once all data is loaded, render the actual page content.
  return <>{children}</>;
}
