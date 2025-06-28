import type { ReflectionEntry } from '@/types';
import { ReflectionHistoryItem } from './ReflectionHistoryItem';
import { Archive } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReflectionHistoryListProps {
  reflections: ReflectionEntry[];
  onSelectReflection: (reflection: ReflectionEntry) => void;
  selectedReflectionId?: string | null;
}

export function ReflectionHistoryList({ reflections, onSelectReflection, selectedReflectionId }: ReflectionHistoryListProps) {
  if (reflections.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Archive className="mx-auto h-12 w-12 mb-4" />
        <p className="text-lg">هنوز تأملی ثبت نشده است.</p>
        <p>اولین تأمل خود را بنویسید!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-3 rtl:pl-3">
        <div className="space-y-4">
        {reflections.map((reflection) => (
            <ReflectionHistoryItem 
            key={reflection.id} 
            reflection={reflection} 
            onSelectReflection={onSelectReflection}
            isSelected={reflection.id === selectedReflectionId}
            />
        ))}
        </div>
    </ScrollArea>
  );
}
