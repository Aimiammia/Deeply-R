import { Lightbulb } from 'lucide-react';

interface DailyPromptDisplayProps {
  prompt: string;
}

export function DailyPromptDisplay({ prompt }: DailyPromptDisplayProps) {
  return (
    <div className="flex items-start space-x-3 p-1">
      <Lightbulb className="h-6 w-6 text-accent-foreground flex-shrink-0 mt-1" />
      <p className="text-lg text-foreground">{prompt}</p>
    </div>
  );
}
