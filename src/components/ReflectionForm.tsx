
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ReflectionFormProps {
  onSaveReflection: (reflectionText: string) => void;
  isLoading: boolean;
}

export function ReflectionForm({ onSaveReflection, isLoading }: ReflectionFormProps) {
  const [reflectionText, setReflectionText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (reflectionText.trim()) {
      onSaveReflection(reflectionText.trim());
      setReflectionText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={reflectionText}
        onChange={(e) => setReflectionText(e.target.value)}
        placeholder="تأمل خود را اینجا بنویسید..."
        rows={6}
        className="text-base"
        disabled={isLoading}
        aria-label="Reflection input area"
      />
      <Button type="submit" disabled={isLoading || !reflectionText.trim()} className="w-full sm:w-auto">
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Saving...' : 'Save Reflection'}
      </Button>
    </form>
  );
}
