
// import { Quote } from 'lucide-react'; // Icon import removed

interface DailyPromptDisplayProps {
  prompt: string;
}

export function DailyPromptDisplay({ prompt }: DailyPromptDisplayProps) {
  return (
    // The parent div (e.g., in section/1/page.tsx) usually provides overall padding and background.
    // This component focuses on the text styling now.
    <div className="flex items-center"> {/* space-x-3 rtl:space-x-reverse removed as icon is gone */}
      {/* Quote icon removed */}
      <p className="text-lg font-medium text-foreground italic leading-relaxed"> {/* Current text styling retained */}
        {prompt}
      </p>
    </div>
  );
}
