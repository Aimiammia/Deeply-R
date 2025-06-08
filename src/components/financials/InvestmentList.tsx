
'use client';

import type { FinancialInvestment } from '@/types';
import { InvestmentItem } from './InvestmentItem';
import { TrendingUp } from 'lucide-react';

interface InvestmentListProps {
  investments: FinancialInvestment[];
  onDeleteInvestment: (id: string) => void;
  onEditInvestment: (investment: FinancialInvestment) => void;
}

export function InvestmentList({ investments, onDeleteInvestment, onEditInvestment }: InvestmentListProps) {
  if (investments.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card mt-6">
        <TrendingUp className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز سرمایه‌گذاری‌ای ثبت نشده است.</p>
        <p>اولین سرمایه‌گذاری خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedInvestments = [...investments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-4">لیست سرمایه‌گذاری‌های شما</h3>
      <ul className="space-y-4">
        {sortedInvestments.map((investment) => (
          <InvestmentItem
            key={investment.id}
            investment={investment}
            onDeleteInvestment={onDeleteInvestment}
            onEditInvestment={onEditInvestment} // This will trigger the form to prefill
          />
        ))}
      </ul>
    </div>
  );
}
