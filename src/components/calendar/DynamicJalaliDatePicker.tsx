
'use client';

import dynamic from 'next/dynamic';
import type { JalaliDatePickerProps } from './JalaliDatePicker';
import { Skeleton } from '@/components/ui/skeleton';

const DynamicDatePickerComponent = dynamic(() =>
  import('./JalaliDatePicker').then(mod => mod.JalaliDatePicker),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-xs mx-auto bg-popover p-4 rounded-xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="grid grid-cols-7 gap-2 place-items-center">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-5 w-5 rounded-md" />)}
        </div>
        <div className="grid grid-cols-7 gap-2 place-items-center">
          {Array.from({ length: 35 }).map((_, i) => <Skeleton key={i} className="h-9 w-9 rounded-full" />)}
        </div>
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    ),
  }
);

export function DynamicJalaliDatePicker(props: JalaliDatePickerProps) {
  return <DynamicDatePickerComponent {...props} />;
}
