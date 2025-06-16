
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell, BarChart2, Target, Settings, Edit3, PlusCircle, ListChecks, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import type { SportsActivity } from '@/types';
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const FormLoadingSkeleton = () => (
  <div className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8 animate-pulse">
    <Skeleton className="h-8 w-1/3 mb-4 rounded" />
    <Skeleton className="h-10 w-full rounded" />
    <Skeleton className="h-10 w-full rounded" />
    <div className="flex gap-4">
      <Skeleton className="h-10 flex-1 rounded" />
      <Skeleton className="h-10 flex-1 rounded" />
    </div>
    <Skeleton className="h-10 w-full rounded" />
  </div>
);

const ListLoadingSkeleton = () => (
  <div className="mt-8 animate-pulse">
    <Skeleton className="h-8 w-1/2 mb-4 rounded" />
    <div className="space-y-4">
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-20 w-full rounded-lg" />
      <Skeleton className="h-20 w-full rounded-lg" />
    </div>
  </div>
);

const DynamicAddSportsActivityForm = dynamic(() => import('@/components/sports/AddSportsActivityForm').then(mod => mod.AddSportsActivityForm), { 
  ssr: false, 
  loading: () => <FormLoadingSkeleton /> 
});
const DynamicSportsActivityList = dynamic(() => import('@/components/sports/SportsActivityList').then(mod => mod.SportsActivityList), { 
  ssr: false, 
  loading: () => <ListLoadingSkeleton />
});


export default function SportsPage() {
  const sectionTitle = "ورزشی";
  const sectionPageDescription = "فعالیت‌های ورزشی خود را در این بخش ثبت، پیگیری و تحلیل کنید.";
  const { toast } = useToast();

  const [activities, setActivities] = useDebouncedLocalStorage<SportsActivity[]>('userSportsActivitiesDeeply', []);
  const [editingActivity, setEditingActivity] = useState<SportsActivity | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSaveActivity = useCallback((activityData: Omit<SportsActivity, 'id' | 'createdAt'>, isEditing: boolean) => {
    if (isEditing && editingActivity) {
      setActivities(prevActivities =>
        prevActivities.map(act =>
          act.id === editingActivity.id ? { ...act, ...activityData, id: editingActivity.id, createdAt: act.createdAt } : act
        )
      );
      setEditingActivity(null);
    } else {
      const newActivity: SportsActivity = {
        ...activityData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      setActivities(prevActivities => [newActivity, ...prevActivities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
    setShowForm(false); // Close form after save
  }, [setActivities, editingActivity, toast]);

  const handleDeleteActivity = useCallback((activityId: string) => {
    const activityToDelete = activities.find(act => act.id === activityId);
    setActivities(prevActivities => prevActivities.filter(act => act.id !== activityId));
    if (activityToDelete) {
      toast({
        title: "فعالیت ورزشی حذف شد",
        description: `فعالیت ورزشی مورد نظر حذف شد.`,
        variant: "destructive",
      });
    }
    if (editingActivity?.id === activityId) {
      setEditingActivity(null);
      setShowForm(false);
    }
  }, [activities, setActivities, toast, editingActivity]);
  
  const handleTriggerEdit = (activity: SportsActivity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingActivity(null);
    setShowForm(true);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Dumbbell className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
            </div>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                    بازگشت به خانه
                </Link>
            </Button>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
            {sectionPageDescription}
        </p>

        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center text-foreground">
                           {showForm ? (editingActivity ? <Edit3 className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" /> : <PlusCircle className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />) : <ListChecks className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />}
                            {showForm ? (editingActivity ? 'ویرایش فعالیت ورزشی' : 'افزودن فعالیت جدید') : 'فعالیت‌های ثبت شده'}
                        </CardTitle>
                        {!showForm && <CardDescription>برای افزودن یا ویرایش، روی دکمه مربوطه کلیک کنید.</CardDescription>}
                    </div>
                    <Button onClick={() => {
                        if (showForm && editingActivity) { // If editing, cancel will hide form
                           setShowForm(false);
                           setEditingActivity(null);
                        } else if (showForm && !editingActivity) { // If adding new, cancel will hide form
                            setShowForm(false);
                        }
                         else { // If list is showing, button should show form for adding new
                            handleAddNew();
                        }
                    }} variant={showForm ? "outline" : "default"}>
                        {showForm ? 'انصراف' : (<><PlusCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0"/> افزودن فعالیت جدید</>)}
                    </Button>
                </CardHeader>
                <CardContent>
                    {showForm ? (
                        <DynamicAddSportsActivityForm 
                            onSaveActivity={handleSaveActivity} 
                            existingActivity={editingActivity} 
                        />
                    ) : (
                         <DynamicSportsActivityList 
                            activities={activities} 
                            onDeleteActivity={handleDeleteActivity}
                            onEditActivity={handleTriggerEdit} 
                        />
                    )}
                </CardContent>
            </Card>
            
            <div className="text-center my-8">
                <Image
                src="https://placehold.co/600x350.png"
                alt="تصویر مفهومی فعالیت‌های ورزشی و سلامتی"
                width={600}
                height={350}
                className="rounded-md mx-auto shadow-md"
                data-ai-hint="sports activity health"
                />
            </div>

            <Card className="bg-secondary/50">
              <CardHeader>
                <CardTitle className="text-xl text-primary">قابلیت‌های برنامه‌ریزی شده برای بخش ورزشی</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground/90">
                  <li className="flex items-start"><BarChart2 className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>نمایش نمودارهای پیشرفت و آمار ورزشی (مثلاً مسافت کل دویده شده در ماه، میانگین کالری سوزانده شده).</li>
                  <li className="flex items-start"><Target className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>امکان تعریف اهداف ورزشی (مثلاً دویدن ۱۰۰ کیلومتر در ماه).</li>
                  <li className="flex items-start"><Settings className="ml-2 h-4 w-4 text-yellow-500 rtl:mr-2 rtl:ml-0 mt-0.5 flex-shrink-0"/>ایجاد و مدیریت برنامه‌های تمرینی سفارشی.</li>
                  <li className="flex items-start"><Image src="https://placehold.co/16x16.png" alt="wearable" width={16} height={16} className="ml-2 rtl:mr-2 mt-0.5 flex-shrink-0" data-ai-hint="wearable device"/>اتصال به دستگاه‌های پوشیدنی (اختیاری، نیازمند بررسی API‌ها).</li>
                </ul>
              </CardContent>
            </Card>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
