
import { Quote } from 'lucide-react';

interface DailyPromptDisplayProps {
  prompt: string;
}

export function DailyPromptDisplay({ prompt }: DailyPromptDisplayProps) {
  return (
    <div className="flex items-start space-x-3 rtl:space-x-reverse p-1">
      <Quote className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
      <p className="text-lg text-foreground/90 italic">{prompt}</p>
    </div>
  );
}
