

import type { ReflectionEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { memo } from 'react';
import { cn } from '@/lib/utils';


interface ReflectionHistoryItemProps {
  reflection: ReflectionEntry;
  onSelectReflection: (reflection: ReflectionEntry) => void;
  isSelected: boolean;
}

const ReflectionHistoryItemComponent = ({ reflection, onSelectReflection, isSelected }: ReflectionHistoryItemProps) => {
  return (
    <Card 
        className={cn(
            'transition-all duration-300 ease-in-out cursor-pointer', 
            isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md hover:border-primary/30'
        )}
        onClick={() => onSelectReflection(reflection)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-md font-headline">
          {format(parseISO(reflection.date), "eeee، d MMMM yyyy", { locale: faIR })}
        </CardTitle>
        <CardDescription className="truncate text-xs">
          نقل قول روز: {reflection.prompt}
        </CardDescription>
      </CardHeader>
      {isSelected && (
        <CardContent>
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
            {reflection.text}
            </p>
        </CardContent>
      )}
    </Card>
  );
};

export const ReflectionHistoryItem = memo(ReflectionHistoryItemComponent);
