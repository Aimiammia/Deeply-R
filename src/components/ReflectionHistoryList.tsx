import type { ReflectionEntry } from '@/types';
import { ReflectionHistoryItem } from './ReflectionHistoryItem';
import { Archive } from 'lucide-react';

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
        <p className="text-lg">No reflections saved yet.</p>
        <p>Start by writing your first reflection above!</p>
      </div>
    );
  }

  return (
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
  );
}
