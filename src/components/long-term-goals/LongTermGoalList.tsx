
'use client';

import type { LongTermGoal } from '@/types';
import { LongTermGoalItem } from './LongTermGoalItem';
import { Target } from 'lucide-react'; // Or use a more generic "empty state" icon

interface LongTermGoalListProps {
  goals: LongTermGoal[];
  onDeleteGoal: (id: string) => void;
  onEditGoal: (id: string, updatedGoalData: Omit<LongTermGoal, 'id' | 'createdAt'>) => void;
}

export function LongTermGoalList({ goals, onDeleteGoal, onEditGoal }: LongTermGoalListProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card mt-6">
        <Target className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز هدف بلندمدتی تعریف نشده است.</p>
        <p>اولین هدف خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedGoals = [...goals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-4">اهداف بلندمدت شما</h3>
      <ul className="space-y-4">
        {sortedGoals.map((goal) => (
          <LongTermGoalItem
            key={goal.id}
            goal={goal}
            onDeleteGoal={onDeleteGoal}
            onEditGoal={onEditGoal}
          />
        ))}
      </ul>
    </div>
  );
}
