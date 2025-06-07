
'use client';

import type { Budget, FinancialTransaction } from '@/types';
import { BudgetItem } from './BudgetItem';
import { Landmark } from 'lucide-react'; // Or PiggyBank, depending on context

interface BudgetListProps {
  budgets: Budget[];
  transactions: FinancialTransaction[];
  onDeleteBudget: (categoryId: string) => void;
  onEditBudget: (budget: Budget) => void;
}

export function BudgetList({ budgets, transactions, onDeleteBudget, onEditBudget }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card mt-6">
        <Landmark className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز بودجه‌ای تنظیم نشده است.</p>
        <p>اولین بودجه خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedBudgets = [...budgets].sort((a, b) => a.category.localeCompare(b.category, 'fa'));

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-4">بودجه‌های ماهانه شما</h3>
      <ul className="space-y-3">
        {sortedBudgets.map((budget) => (
          <BudgetItem
            key={budget.id}
            budget={budget}
            transactions={transactions}
            onDeleteBudget={onDeleteBudget}
            onEditBudget={onEditBudget}
          />
        ))}
      </ul>
    </div>
  );
}
