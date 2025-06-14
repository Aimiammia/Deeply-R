
'use client';

import type { FinancialInvestment } from '@/types';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2, CalendarDays, TrendingUp, Info, TrendingDown, Minus, RefreshCw, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn, formatCurrency } from '@/lib/utils'; // Ensured formatCurrency is imported
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
import { investmentTypes } from '@/lib/investment-types';

interface InvestmentItemProps {
  investment: FinancialInvestment;
  onDeleteInvestment: (id: string) => void;
  onEditInvestment: (investment: FinancialInvestment) => void;
  onUpdatePrice: (investmentId: string) => void;
  isUpdatingPrice: boolean;
}

export function InvestmentItem({ investment, onDeleteInvestment, onEditInvestment, onUpdatePrice, isUpdatingPrice }: InvestmentItemProps) {

  const typeLabel = useMemo(() => 
    investmentTypes.find(it => it.value === investment.type)?.label || investment.type
  , [investment.type]);

  const { totalPurchaseCost, currentTotalValue, profitOrLoss, profitOrLossPercentage } = useMemo(() => {
    const purchaseCost = (investment.quantity * investment.purchasePricePerUnit) + investment.fees;
    const currentValue = investment.quantity * investment.currentPricePerUnit;
    const pnl = currentValue - purchaseCost;
    const pnlPercentage = purchaseCost !== 0 ? (pnl / purchaseCost) * 100 : 0;
    return { 
      totalPurchaseCost: purchaseCost, 
      currentTotalValue: currentValue, 
      profitOrLoss: pnl, 
      profitOrLossPercentage: pnlPercentage 
    };
  }, [investment.quantity, investment.purchasePricePerUnit, investment.fees, investment.currentPricePerUnit]);

  let ProfitLossIcon = Minus;
  if (profitOrLoss > 0) ProfitLossIcon = TrendingUp;
  else if (profitOrLoss < 0) ProfitLossIcon = TrendingDown;
  
  const profitLossColor = profitOrLoss > 0 ? "text-green-600 dark:text-green-400" : profitOrLoss < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground";


  return (
    <li className="p-4 border rounded-lg shadow-sm bg-card mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-grow">
            <h4 className="text-lg font-semibold text-primary flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
            {investment.name}
            </h4>
            <Badge variant="secondary" className="text-xs mt-1">{typeLabel}</Badge>
        </div>
        <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onUpdatePrice(investment.id)} 
            disabled={isUpdatingPrice}
            aria-label="به‌روزرسانی قیمت"
            title="به‌روزرسانی قیمت از API (شبیه‌سازی شده)"
          >
            {isUpdatingPrice ? <Loader2 className="h-5 w-5 animate-spin text-blue-600" /> : <RefreshCw className="h-5 w-5 text-blue-600" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEditInvestment(investment)} aria-label="ویرایش سرمایه‌گذاری">
            <Edit3 className="h-5 w-5 text-blue-600" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="حذف سرمایه‌گذاری">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تایید حذف سرمایه‌گذاری</AlertDialogTitle>
                <AlertDialogDescription>
                  آیا از حذف سرمایه‌گذاری "{investment.name}" مطمئن هستید؟ این عمل قابل بازگشت نیست.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>لغو</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteInvestment(investment.id)} variant="destructive">
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 text-sm mb-3">
        <div>
            <p className="text-muted-foreground">تعداد/مقدار:</p>
            <p className="font-medium">{investment.quantity.toLocaleString('fa-IR')}</p>
        </div>
        <div>
            <p className="text-muted-foreground">قیمت خرید هر واحد:</p>
            <p className="font-medium">{formatCurrency(investment.purchasePricePerUnit)}</p>
        </div>
         <div>
            <p className="text-muted-foreground">کارمزد خرید:</p>
            <p className="font-medium">{formatCurrency(investment.fees)}</p>
        </div>
        <div>
            <p className="text-muted-foreground">مجموع هزینه خرید:</p>
            <p className="font-medium">{formatCurrency(totalPurchaseCost)}</p>
        </div>
        <div>
            <p className="text-muted-foreground">قیمت فعلی هر واحد:</p>
            <p className="font-medium">{formatCurrency(investment.currentPricePerUnit)}</p>
        </div>
        <div>
            <p className="text-muted-foreground">ارزش فعلی کل:</p>
            <p className="font-medium">{formatCurrency(currentTotalValue)}</p>
        </div>
         <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-muted-foreground">تاریخ خرید:</p>
            <p className="flex items-center">
                <CalendarDays className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0 flex-shrink-0" />
                {format(parseISO(investment.purchaseDate), "PPP", { locale: faIR })}
            </p>
        </div>
        <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-muted-foreground">سود / زیان:</p>
            <p className={cn("font-semibold flex items-center text-lg", profitLossColor)}>
                <ProfitLossIcon className="mr-1 h-5 w-5 rtl:ml-1 rtl:mr-0 flex-shrink-0" />
                {formatCurrency(profitOrLoss)} 
                <span className="text-xs mr-1 rtl:ml-1 rtl:mr-0">({profitOrLossPercentage.toFixed(1).toLocaleString('fa-IR')}٪)</span>
            </p>
        </div>
      </div>
      
      {investment.notes && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground mb-1 flex items-center"><Info className="ml-1 h-4 w-4 rtl:mr-1 rtl:ml-0"/>یادداشت‌ها:</p>
          <p className="text-sm text-foreground whitespace-pre-wrap bg-secondary/30 p-2 rounded-md">{investment.notes}</p>
        </div>
      )}
       <p className="text-xs text-muted-foreground mt-3 text-right">
          ثبت شده در: {format(parseISO(investment.createdAt), "PPP p", { locale: faIR })}
      </p>
      <p className="text-xs text-muted-foreground mt-1 text-right">
          آخرین بروزرسانی قیمت: {investment.lastPriceUpdateDate ? format(parseISO(investment.lastPriceUpdateDate), "PPP p", { locale: faIR }) : "نامشخص"}
      </p>
    </li>
  );
};
