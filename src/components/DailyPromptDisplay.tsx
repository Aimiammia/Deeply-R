
import type { ReactNode } from 'react';
import { memo } from 'react';

interface DailyPromptDisplayProps {
  prompt: string;
}

const DailyPromptDisplayComponent = ({ prompt }: DailyPromptDisplayProps) => {
  return (
    <div className="flex items-center">
      <p className="text-lg font-medium text-foreground italic leading-relaxed">
        {prompt}
      </p>
    </div>
  );
};

export const DailyPromptDisplay = memo(DailyPromptDisplayComponent);
