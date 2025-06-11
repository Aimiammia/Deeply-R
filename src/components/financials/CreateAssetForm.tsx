
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, PlusCircle, Edit3, Building } from 'lucide-react';
import { JalaliDatePicker } from '@/components/calendar/JalaliDatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { FinancialAsset } from '@/types';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers'; 

interface CreateAssetFormProps {
  onSaveAsset: (assetData: Omit<FinancialAsset, 'id' | 'createdAt' | 'lastValueUpdate'>, isEditing: boolean) => void;
  existingAsset?: FinancialAsset | null;
}

const assetTypes: { value: FinancialAsset['type']; label: string }[] = [
  { value: 'real_estate', label: 'املاک و مستغلات' },
  { value: 'vehicle', label: 'وسیله نقلیه' },
  { value: 'bank_account', label: 'حساب بانکی / پس‌انداز نقدی' },
  { value: 'stocks', label: 'سهام و اوراق بهادار' },
  { value: 'crypto', label: 'ارز دیجیتال' },
  { value: 'collectibles', label: 'کلکسیونی و اشیاء قیمتی' },
  { value: 'other', label: 'سایر دارایی‌ها' },
];

export function CreateAssetForm({ onSaveAsset, existingAsset }: CreateAssetFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<FinancialAsset['type'] | undefined>(undefined);
  const [initialValue, setInitialValue] = useState<number | ''>('');
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  const [currentValue, setCurrentValue] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const isEditing = !!existingAsset;

  useEffect(() => {
    if (existingAsset) {
      setName(existingAsset.name);
      setType(existingAsset.type);
      setInitialValue(existingAsset.initialValue);
      setPurchaseDate(new Date(existingAsset.purchaseDate));
      setCurrentValue(existingAsset.currentValue);
      setNotes(existingAsset.notes || '');
    } else {
      setName('');
      setType(undefined);
      setInitialValue('');
      setPurchaseDate(new Date());
      setCurrentValue('');
      setNotes('');
    }
  }, [existingAsset]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() && type && initialValue !== '' && purchaseDate && currentValue !== '') {
      onSaveAsset({
        name: name.trim(),
        type,
        initialValue: Number(initialValue),
        purchaseDate: purchaseDate.toISOString(),
        currentValue: Number(currentValue),
        notes: notes.trim() || null,
      }, isEditing);

      if (!isEditing) {
        setName('');
        setType(undefined);
        setInitialValue('');
        setPurchaseDate(new Date());
        setCurrentValue('');
        setNotes('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
        {isEditing ? <Edit3 className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" /> : <PlusCircle className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />}
        {isEditing ? 'ویرایش دارایی' : 'افزودن دارایی جدید'}
      </h3>
      
      <div>
        <Label htmlFor="assetName" className="mb-1 block">نام دارایی</Label>
        <Input
          id="assetName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثلا: آپارتمان مسکونی، خودروی پراید، حساب بانک ملی"
          className="text-base"
          required
        />
      </div>

      <div>
        <Label htmlFor="assetType" className="mb-1 block">نوع دارایی</Label>
        <Select value={type} onValueChange={(value) => setType(value as FinancialAsset['type'])} required>
          <SelectTrigger id="assetType" className="w-full" aria-label="نوع دارایی">
            <Building className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0 text-muted-foreground" />
            <SelectValue placeholder="انتخاب نوع دارایی" />
          </SelectTrigger>
          <SelectContent>
            {assetTypes.map(at => (
              <SelectItem key={at.value} value={at.value}>{at.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <Label htmlFor="initialValue" className="mb-1 block">ارزش اولیه / قیمت خرید (تومان)</Label>
            <Input
            id="initialValue"
            type="number"
            value={initialValue}
            onChange={(e) => setInitialValue(parseFloat(e.target.value) || '')}
            placeholder="مثلا: 500000000"
            className="text-base"
            required
            min="0"
            />
        </div>
        <div>
            <Label htmlFor="purchaseDate" className="mb-1 block">تاریخ خرید / تملک</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !purchaseDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                    {purchaseDate ? formatJalaliDateDisplay(purchaseDate, 'jYYYY/jMM/jDD') : <span>انتخاب تاریخ</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <JalaliDatePicker
                    value={purchaseDate}
                    onChange={setPurchaseDate}
                    initialYear={purchaseDate ? new Date(purchaseDate).getFullYear() : undefined}
                    initialMonth={purchaseDate ? new Date(purchaseDate).getMonth() + 1 : undefined}
                />
                </PopoverContent>
            </Popover>
        </div>
      </div>

       <div>
        <Label htmlFor="currentValue" className="mb-1 block">ارزش فعلی (تومان)</Label>
        <Input
          id="currentValue"
          type="number"
          value={currentValue}
          onChange={(e) => setCurrentValue(parseFloat(e.target.value) || '')}
          placeholder="مثلا: 650000000"
          className="text-base"
          required
          min="0"
        />
        <p className="text-xs text-muted-foreground mt-1">این ارزش می‌تواند به صورت دوره‌ای به‌روز شود.</p>
      </div>


      <div>
        <Label htmlFor="assetNotes" className="mb-1 block">یادداشت (اختیاری)</Label>
        <Textarea
          id="assetNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="توضیحات بیشتر در مورد دارایی..."
          rows={3}
          className="text-base"
        />
      </div>
      
      <Button type="submit" disabled={!name.trim() || !type || initialValue === '' || !purchaseDate || currentValue === ''} className="w-full">
        {isEditing ? <Edit3 className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" /> : <PlusCircle className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />}
        {isEditing ? 'ذخیره تغییرات دارایی' : 'افزودن دارایی'}
      </Button>
    </form>
  );
}
