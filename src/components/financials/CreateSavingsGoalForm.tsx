
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, PlusCircle, Edit3, PiggyBank, Save } from 'lucide-react'; 
import { DynamicJalaliDatePicker } from '@/components/calendar/DynamicJalaliDatePicker'; // Changed
import { cn } from '@/lib/utils';
import type { SavingsGoal } from '@/types';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers'; 

interface CreateSavingsGoalFormProps {
  onSaveGoal: (goalData: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount' | 'status'>, isEditing: boolean) => void;
  existingGoal?: SavingsGoal | null;
}

export function CreateSavingsGoalForm({ onSaveGoal, existingGoal }: CreateSavingsGoalFormProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);

  const isEditing = !!existingGoal;

  useEffect(() => {
    if (existingGoal) {
      setName(existingGoal.name);
      setTargetAmount(existingGoal.targetAmount);
      setTargetDate(existingGoal.targetDate ? new Date(existingGoal.targetDate) : undefined);
    } else {
      setName('');
      setTargetAmount('');
      setTargetDate(undefined);
    }
  }, [existingGoal]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() && targetAmount !== '' && Number(targetAmount) > 0) {
      onSaveGoal({
        name: name.trim(),
        targetAmount: Number(targetAmount),
        targetDate: targetDate ? targetDate.toISOString() : null,
      }, isEditing);

      if (!isEditing) {
        setName('');
        setTargetAmount('');
        setTargetDate(undefined);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        {isEditing ? <Edit3 className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> : <PiggyBank className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />}
        {isEditing ? 'ویرایش هدف پس‌انداز' : 'افزودن هدف پس‌انداز جدید'}
      </h3>
      
      <div>
        <Label htmlFor="goalName" className="mb-1 block">نام هدف</Label>
        <Input
          id="goalName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثلا: خرید لپ‌تاپ جدید، سفر به شمال"
          className="text-base"
          required
        />
      </div>

      <div>
        <Label htmlFor="targetAmount" className="mb-1 block">مبلغ هدف (تومان)</Label>
        <Input
          id="targetAmount"
          type="number"
          value={targetAmount}
          onChange={(e) => setTargetAmount(parseFloat(e.target.value) || '')}
          placeholder="مثلا: 30000000"
          className="text-base"
          required
          min="1"
        />
      </div>
      
      <div>
        <Label htmlFor="targetDate" className="mb-1 block">تاریخ هدف (اختیاری)</Label>
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
              {targetDate ? formatJalaliDateDisplay(targetDate, 'jYYYY/jMM/jDD') : <span>انتخاب تاریخ</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <DynamicJalaliDatePicker // Changed
              value={targetDate}
              onChange={setTargetDate}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button type="submit" disabled={!name.trim() || targetAmount === '' || Number(targetAmount) <= 0} className="w-full">
        {isEditing ? <Save className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" /> : <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />}
        {isEditing ? 'ذخیره تغییرات' : 'افزودن هدف'}
      </Button>
    </form>
  );
}
