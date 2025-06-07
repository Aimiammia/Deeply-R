
'use client';

import type { FinancialTransaction } from '@/types';
import { TransactionItem } from './TransactionItem';
import { Wallet } from 'lucide-react'; // Using Wallet as a general icon for no transactions

interface TransactionListProps {
  transactions: FinancialTransaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card">
        <Wallet className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز تراکنشی ثبت نشده است.</p>
        <p>اولین تراکنش خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    // Sort by date first (newest first), then by creation time (newest first)
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">تاریخچه تراکنش‌ها</h3>
      <ul className="border rounded-md shadow-sm bg-card">
        {sortedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onDeleteTransaction={onDeleteTransaction}
          />
        ))}
      </ul>
    </div>
  );
}
