
'use client';

import { useState, type FormEvent, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicJalaliDatePicker } from '@/components/calendar/DynamicJalaliDatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Calendar as CalendarIcon, Activity, Edit3, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SportsActivity } from '@/types';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
import { useToast } from '@/hooks/use-toast';

interface AddSportsActivityFormProps {
  onSaveActivity: (activityData: Omit<SportsActivity, 'id' | 'createdAt'>, isEditing: boolean) => void;
  existingActivity?: SportsActivity | null;
}

const activityTypes: { value: SportsActivity['activityType']; label: string }[] = [
  { value: 'running', label: 'دویدن' },
  { value: 'walking', label: 'پیاده‌روی' },
  { value: 'cycling', label: 'دوچرخه‌سواری' },
  { value: 'swimming', label: 'شنا' },
  { value: 'gym', label: 'باشگاه (بدنسازی)' },
  { value: 'yoga', label: 'یوگا' },
  { value: 'pilates', label: 'پیلاتس' },
  { value: 'hiking', label: 'کوه‌پیمایی' },
  { value: 'sports_team', label: 'ورزش تیمی (فوتبال، بسکتبال و...)' },
  { value: 'other', label: 'سایر' },
];

export function AddSportsActivityForm({ onSaveActivity, existingActivity }: AddSportsActivityFormProps) {
  const { toast } = useToast();
  const [activityType, setActivityType] = useState<SportsActivity['activityType'] | undefined>(existingActivity?.activityType);
  const [date, setDate] = useState<Date | undefined>(existingActivity ? new Date(existingActivity.date) : new Date());
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(existingActivity?.durationMinutes || '');
  const [distanceKm, setDistanceKm] = useState<number | ''>(existingActivity?.distanceKm || '');
  const [caloriesBurned, setCaloriesBurned] = useState<number | ''>(existingActivity?.caloriesBurned || '');
  const [notes, setNotes] = useState(existingActivity?.notes || '');

  const isEditing = !!existingActivity;

  useEffect(() => {
    if (isEditing && existingActivity) {
      setActivityType(existingActivity.activityType);
      setDate(new Date(existingActivity.date));
      setDurationMinutes(existingActivity.durationMinutes);
      setDistanceKm(existingActivity.distanceKm || '');
      setCaloriesBurned(existingActivity.caloriesBurned || '');
      setNotes(existingActivity.notes || '');
    }
  }, [existingActivity, isEditing]);

  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value === '' ? '' : parseFloat(value) || '');
  };

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (activityType && date && durationMinutes !== '' && Number(durationMinutes) > 0) {
      onSaveActivity({
        activityType,
        date: date.toISOString(),
        durationMinutes: Number(durationMinutes),
        distanceKm: distanceKm !== '' ? Number(distanceKm) : null,
        caloriesBurned: caloriesBurned !== '' ? Number(caloriesBurned) : null,
        notes: notes.trim() || null,
      }, isEditing);

      if (!isEditing) {
        setActivityType(undefined);
        setDate(new Date());
        setDurationMinutes('');
        setDistanceKm('');
        setCaloriesBurned('');
        setNotes('');
      }
      toast({
        title: isEditing ? "فعالیت ویرایش شد" : "فعالیت ثبت شد",
        description: `فعالیت ورزشی با موفقیت ${isEditing ? 'ویرایش' : 'ذخیره'} شد.`,
      });
    } else {
      toast({
        title: "اطلاعات ناقص",
        description: "لطفاً نوع فعالیت، تاریخ و مدت زمان را وارد کنید.",
        variant: "destructive",
      });
    }
  }, [activityType, date, durationMinutes, distanceKm, caloriesBurned, notes, isEditing, onSaveActivity, toast]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        {isEditing ? <Edit3 className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> : <PlusCircle className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />}
        {isEditing ? 'ویرایش فعالیت ورزشی' : 'ثبت فعالیت ورزشی جدید'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="activityType" className="mb-1 block">نوع فعالیت</Label>
          <Select value={activityType} onValueChange={(value) => setActivityType(value as SportsActivity['activityType'])} required>
            <SelectTrigger id="activityType" className="w-full" aria-label="نوع فعالیت ورزشی">
              <Activity className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
              <SelectValue placeholder="انتخاب نوع فعالیت" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map(at => (
                <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="activityDate" className="mb-1 block">تاریخ فعالیت</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="activityDate"
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                {date ? formatJalaliDateDisplay(date, 'jYYYY/jMM/jDD') : <span>انتخاب تاریخ</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DynamicJalaliDatePicker value={date} onChange={setDate} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="durationMinutes" className="mb-1 block">مدت زمان (دقیقه)</Label>
          <Input
            id="durationMinutes"
            type="number"
            value={durationMinutes}
            onChange={handleNumericInputChange(setDurationMinutes)}
            placeholder="مثلا: ۳۰"
            min="1"
            required
          />
        </div>
        <div>
          <Label htmlFor="distanceKm" className="mb-1 block">مسافت (کیلومتر - اختیاری)</Label>
          <Input
            id="distanceKm"
            type="number"
            value={distanceKm}
            onChange={handleNumericInputChange(setDistanceKm)}
            placeholder="مثلا: ۵.۵"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <Label htmlFor="caloriesBurned" className="mb-1 block">کالری سوزانده شده (اختیاری)</Label>
          <Input
            id="caloriesBurned"
            type="number"
            value={caloriesBurned}
            onChange={handleNumericInputChange(setCaloriesBurned)}
            placeholder="مثلا: ۳۵۰"
            min="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="activityNotes" className="mb-1 block">یادداشت (اختیاری)</Label>
        <Textarea
          id="activityNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="جزئیات بیشتر در مورد فعالیت (مثلا: مسیر دویدن، شدت تمرین)"
          rows={3}
        />
      </div>
      
      <Button type="submit" className="w-full">
        {isEditing ? <Edit3 className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" /> : <Dumbbell className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />}
        {isEditing ? 'ذخیره تغییرات' : 'ثبت فعالیت'}
      </Button>
    </form>
  );
}
