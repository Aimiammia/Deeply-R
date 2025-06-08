
'use client';

import type { SavingsGoal } from '@/types';
import { SavingsGoalItem } from './SavingsGoalItem';
import { PiggyBank } from 'lucide-react';

interface SavingsGoalListProps {
  goals: SavingsGoal[];
  onDeleteGoal: (id: string) => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onAddFunds: (id: string, amount: number) => void;
  onSetStatus: (id: string, status: SavingsGoal['status']) => void;
}

export function SavingsGoalList({ goals, onDeleteGoal, onEditGoal, onAddFunds, onSetStatus }: SavingsGoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card mt-6">
        <PiggyBank className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز هدف پس‌اندازی ثبت نشده است.</p>
        <p>اولین هدف پس‌انداز خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedGoals = [...goals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-4">لیست اهداف پس‌انداز شما</h3>
      <ul className="space-y-4">
        {sortedGoals.map((goal) => (
          <SavingsGoalItem
            key={goal.id}
            goal={goal}
            onDeleteGoal={onDeleteGoal}
            onEditGoal={onEditGoal}
            onAddFunds={onAddFunds}
            onSetStatus={onSetStatus}
          />
        ))}
      </ul>
    </div>
  );
}
