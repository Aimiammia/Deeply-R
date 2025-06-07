import type { ReflectionEntry } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';


interface ReflectionHistoryItemProps {
  reflection: ReflectionEntry;
  onSelectReflection: (reflection: ReflectionEntry) => void;
  isSelected: boolean;
}

export function ReflectionHistoryItem({ reflection, onSelectReflection, isSelected }: ReflectionHistoryItemProps) {
  return (
    <Card className={`transition-all duration-300 ease-in-out ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
      <CardHeader>
        <CardTitle className="text-lg font-headline">
          {format(parseISO(reflection.date), 'MMMM d, yyyy')}
        </CardTitle>
        <CardDescription className="truncate text-sm">
          Prompt: {reflection.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-foreground mb-4">
          {reflection.text}
        </p>
        <Button 
          variant={isSelected ? "default" : "outline"} 
          size="sm" 
          onClick={() => onSelectReflection(reflection)}
          aria-label={`View details for reflection from ${format(parseISO(reflection.date), 'MMMM d, yyyy')}`}
        >
          <Eye className="mr-2 h-4 w-4" />
          {isSelected ? 'Viewing Details' : 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
}
