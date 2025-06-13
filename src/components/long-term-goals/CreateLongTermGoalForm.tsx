
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicJalaliDatePicker } from '@/components/calendar/DynamicJalaliDatePicker'; 
import { PlusCircle, Calendar as CalendarIcon, Trash2, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LongTermGoal, Milestone } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers'; 
import { generateId } from '@/lib/utils';

interface CreateLongTermGoalFormProps {
  onSaveGoal: (goalData: Omit<LongTermGoal, 'id' | 'createdAt'>, isEditing: boolean) => void;
  existingGoal?: LongTermGoal | null;
}

export function CreateLongTermGoalForm({ onSaveGoal, existingGoal }: CreateLongTermGoalFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<LongTermGoal['status']>('not-started');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneName, setNewMilestoneName] = useState('');

  const isEditing = !!existingGoal;

  useEffect(() => {
    if (existingGoal) {
      setTitle(existingGoal.title);
      setDescription(existingGoal.description || '');
      setTargetDate(existingGoal.targetDate ? new Date(existingGoal.targetDate) : undefined);
      setStatus(existingGoal.status);
      setSuccessCriteria(existingGoal.successCriteria || '');
      setMilestones(existingGoal.milestones || []);
    } else {
      setTitle('');
      setDescription('');
      setTargetDate(undefined);
      setStatus('not-started');
      setSuccessCriteria('');
      setMilestones([]);
    }
  }, [existingGoal]);

  const handleAddMilestone = () => {
    if (newMilestoneName.trim()) {
      setMilestones([...milestones, { id: generateId(), name: newMilestoneName.trim(), completed: false }]);
      setNewMilestoneName('');
    }
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSaveGoal({
        title: title.trim(),
        description: description.trim() || null,
        targetDate: targetDate ? targetDate.toISOString() : null,
        status,
        successCriteria: successCriteria.trim() || null,
        milestones: milestones.length > 0 ? milestones : null,
        ...(isEditing && existingGoal ? { id: existingGoal.id } : {}), 
      }, isEditing);

      if (!isEditing) {
        setTitle('');
        setDescription('');
        setTargetDate(undefined);
        setStatus('not-started');
        setSuccessCriteria('');
        setMilestones([]);
        setNewMilestoneName('');
      }
       toast({
          title: isEditing ? "هدف ویرایش شد" : "هدف اضافه شد",
          description: `هدف بلندمدت "${title.trim()}" با موفقیت ${isEditing ? 'ویرایش' : 'ذخیره'} شد.`,
        });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4">
        {isEditing ? 'ویرایش هدف بلندمدت' : 'ایجاد هدف بلندمدت جدید'}
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
          rows={3}
          className="text-base"
        />
      </div>
      
      <div>
        <Label htmlFor="goalSuccessCriteria" className="mb-1 block">معیارهای موفقیت (اختیاری)</Label>
        <Textarea
          id="goalSuccessCriteria"
          value={successCriteria}
          onChange={(e) => setSuccessCriteria(e.target.value)}
          placeholder="چگونه متوجه می‌شوید که به این هدف دست یافته‌اید؟"
          rows={3}
          className="text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {targetDate ? formatJalaliDateDisplay(targetDate, 'jYYYY/jMM/jDD') : <span>انتخاب تاریخ هدف</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <DynamicJalaliDatePicker 
                    value={targetDate}
                    onChange={setTargetDate}
                    initialYear={targetDate ? new Date(targetDate).getFullYear() : undefined}
                    initialMonth={targetDate ? new Date(targetDate).getMonth() + 1 : undefined}
                />
            </PopoverContent>
            </Popover>
        </div>
        <div>
            <Label htmlFor="goalStatus" className="mb-1 block">وضعیت</Label>
            <select
            id="goalStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value as LongTermGoal['status'])}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
            <option value="not-started">شروع نشده</option>
            <option value="in-progress">در حال انجام</option>
            <option value="completed">تکمیل شده</option>
            <option value="on-hold">متوقف شده</option>
            </select>
        </div>
      </div>

      <div>
        <Label className="mb-2 block flex items-center"><ListChecks className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0"/> نقاط عطف (اختیاری)</Label>
        <div className="space-y-2">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center gap-2 p-2 border rounded-md bg-secondary/30">
              <span className="flex-grow text-sm">{milestone.name}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveMilestone(milestone.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Input
            type="text"
            value={newMilestoneName}
            onChange={(e) => setNewMilestoneName(e.target.value)}
            placeholder="نام نقطه عطف جدید"
            className="text-sm flex-grow"
          />
          <Button type="button" onClick={handleAddMilestone} variant="outline" size="sm">افزودن</Button>
        </div>
      </div>
      
      <Button type="submit" disabled={!title.trim()} className="w-full">
        <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
        {isEditing ? 'ذخیره تغییرات هدف' : 'افزودن هدف'}
      </Button>
    </form>
  );
}
