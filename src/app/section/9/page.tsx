
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, BookOpen, PlusCircle, ListChecks } from 'lucide-react';
import Image from 'next/image';
import type { LongTermGoal } from '@/types';
import { CreateLongTermGoalForm } from '@/components/long-term-goals/CreateLongTermGoalForm';
import { LongTermGoalList } from '@/components/long-term-goals/LongTermGoalList';
import { useToast } from "@/hooks/use-toast";
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SectionNineGoalsPage() { 
  const sectionTitle = "اهداف"; 
  const sectionPageDescription = "اهداف بزرگ و برنامه‌های خود را در این بخش تعریف و پیگیری کنید.";
  const { toast } = useToast();
  const [goals, setGoals] = useDebouncedLocalStorage<LongTermGoal[]>('longTermGoals', []);

 const handleSaveGoal = (goalData: Omit<LongTermGoal, 'id' | 'createdAt'>, isEditing: boolean) => {
    if (isEditing && goalData.id) { 
        const existingGoalId = goalData.id;
         setGoals(prevGoals =>
            prevGoals.map(goal =>
            goal.id === existingGoalId ? { ...goal, ...goalData, title: goalData.title.trim() } : goal
            )
        );
    } else {
        const newGoal: LongTermGoal = {
            ...goalData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: goalData.status || 'not-started',
        };
        setGoals(prevGoals => [newGoal, ...prevGoals].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  const handleDeleteGoal = (id: string) => {
    const goalToDelete = goals.find(g => g.id === id);
    setGoals(prevGoals => prevGoals.filter(g => g.id !== id));
    if (goalToDelete) {
      toast({
        title: "هدف حذف شد",
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
            milestones: updatedGoalData.milestones || goal.milestones, 
            successCriteria: updatedGoalData.successCriteria || goal.successCriteria 
        } : goal
      )
    );
    toast({ 
      title: "هدف به‌روز شد",
      description: `هدف "${updatedGoalData.title}" با موفقیت به‌روزرسانی شد.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/"> 
            <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            بازگشت به خانه
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-1">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {sectionPageDescription}
          </p>
        </div>

        <Card className="shadow-lg bg-card">
          <CardContent className="p-6">
            <Tabs defaultValue="goals" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full bg-primary/10 p-1">
                <TabsTrigger
                  value="goals"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <Target className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> اهداف
                </TabsTrigger>
                <TabsTrigger
                  value="books"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none"
                >
                  <BookOpen className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> کتاب
                </TabsTrigger>
              </TabsList>

              <TabsContent value="goals" className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center text-foreground">
                            <PlusCircle className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                            ایجاد یا ویرایش هدف
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateLongTermGoalForm onSaveGoal={handleSaveGoal} />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center text-foreground">
                            <ListChecks className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                            لیست اهداف شما
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LongTermGoalList goals={goals} onDeleteGoal={handleDeleteGoal} onUpdateGoal={handleUpdateGoal} />
                    </CardContent>
                </Card>
                
                <Card className="bg-secondary/50">
                    <CardHeader>
                         <CardTitle className="text-xl text-primary">قابلیت‌های آینده برای اهداف</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90">
                            <li>تعریف اهداف SMART (مشخص، قابل اندازه‌گیری، قابل دستیابی، مرتبط، زمان‌بندی شده)</li>
                            <li>نمودار پیشرفت بصری برای اهداف و نقاط عطف</li>
                            <li>یادآوری‌ها و اعلان‌ها برای اهداف و مهلت‌ها</li>
                            <li>اتصال اهداف به وظایف روزانه در برنامه‌ریز کوتاه‌مدت برای همسوسازی تلاش‌ها</li>
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
                    </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="books" className="space-y-8">
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <div className="flex items-center">
                            <BookOpen className="h-6 w-6 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
                            <CardTitle className="text-xl text-primary">اهداف مرتبط با کتاب و مطالعه</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground/90 mb-4">
                        میتوانید اهداف مرتبط با مطالعه کتاب، مانند "خواندن ۱۲ کتاب در سال جاری" یا "تمام کردن کتاب 'تاریخ بیهقی' تا سه ماه آینده" را به عنوان یک هدف بلندمدت در تب "اهداف" تعریف کنید.
                        </p>
                        <p className="text-sm text-foreground/90 mb-4">
                        همچنین، برای برنامه‌ریزی مطالعه فصول خاصی از کتب درسی، می‌توانید از بخش <Link href="/section/1" className="text-primary hover:underline">برنامه‌ریز روزانه</Link> استفاده کرده و وظایف با دسته‌بندی "درس" ایجاد نمایید. مقطع تحصیلی شما از بخش <Link href="/section/7" className="text-primary hover:underline">تحصیل</Link> برای انتخاب دروس در دسترس خواهد بود.
                        </p>
                        <Image 
                            src="https://placehold.co/600x300.png" 
                            alt="تصویر مفهومی کتاب‌ها و اهداف مطالعه" 
                            width={600} 
                            height={300}
                            className="rounded-md mx-auto shadow-md mt-4 opacity-70"
                            data-ai-hint="books reading goals"
                        />
                        <h5 className="text-md font-semibold text-primary mt-6 mb-2">قابلیت‌های آینده برای بخش کتاب:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                            <li>ایجاد لیست کتاب‌های خوانده شده / در حال خواندن / برای خواندن.</li>
                            <li>پیگیری پیشرفت مطالعه هر کتاب (مثلا بر اساس صفحه یا فصل).</li>
                            <li>امکان یادداشت‌برداری و ثبت نظرات برای هر کتاب.</li>
                            <li> (اختیاری) دریافت پیشنهاد کتاب بر اساس سلیقه یا اهداف.</li>
                        </ul>
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
