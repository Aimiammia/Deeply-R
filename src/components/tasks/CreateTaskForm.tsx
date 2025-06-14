
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar as CalendarIcon, Tag as CategoryIcon, BookOpen, ListFilter, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicJalaliDatePicker } from '@/components/calendar/DynamicJalaliDatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';
import { educationalSubjects, type Subject as EducationalSubject } from '@/lib/educational-data';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';

interface CreateTaskFormProps {
  onAddTask: (
    title: string,
    dueDate?: Date | null,
    dueTime?: string | null,
    priority?: Task['priority'],
    category?: string | null,
    subjectId?: string | null,
    subjectName?: string | null,
    startChapter?: number | null,
    endChapter?: number | null,
    educationalLevelContext?: string | null
  ) => void;
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
  const [dueTime, setDueTime] = useState<string>('');
  const [priority, setPriority] = useState<Task['priority'] | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const [userEducationalLevel, setUserEducationalLevel] = useState<string | null>(null);
  const [isLevelConfirmed, setIsLevelConfirmed] = useState<boolean>(false);
  const [availableSubjects, setAvailableSubjects] = useState<EducationalSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<EducationalSubject | null>(null);
  const [startChapter, setStartChapter] = useState<number | ''>('');
  const [endChapter, setEndChapter] = useState<number | ''>('');

  useEffect(() => {
    const storedLevelData = localStorage.getItem('educationalLevelSettingsDeeply');
    if (storedLevelData) {
        try {
            const settings = JSON.parse(storedLevelData);
            setUserEducationalLevel(settings.levelValue || null);
            setIsLevelConfirmed(settings.isConfirmed || false);
        } catch (e) {
            console.error("Failed to parse educational settings from localStorage", e);
        }
    }
  }, []);

  useEffect(() => {
    if (category === 'درس' && userEducationalLevel && isLevelConfirmed) {
      setAvailableSubjects(educationalSubjects[userEducationalLevel] || []);
    } else {
      setAvailableSubjects([]);
      setSelectedSubject(null);
      setStartChapter('');
      setEndChapter('');
    }
  }, [category, userEducationalLevel, isLevelConfirmed]);

  const handleSubjectChange = (subjectId: string) => {
    const subject = availableSubjects.find(s => s.id === subjectId);
    setSelectedSubject(subject || null);
    setStartChapter('');
    setEndChapter('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (category === 'درس' && selectedSubject) {
        onAddTask(
          title.trim(),
          dueDate ?? null,
          dueTime || null,
          priority ?? null,
          category || null,
          selectedSubject.id,
          selectedSubject.name,
          startChapter !== '' ? Number(startChapter) : null,
          endChapter !== '' ? Number(endChapter) : null,
          userEducationalLevel
        );
      } else {
        onAddTask(title.trim(), dueDate ?? null, dueTime || null, priority ?? null, category || null);
      }

      setTitle('');
      setDueDate(undefined);
      setDueTime('');
      setPriority(undefined);
      setCategory(undefined);
      setSelectedSubject(null);
      setStartChapter('');
      setEndChapter('');
      setAvailableSubjects([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg shadow bg-card">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="مثلاً: انجام تمرینات فصل ۳ ریاضی..."
        className="flex-grow text-base"
        aria-label="عنوان وظیفه جدید"
        required
      />
      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <div className="flex-1">
          <Label htmlFor="dueDate" className="mb-1 block text-xs">تاریخ سررسید</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dueDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                {dueDate ? formatJalaliDateDisplay(dueDate, 'jYYYY/jMM/jDD') : <span>انتخاب تاریخ</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DynamicJalaliDatePicker
                value={dueDate}
                onChange={setDueDate}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {dueDate && (
          <div className="flex-1">
            <Label htmlFor="dueTime" className="mb-1 block text-xs">ساعت (اختیاری)</Label>
            <Input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full"
              aria-label="ساعت سررسید وظیفه"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <Select value={priority || ''} onValueChange={(value) => setPriority(value as Task['priority'])}>
          <SelectTrigger className="w-full sm:flex-1" aria-label="میزان اهمیت وظیفه">
            <ListFilter className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
            <SelectValue placeholder="میزان اهمیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none"><em>بدون اولویت</em></SelectItem>
            <SelectItem value="low">کم</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="high">زیاد</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category || ''} onValueChange={(value) => setCategory(value === 'none' ? undefined : value)}>
          <SelectTrigger className="w-full sm:flex-1" aria-label="دسته‌بندی وظیفه">
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

      {category === 'درس' && isLevelConfirmed && userEducationalLevel && (
        <div className="space-y-4 p-3 border rounded-md bg-secondary/30">
          <h4 className="text-sm font-semibold text-primary flex items-center">
            <BookOpen className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
            جزئیات درس
          </h4>
          {!availableSubjects.length && <p className="text-xs text-muted-foreground">ابتدا مقطع تحصیلی خود را در بخش "تحصیل" مشخص و تایید کنید یا برای مقطع فعلی درسی تعریف نشده است.</p>}
          
          {availableSubjects.length > 0 && (
            <>
              <div>
                <Label htmlFor="subjectSelect" className="mb-1 block text-xs">انتخاب درس</Label>
                <Select value={selectedSubject?.id || ''} onValueChange={handleSubjectChange}>
                  <SelectTrigger id="subjectSelect" className="w-full" aria-label="انتخاب درس">
                    <SelectValue placeholder="درس را انتخاب کنید..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map(subj => (
                      <SelectItem key={subj.id} value={subj.id}>{subj.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSubject && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="startChapter" className="mb-1 block text-xs">از فصل</Label>
                    <Input
                      id="startChapter"
                      type="number"
                      value={startChapter}
                      onChange={(e) => setStartChapter(parseInt(e.target.value) || '')}
                      placeholder="مثلا: ۱"
                      min="1"
                      max={selectedSubject.totalChapters}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="endChapter" className="mb-1 block text-xs">تا فصل (کل فصل‌ها: {selectedSubject.totalChapters})</Label>
                    <Input
                      id="endChapter"
                      type="number"
                      value={endChapter}
                      onChange={(e) => setEndChapter(parseInt(e.target.value) || '')}
                      placeholder={`مثلا: ${selectedSubject.totalChapters}`}
                      min={startChapter || 1}
                      max={selectedSubject.totalChapters}
                      className="text-sm"
                      disabled={!startChapter}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      <Button type="submit" disabled={!title.trim()} className="w-full">
        <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
        افزودن وظیفه
      </Button>
    </form>
  );
}
