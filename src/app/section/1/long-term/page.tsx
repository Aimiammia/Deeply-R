
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target } from 'lucide-react';
import Image from 'next/image';
import type { LongTermGoal } from '@/types';
import { CreateLongTermGoalForm } from '@/components/long-term-goals/CreateLongTermGoalForm';
import { LongTermGoalList } from '@/components/long-term-goals/LongTermGoalList';
import { useToast } from "@/hooks/use-toast";
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';

export default function LongTermPlannerPage() {
  const sectionTitle = "برنامه‌ریزی بلند مدت";
  const sectionPageDescription = "اهداف بزرگتر و برنامه‌های طولانی‌مدت خود را در این بخش تعریف و پیگیری کنید.";
  const { toast } = useToast();
  const [goals, setGoals] = useDebouncedLocalStorage<LongTermGoal[]>('longTermGoals', []);

  const handleSaveGoal = (goalData: Omit<LongTermGoal, 'id' | 'createdAt'>, isEditing: boolean) => {
    if (isEditing && goalData.id) { // Assuming goalData will have id if editing
        const existingGoalId = goalData.id;
         setGoals(prevGoals =>
            prevGoals.map(goal =>
            goal.id === existingGoalId ? { ...goal, ...goalData, title: goalData.title.trim() } : goal
            )
        );
        toast({
            title: "هدف بلندمدت ویرایش شد",
            description: `هدف "${goalData.title}" با موفقیت ویرایش شد.`,
        });
    } else {
        const newGoal: LongTermGoal = {
            ...goalData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: goalData.status || 'not-started', // Ensure status is set
        };
        setGoals(prevGoals => [newGoal, ...prevGoals].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        // Toast is handled by the form now
    }
  };


  const handleDeleteGoal = (id: string) => {
    const goalToDelete = goals.find(g => g.id === id);
    setGoals(prevGoals => prevGoals.filter(g => g.id !== id));
    if (goalToDelete) {
      toast({
        title: "هدف بلندمدت حذف شد",
        description: `هدف "${goalToDelete.title}" حذف شد.`,
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateGoal = (id: string, updatedGoalData: Omit<LongTermGoal, 'id' | 'createdAt'>) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { 
            ...goal, 
            ...updatedGoalData, 
            title: updatedGoalData.title.trim(),
            milestones: updatedGoalData.milestones || goal.milestones, // Ensure milestones are preserved or updated
            successCriteria: updatedGoalData.successCriteria || goal.successCriteria 
        } : goal
      )
    );
    toast({
      title: "هدف بلندمدت به‌روز شد",
      description: `هدف "${updatedGoalData.title}" با موفقیت به‌روزرسانی شد.`,
    });
  };


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/section/1">
            <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            بازگشت به برنامه‌ریز
          </Link>
        </Button>
        <Card className="shadow-lg bg-card">
          <CardHeader>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Target className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
                </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <CreateLongTermGoalForm onSaveGoal={handleSaveGoal} />
            <LongTermGoalList goals={goals} onDeleteGoal={handleDeleteGoal} onUpdateGoal={handleUpdateGoal} />
            
            <div className="mt-12 p-6 border rounded-lg bg-secondary/30 shadow-inner">
                <h4 className="text-xl font-semibold text-primary mb-3">قابلیت‌های آینده:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90">
                  <li>تعریف اهداف SMART (مشخص، قابل اندازه‌گیری، قابل دستیابی، مرتبط، زمان‌بندی شده)</li>
                  <li>نمودار پیشرفت بصری و پیگیری نقاط عطف (Milestones)</li>
                  <li>یادآوری‌ها و اعلان‌ها برای اهداف و مهلت‌ها</li>
                  <li>اتصال اهداف بلندمدت به وظایف روزانه در برنامه‌ریز کوتاه‌مدت برای همسوسازی تلاش‌ها</li>
                  <li>بخش تحلیل و بازبینی پیشرفته اهداف</li>
                </ul>
                 <Image 
                    src="https://placehold.co/600x350.png" 
                    alt="تصویر مفهومی برنامه‌ریزی آینده و استراتژی" 
                    width={600} 
                    height={350}
                    className="rounded-md mx-auto shadow-md mt-6 opacity-70"
                    data-ai-hint="future planning strategy"
                  />
              </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
