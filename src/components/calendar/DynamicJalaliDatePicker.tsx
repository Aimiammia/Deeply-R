
'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
// Ensure the path to the original JalaliDatePicker is correct
import { JalaliDatePicker as OriginalJalaliDatePicker } from './JalaliDatePicker';
import { Skeleton } from '@/components/ui/skeleton';

// Define props type for the original component
type OriginalDatePickerProps = ComponentProps<typeof OriginalJalaliDatePicker>;

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

export function DynamicJalaliDatePicker(props: OriginalDatePickerProps) {
  return <DynamicDatePickerComponent {...props} />;
}

