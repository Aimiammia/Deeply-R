
'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface CreateHabitFormProps {
  onAddHabit: (name: string) => void;
}

export function CreateHabitForm({ onAddHabit }: CreateHabitFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddHabit(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div>
        <Label htmlFor="habitName" className="mb-1 block text-sm font-medium">
          نام عادت جدید (روزانه)
        </Label>
        <div className="flex gap-2">
          <Input
            id="habitName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً: کتاب خواندن به مدت ۳۰ دقیقه"
            className="flex-grow text-base"
            required
          />
          <Button type="submit" disabled={!name.trim()} className="shrink-0">
            <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
            افزودن عادت
          </Button>
        </div>
      </div>
    </form>
  );
}
