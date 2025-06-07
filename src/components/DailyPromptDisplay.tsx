
import { Quote } from 'lucide-react';

interface DailyPromptDisplayProps {
  prompt: string;
}

export function DailyPromptDisplay({ prompt }: DailyPromptDisplayProps) {
  return (
    // The parent div (e.g., in section/1/page.tsx) usually provides overall padding and background.
    // This component focuses on the icon and text styling.
    <div className="flex items-center space-x-3 rtl:space-x-reverse"> {/* Align items vertically centered */}
      <Quote className="h-7 w-7 text-accent flex-shrink-0" /> {/* Slightly larger icon */}
      <p className="text-lg font-medium text-foreground italic leading-relaxed"> {/* Changed weight, full opacity, added leading-relaxed */}
        {prompt}
      </p>
    </div>
  );
}
