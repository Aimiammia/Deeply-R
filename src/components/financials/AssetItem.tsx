
'use client';

import type { FinancialAsset } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CalendarDays, Building, TrendingUp, Info, Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AssetItemProps {
  asset: FinancialAsset;
  onDeleteAsset: (id: string) => void;
  onEditAsset: (asset: FinancialAsset) => void; // Trigger edit form
}

const assetTypeLabels: Record<FinancialAsset['type'], string> = {
  real_estate: 'املاک و مستغلات',
  vehicle: 'وسیله نقلیه',
  bank_account: 'حساب بانکی / پس‌انداز',
  stocks: 'سهام و اوراق بهادار',
  crypto: 'ارز دیجیتال',
  collectibles: 'کلکسیونی',
  other: 'سایر',
};

export function AssetItem({ asset, onDeleteAsset, onEditAsset }: AssetItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
  };

  const valueChange = asset.currentValue - asset.initialValue;
  const valueChangePercentage = asset.initialValue !== 0 ? (valueChange / asset.initialValue) * 100 : 0;

  return (
    <li className="p-4 border rounded-lg shadow-sm bg-card mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-grow">
            <h4 className="text-lg font-semibold text-primary flex items-center">
            <Building className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
            {asset.name}
            </h4>
            <Badge variant="secondary" className="text-xs mt-1">{assetTypeLabels[asset.type] || asset.type}</Badge>
        </div>
        <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onEditAsset(asset)} aria-label="ویرایش دارایی">
            <Edit3 className="h-5 w-5 text-blue-600" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="حذف دارایی">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تایید حذف دارایی</AlertDialogTitle>
                <AlertDialogDescription>
                  آیا از حذف دارایی "{asset.name}" مطمئن هستید؟ این عمل قابل بازگشت نیست.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>لغو</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteAsset(asset.id)} variant="destructive">
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
        <div>
            <p className="text-muted-foreground">ارزش اولیه:</p>
            <p className="font-medium">{formatCurrency(asset.initialValue)}</p>
        </div>
        <div>
            <p className="text-muted-foreground">ارزش فعلی:</p>
            <p className="font-medium">{formatCurrency(asset.currentValue)}</p>
        </div>
        <div>
            <p className="text-muted-foreground">تاریخ خرید/تملک:</p>
            <p className="flex items-center">
                <CalendarDays className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0 flex-shrink-0" />
                {format(parseISO(asset.purchaseDate), "PPP", { locale: faIR })}
            </p>
        </div>
         <div>
            <p className="text-muted-foreground">آخرین بروزرسانی ارزش:</p>
            <p className="flex items-center">
                 <CalendarDays className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0 flex-shrink-0" />
                {format(parseISO(asset.lastValueUpdate), "PPP p", { locale: faIR })}
            </p>
        </div>
        <div className="sm:col-span-2">
            <p className="text-muted-foreground">تغییر ارزش:</p>
            <p className={cn("font-semibold flex items-center", valueChange >= 0 ? "text-green-600" : "text-red-600")}>
                <TrendingUp className="mr-1 h-4 w-4 rtl:ml-1 rtl:mr-0 flex-shrink-0" />
                {formatCurrency(valueChange)} ({valueChangePercentage.toFixed(1).toLocaleString('fa-IR')}٪)
            </p>
        </div>
      </div>
      
      {asset.notes && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground mb-1 flex items-center"><Info className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/>یادداشت‌ها:</p>
          <p className="text-sm text-foreground whitespace-pre-wrap bg-secondary/30 p-2 rounded-md">{asset.notes}</p>
        </div>
      )}
       <p className="text-xs text-muted-foreground mt-3 text-right">
          ثبت شده در: {format(parseISO(asset.createdAt), "PPP p", { locale: faIR })}
      </p>
    </li>
  );
}
