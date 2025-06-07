
'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { LongTermGoal } from '@/types';

interface CreateLongTermGoalFormProps {
  onAddGoal: (goalData: Omit<LongTermGoal, 'id' | 'createdAt' | 'status'>) => void;
  existingGoal?: Omit<LongTermGoal, 'id' | 'createdAt' | 'status'> & { id?: string };
}

export function CreateLongTermGoalForm({ onAddGoal, existingGoal }: CreateLongTermGoalFormProps) {
  const [title, setTitle] = useState(existingGoal?.title || '');
  const [description, setDescription] = useState(existingGoal?.description || '');
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    existingGoal?.targetDate ? new Date(existingGoal.targetDate) : undefined
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddGoal({
        title: title.trim(),
        description: description.trim() || null,
        targetDate: targetDate ? targetDate.toISOString() : null,
      });
      if (!existingGoal) { // Reset form only if not editing
        setTitle('');
        setDescription('');
        setTargetDate(undefined);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4">
        {existingGoal?.id ? 'ویرایش هدف بلندمدت' : 'ایجاد هدف بلندمدت جدید'}
      </h3>
      
      <div>
        <Label htmlFor="goalTitle" className="mb-1 block">عنوان هدف</Label>
        <Input
          id="goalTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثلا: یادگیری یک زبان جدید، راه اندازی کسب و کار"
          className="text-base"
          required
        />
      </div>

      <div>
        <Label htmlFor="goalDescription" className="mb-1 block">توضیحات (اختیاری)</Label>
        <Textarea
          id="goalDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="جزئیات بیشتر در مورد هدف خود را اینجا بنویسید..."
          rows={4}
          className="text-base"
        />
      </div>

      <div>
        <Label className="mb-1 block">تاریخ هدف (اختیاری)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !targetDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
              {targetDate ? format(targetDate, "PPP", { locale: faIR }) : <span>انتخاب تاریخ هدف</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={targetDate}
              onSelect={setTargetDate}
              initialFocus
              dir="rtl"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button type="submit" disabled={!title.trim()} className="w-full">
        <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
        {existingGoal?.id ? 'ذخیره تغییرات هدف' : 'افزودن هدف'}
      </Button>
    </form>
  );
}
