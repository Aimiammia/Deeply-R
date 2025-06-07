
'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar as CalendarIcon, Tag as CategoryIcon } from 'lucide-react'; // Changed Tag to CategoryIcon for clarity
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface CreateTaskFormProps {
  onAddTask: (title: string, dueDate?: Date | null, priority?: Task['priority'], category?: string | null) => void;
}

const predefinedCategories = [
  { value: 'کار', label: 'کار' },
  { value: 'شخصی', label: 'شخصی' },
  { value: 'خرید', label: 'خرید' },
  { value: 'مطالعه', label: 'مطالعه' },
  { value: 'ورزش', label: 'ورزش' },
  { value: 'پروژه', label: 'پروژه' },
  { value: 'درس', label: 'درس' },
  { value: 'متفرقه', label: 'متفرقه' },
];

export function CreateTaskForm({ onAddTask }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<Task['priority'] | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined); // Changed to string | undefined

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), dueDate ?? null, priority ?? null, category || null); // Pass category or null
      setTitle('');
      setDueDate(undefined);
      setPriority(undefined);
      setCategory(undefined); // Reset category
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="مثلاً: خرید شیر..."
        className="flex-grow text-base"
        aria-label="عنوان وظیفه جدید"
        required
      />
      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full sm:w-[200px] justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
              {dueDate ? format(dueDate, "PPP") : <span>انتخاب تاریخ سررسید</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={priority || ''} onValueChange={(value) => setPriority(value as Task['priority'])}>
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="میزان اهمیت وظیفه">
            <SelectValue placeholder="میزان اهمیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">کم</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="high">زیاد</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category || ''} onValueChange={(value) => setCategory(value === 'none' ? undefined : value)}>
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="دسته‌بندی وظیفه">
            <CategoryIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
            <SelectValue placeholder="انتخاب دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none"><em>بدون دسته‌بندی</em></SelectItem>
            {predefinedCategories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" disabled={!title.trim()} className="w-full sm:w-auto">
        <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
        افزودن وظیفه
      </Button>
    </form>
  );
}
