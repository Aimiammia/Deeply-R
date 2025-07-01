
'use client';

import dynamic from 'next/dynamic';
import type { JalaliDatePickerProps } from './JalaliDatePicker';
import { Skeleton } from '@/components/ui/skeleton';

const DynamicDatePickerComponent = dynamic(() =>
  import('./JalaliDatePicker').then(mod => mod.JalaliDatePicker),
  {
    ssr: false,
    loading: () => (
        <div className="w-full p-3 rounded-md shadow-md flex items-center justify-center bg-popover min-h-[300px]">
            <Skeleton className="h-[280px] w-[260px]" />
        </div>
    ),
  }
);

export function DynamicJalaliDatePicker(props: JalaliDatePickerProps) {
  return <DynamicDatePickerComponent {...props} />;
}
