
'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicJalaliDatePicker } from '@/components/calendar/DynamicJalaliDatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Calendar as CalendarIcon, Tag as CategoryIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FinancialTransaction } from '@/types';
import { predefinedCategories, expenseCategories, incomeCategories } from '@/lib/financial-categories';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers'; 

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<FinancialTransaction, 'id' | 'createdAt'>) => void;
}

export function AddTransactionForm({ onAddTransaction }: AddTransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState<string | undefined>(undefined);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ''); // Remove commas
    setAmount(value === '' ? '' : parseFloat(value) || '');
  };

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

  const currentCategoryList = type === 'expense' ? expenseCategories : incomeCategories;

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
          type="text" // Change to text to allow commas, parsing will handle it
          value={amount === '' ? '' : amount.toLocaleString('en-US')} // Display with comma for user input
          onChange={handleAmountChange}
          placeholder="مثلا: 50,000"
          className="text-base"
          required
        />
      </div>

      <div>
        <Label className="mb-2 block">نوع تراکنش</Label>
        <div className="flex">
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            onClick={() => {
              setType('income');
              setCategory(undefined);
            }}
            className="flex-1 rounded-l-none"
          >
            درآمد
          </Button>
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            onClick={() => {
              setType('expense');
              setCategory(undefined);
            }}
            className="flex-1 rounded-r-none rtl:-mr-px"
          >
            هزینه
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        <div className="flex-1">
          <Label className="mb-1 block">تاریخ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                {date ? formatJalaliDateDisplay(date, 'jYYYY/jMM/jDD') : <span>انتخاب تاریخ</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DynamicJalaliDatePicker
                value={date}
                onChange={setDate}
                initialYear={date ? new Date(date).getFullYear() : undefined}
                initialMonth={date ? new Date(date).getMonth() + 1 : undefined}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex-1">
          <Label className="mb-1 block">دسته‌بندی</Label>
          <Select value={category || ''} onValueChange={(value) => setCategory(value === 'none' ? undefined : value)}>
            <SelectTrigger className="w-full" aria-label="دسته‌بندی تراکنش">
              <CategoryIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none"><em>بدون دسته‌بندی</em></SelectItem>
              {currentCategoryList.map(cat => (
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
