
'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface CreateTaskFormProps {
  onAddTask: (title: string) => void;
}

export function CreateTaskForm({ onAddTask }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="مثلاً: خرید شیر..."
        className="flex-grow text-base"
        aria-label="عنوان وظیفه جدید"
      />
      <Button type="submit" disabled={!title.trim()} className="shrink-0">
        <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
        افزودن وظیفه
      </Button>
    </form>
  );
}
