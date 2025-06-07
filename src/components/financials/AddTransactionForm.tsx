
'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Calendar as CalendarIcon, Tag as CategoryIcon } from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale'; // Corrected import
import { cn } from '@/lib/utils';
import type { FinancialTransaction } from '@/types';

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<FinancialTransaction, 'id' | 'createdAt'>) => void;
}

const predefinedCategories = [
  { value: 'خوراک', label: 'خوراک' },
  { value: 'حمل و نقل', label: 'حمل و نقل' },
  { value: 'مسکن', label: 'مسکن' },
  { value: 'قبوض', label: 'قبوض' },
  { value: 'سرگرمی', label: 'سرگرمی' },
  { value: 'سلامت', label: 'سلامت' },
  { value: 'پوشاک', label: 'پوشاک' },
  { value: 'خرید', label: 'خرید عمومی' },
  { value: 'حقوق', label: 'حقوق' },
  { value: 'هدایا', label: 'هدایا' },
  { value: 'تحصیلات', label: 'تحصیلات' },
  { value: 'سایر', label: 'سایر' },
];

export function AddTransactionForm({ onAddTransaction }: AddTransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState<string | undefined>(undefined);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (description.trim() && amount && date) {
      onAddTransaction({
        description: description.trim(),
        amount: Number(amount),
        type,
        date: date.toISOString(),
        category: category || null,
      });
      setDescription('');
      setAmount('');
      setType('expense');
      setDate(new Date());
      setCategory(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4">ثبت تراکنش جدید</h3>
      
      <div>
        <Label htmlFor="description" className="mb-1 block">شرح تراکنش</Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="مثلا: خرید ناهار، حقوق ماهانه"
          className="text-base"
          required
        />
      </div>

      <div>
        <Label htmlFor="amount" className="mb-1 block">مبلغ (تومان)</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
          placeholder="مثلا: 50000"
          className="text-base"
          required
          min="0"
        />
      </div>

      <div>
        <Label className="mb-2 block">نوع تراکنش</Label>
        <RadioGroup
          defaultValue="expense"
          value={type}
          onValueChange={(value: 'income' | 'expense') => setType(value)}
          className="flex space-x-4 rtl:space-x-reverse"
        >
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income">درآمد</Label>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense">هزینه</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <div>
          <Label className="mb-1 block">تاریخ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                {date ? format(date, "PPP", { locale: faIR }) : <span>انتخاب تاریخ</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                dir="rtl"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label className="mb-1 block">دسته‌بندی</Label>
          <Select value={category || ''} onValueChange={(value) => setCategory(value === 'none' ? undefined : value)}>
            <SelectTrigger className="w-full sm:w-[200px]" aria-label="دسته‌بندی تراکنش">
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
      </div>
      
      <Button type="submit" disabled={!description.trim() || !amount || !date} className="w-full">
        <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
        ثبت تراکنش
      </Button>
    </form>
  );
}
