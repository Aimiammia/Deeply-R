
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicJalaliDatePicker } from '@/components/calendar/DynamicJalaliDatePicker';
import { PlusCircle, Save, Calendar as CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';

interface CreateProjectFormProps {
  onSaveProject: (projectData: Omit<Project, 'id' | 'createdAt'>, isEditing: boolean) => void;
  existingProject?: Project | null;
}

export function CreateProjectForm({ onSaveProject, existingProject }: CreateProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<Project['status']>('not-started');

  const isEditing = !!existingProject;

  useEffect(() => {
    if (existingProject) {
      setName(existingProject.name);
      setDescription(existingProject.description || '');
      setDueDate(existingProject.dueDate ? new Date(existingProject.dueDate) : undefined);
      setStatus(existingProject.status);
    } else {
      setName('');
      setDescription('');
      setDueDate(undefined);
      setStatus('not-started');
    }
  }, [existingProject]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSaveProject({
        name: name.trim(),
        description: description.trim() || null,
        dueDate: dueDate ? dueDate.toISOString() : null,
        status,
      }, isEditing);

      if (!isEditing) {
        setName('');
        setDescription('');
        setDueDate(undefined);
        setStatus('not-started');
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="projectName" className="mb-1 block">نام پروژه</Label>
        <Input
          id="projectName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثلا: بازطراحی وب‌سایت شخصی"
          className="text-base"
          required
        />
      </div>

      <div>
        <Label htmlFor="projectDescription" className="mb-1 block">توضیحات (اختیاری)</Label>
        <Textarea
          id="projectDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="جزئیات بیشتر در مورد پروژه..."
          rows={3}
          className="text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label className="mb-1 block">تاریخ سررسید (اختیاری)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                  {dueDate ? formatJalaliDateDisplay(dueDate, 'jYYYY/jMM/jDD') : <span>انتخاب تاریخ</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DynamicJalaliDatePicker value={dueDate} onChange={setDueDate} />
              </PopoverContent>
            </Popover>
        </div>
        <div>
          <Label htmlFor="projectStatus" className="mb-1 block">وضعیت</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as Project['status'])}>
            <SelectTrigger id="projectStatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">شروع نشده</SelectItem>
              <SelectItem value="in-progress">در حال انجام</SelectItem>
              <SelectItem value="completed">تکمیل شده</SelectItem>
              <SelectItem value="on-hold">متوقف شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" disabled={!name.trim()} className="w-full">
        {isEditing ? <Save className="mr-2 h-5 w-5" /> : <PlusCircle className="mr-2 h-5 w-5" />}
        {isEditing ? 'ذخیره تغییرات' : 'افزودن پروژه'}
      </Button>
    </form>
  );
}
