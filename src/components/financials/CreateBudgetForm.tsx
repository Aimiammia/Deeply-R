
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2, Tag as CategoryIcon } from 'lucide-react';
import type { Budget } from '@/types';
import { expenseCategories } from '@/lib/financial-categories'; 

interface CreateBudgetFormProps {
  onSetBudget: (category: string, amount: number) => void;
  existingBudget?: Budget | null; 
}

export function CreateBudgetForm({ onSetBudget, existingBudget }: CreateBudgetFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [budgetAmount, setBudgetAmount] = useState<number | ''>('');

  useEffect(() => {
    if (existingBudget) {
      setSelectedCategory(existingBudget.category);
      setBudgetAmount(existingBudget.amount);
    } else {
      setSelectedCategory('');
      setBudgetAmount('');
    }
  }, [existingBudget]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ''); // Remove commas
    setBudgetAmount(value === '' ? '' : parseFloat(value) || '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedCategory && budgetAmount && Number(budgetAmount) > 0) {
      onSetBudget(selectedCategory, Number(budgetAmount));
      if (!existingBudget) {
        setSelectedCategory('');
        setBudgetAmount('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-sm bg-card mb-6">
      <h3 className="text-lg font-semibold text-primary flex items-center">
        <Settings2 className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
        {existingBudget ? 'ویرایش بودجه' : 'تنظیم بودجه ماهانه جدید'}
      </h3>
      
      <div>
        <Label htmlFor="budgetCategory" className="mb-1 block">دسته‌بندی هزینه</Label>
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
          disabled={!!existingBudget} 
        >
          <SelectTrigger id="budgetCategory" className="w-full" aria-label="انتخاب دسته‌بندی برای بودجه">
            <CategoryIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
            <SelectValue placeholder="یک دسته‌بندی انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            {expenseCategories.map(cat => (
              <SelectItem key={cat.value} value={cat.value} disabled={!!existingBudget && existingBudget.category !== cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="budgetAmount" className="mb-1 block">مبلغ بودجه (تومان)</Label>
        <Input
          id="budgetAmount"
          type="text" // Change to text
          value={budgetAmount === '' ? '' : budgetAmount.toLocaleString('en-US')} // Display with comma
          onChange={handleAmountChange}
          placeholder="مثلا: 200,000"
          className="text-base"
          required
        />
      </div>
      
      <Button type="submit" disabled={!selectedCategory || !budgetAmount || Number(budgetAmount) <= 0} className="w-full">
        <Settings2 className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
        {existingBudget ? 'ذخیره تغییرات بودجه' : 'تنظیم بودجه'}
      </Button>
    </form>
  );
}
