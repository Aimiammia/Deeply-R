
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, PlusCircle, Edit3, TrendingUp, DollarSign } from 'lucide-react';
import { DynamicJalaliDatePicker } from '@/components/calendar/DynamicJalaliDatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { FinancialInvestment } from '@/types';
import { investmentTypes } from '@/lib/investment-types';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers'; 

interface CreateInvestmentFormProps {
  onSaveInvestment: (investmentData: Omit<FinancialInvestment, 'id' | 'createdAt' | 'lastPriceUpdateDate'>, isEditing: boolean) => void;
  existingInvestment?: FinancialInvestment | null;
}

export function CreateInvestmentForm({ onSaveInvestment, existingInvestment }: CreateInvestmentFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<FinancialInvestment['type'] | undefined>(undefined);
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [quantity, setQuantity] = useState<number | ''>('');
  const [purchasePricePerUnit, setPurchasePricePerUnit] = useState<number | ''>('');
  const [fees, setFees] = useState<number | ''>(0);
  const [currentPricePerUnit, setCurrentPricePerUnit] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const isEditing = !!existingInvestment;

  useEffect(() => {
    if (existingInvestment) {
      setName(existingInvestment.name);
      setType(existingInvestment.type);
      setPurchaseDate(new Date(existingInvestment.purchaseDate));
      setQuantity(existingInvestment.quantity);
      setPurchasePricePerUnit(existingInvestment.purchasePricePerUnit);
      setFees(existingInvestment.fees);
      setCurrentPricePerUnit(existingInvestment.currentPricePerUnit);
      setNotes(existingInvestment.notes || '');
    } else {
      setName('');
      setType(undefined);
      setPurchaseDate(new Date());
      setQuantity('');
      setPurchasePricePerUnit('');
      setFees(0);
      setCurrentPricePerUnit('');
      setNotes('');
    }
  }, [existingInvestment]);

  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>, allowZero: boolean = false) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '') {
      setter('');
    } else {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        setter(parsed);
      } else if (allowZero && value === '0') {
        setter(0);
      } else {
        setter(''); // Or keep previous valid value
      }
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setQuantity(value === '' ? '' : parseFloat(value) || '');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() && type && purchaseDate && quantity !== '' && purchasePricePerUnit !== '' && currentPricePerUnit !== '') {
      onSaveInvestment({
        name: name.trim(),
        type,
        purchaseDate: purchaseDate.toISOString(),
        quantity: Number(quantity),
        purchasePricePerUnit: Number(purchasePricePerUnit),
        fees: Number(fees) || 0,
        currentPricePerUnit: Number(currentPricePerUnit),
        notes: notes.trim() || null,
      }, isEditing);

      if (!isEditing) {
        setName('');
        setType(undefined);
        setPurchaseDate(new Date());
        setQuantity('');
        setPurchasePricePerUnit('');
        setFees(0);
        setCurrentPricePerUnit('');
        setNotes('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        {isEditing ? <Edit3 className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> : <PlusCircle className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />}
        {isEditing ? 'ویرایش سرمایه‌گذاری' : 'افزودن سرمایه‌گذاری جدید'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="investmentName" className="mb-1 block">نام سرمایه‌گذاری</Label>
          <Input
            id="investmentName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلا: سهام شرکت الف، بیت‌کوین"
            className="text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="investmentType" className="mb-1 block">نوع سرمایه‌گذاری</Label>
          <Select value={type} onValueChange={(value) => setType(value as FinancialInvestment['type'])} required>
            <SelectTrigger id="investmentType" className="w-full" aria-label="نوع سرمایه‌گذاری">
              <TrendingUp className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
              <SelectValue placeholder="انتخاب نوع" />
            </SelectTrigger>
            <SelectContent>
              {investmentTypes.map(it => (
                <SelectItem key={it.value} value={it.value}>{it.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity" className="mb-1 block">تعداد / مقدار</Label>
          <Input
            id="quantity"
            type="text" // Allow for decimals and commas
            value={quantity === '' ? '' : quantity.toLocaleString('en-US')}
            onChange={handleQuantityChange}
            placeholder="مثلا: 100 یا 0.5"
            className="text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="purchaseDate" className="mb-1 block">تاریخ خرید</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !purchaseDate && "text-muted-foreground")}
              >
                <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                {purchaseDate ? formatJalaliDateDisplay(purchaseDate, 'jYYYY/jMM/jDD') : <span>انتخاب تاریخ</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DynamicJalaliDatePicker
                value={purchaseDate}
                onChange={setPurchaseDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="purchasePricePerUnit" className="mb-1 block">قیمت خرید هر واحد (تومان)</Label>
          <Input
            id="purchasePricePerUnit"
            type="text"
            value={purchasePricePerUnit === '' ? '' : purchasePricePerUnit.toLocaleString('en-US')}
            onChange={handleNumericInputChange(setPurchasePricePerUnit)}
            placeholder="مثلا: 15,000"
            className="text-base"
            required
          />
        </div>
        <div>
          <Label htmlFor="fees" className="mb-1 block">کارمزد خرید (تومان - اختیاری)</Label>
          <Input
            id="fees"
            type="text"
            value={fees === '' ? '' : fees.toLocaleString('en-US')}
            onChange={handleNumericInputChange(setFees, true)}
            placeholder="مثلا: 5,000"
            className="text-base"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="currentPricePerUnit" className="mb-1 block">قیمت فعلی هر واحد (تومان)</Label>
        <Input
          id="currentPricePerUnit"
          type="text"
          value={currentPricePerUnit === '' ? '' : currentPricePerUnit.toLocaleString('en-US')}
          onChange={handleNumericInputChange(setCurrentPricePerUnit)}
          placeholder="مثلا: 18,000"
          className="text-base"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">این قیمت برای محاسبه سود/زیان فعلی استفاده می‌شود.</p>
      </div>

      <div>
        <Label htmlFor="investmentNotes" className="mb-1 block">یادداشت (اختیاری)</Label>
        <Textarea
          id="investmentNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="توضیحات بیشتر در مورد سرمایه‌گذاری..."
          rows={3}
          className="text-base"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!name.trim() || !type || !purchaseDate || quantity === '' || purchasePricePerUnit === '' || currentPricePerUnit === ''} 
        className="w-full"
      >
        {isEditing ? <Edit3 className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" /> : <DollarSign className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />}
        {isEditing ? 'ذخیره تغییرات سرمایه‌گذاری' : 'ثبت سرمایه‌گذاری'}
      </Button>
    </form>
  );
}
