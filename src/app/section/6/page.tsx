
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell, PlusCircle, ListChecks, Loader2, TimerOff } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { SportsActivity, ActiveFast, FastingSession } from '@/types';
import { useSharedState } from '@/hooks/useSharedState';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { differenceInHours } from 'date-fns';
import { ClientOnly } from '@/components/ClientOnly';


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

const DynamicFastingTracker = dynamic(() => import('@/components/sports/FastingTracker').then(mod => mod.FastingTracker), {
    ssr: false,
    loading: () => <Skeleton className="h-48 w-full" />
});

const DynamicFastingHistory = dynamic(() => import('@/components/sports/FastingHistory').then(mod => mod.FastingHistory), {
    ssr: false,
    loading: () => <ListLoadingSkeleton />
});


export default function SportsPage() {
  const sectionTitle = "ورزشی";
  const sectionPageDescription = "فعالیت‌های ورزشی و روزه‌داری متناوب (فستینگ) خود را در این بخش ثبت، پیگیری و تحلیل کنید.";
  const { toast } = useToast();

  // State for Sports Activities
  const [activities, setActivities, activitiesLoading] = useSharedState<SportsActivity[]>('userSportsActivitiesDeeply', []);
  const [editingActivity, setEditingActivity] = useState<SportsActivity | null>(null);
  const [showForm, setShowForm] = useState(false);

  // State for Fasting
  const [activeFast, setActiveFast, activeFastLoading] = useSharedState<ActiveFast | null>('activeFastDeeply', null);
  const [fastingSessions, setFastingSessions, fastingSessionsLoading] = useSharedState<FastingSession[]>('fastingHistoryDeeply', []);
  
  const pageIsLoading = activitiesLoading || activeFastLoading || fastingSessionsLoading;

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
  };

  // Fasting Handlers
  const handleStartFast = useCallback(() => {
      if (activeFast) return;
      const newFast: ActiveFast = {
          id: generateId(),
          startTime: new Date().toISOString(),
      };
      setActiveFast(newFast);
      toast({ title: "فستینگ شروع شد", description: "زمان شروع روزه شما ثبت شد." });
  }, [activeFast, setActiveFast, toast]);

  const handleEndFast = useCallback((notes?: string) => {
      if (!activeFast) return;
      const endTime = new Date();
      const startTime = new Date(activeFast.startTime);
      const duration = differenceInHours(endTime, startTime);

      const newSession: FastingSession = {
          id: activeFast.id,
          startTime: activeFast.startTime,
          endTime: endTime.toISOString(),
          durationHours: duration,
          notes: notes?.trim() || null,
      };

      setFastingSessions(prev => [newSession, ...prev].sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()));
      setActiveFast(null);
      toast({ title: "فستینگ پایان یافت", description: `مدت زمان: ${duration} ساعت. این جلسه به تاریخچه شما اضافه شد.` });
  }, [activeFast, setActiveFast, setFastingSessions, toast]);
  
  const handleDeleteFastSession = useCallback((sessionId: string) => {
    const sessionToDelete = fastingSessions.find(s => s.id === sessionId);
    setFastingSessions(prev => prev.filter(s => s.id !== sessionId));
    if (sessionToDelete) {
        toast({ title: "جلسه فستینگ حذف شد", variant: "destructive"});
    }
  }, [fastingSessions, setFastingSessions, toast]);


  return (
    <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
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

            <Card className="shadow-lg bg-card">
                <CardContent className="p-6">
                    <Tabs defaultValue="activities" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 rounded-full bg-primary/10 p-1 h-auto">
                            <TabsTrigger value="activities" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none py-2.5">
                                <Dumbbell className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0"/> فعالیت‌های ورزشی
                            </TabsTrigger>
                            <TabsTrigger value="fasting" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:rounded-full data-[state=active]:shadow-none py-2.5">
                            <TimerOff className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0"/> فستینگ
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="activities" className="space-y-8">
                             <Card id="activity-form-card" className="scroll-mt-20">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                    <CardTitle className="text-xl flex items-center text-foreground">
                                        <PlusCircle className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                                        {showForm ? (editingActivity ? 'ویرایش فعالیت' : 'افزودن فعالیت جدید') : 'افزودن فعالیت جدید'}
                                    </CardTitle>
                                    {!showForm && <CardDescription>برای افزودن فعالیت جدید روی دکمه کلیک کنید.</CardDescription>}
                                    </div>
                                    <Button onClick={() => {
                                        if (showForm) { 
                                            setShowForm(false);
                                            setEditingActivity(null);
                                        } else {
                                            handleAddNew();
                                        }
                                    }} variant={showForm ? "outline" : "default"}>
                                        {showForm ? 'انصراف' : (<><PlusCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:mr-0"/> افزودن</>)}
                                    </Button>
                                </CardHeader>
                                {showForm && (
                                    <CardContent>
                                        <DynamicAddSportsActivityForm 
                                            onSaveActivity={handleSaveActivity} 
                                            existingActivity={editingActivity} 
                                        />
                                    </CardContent>
                                )}
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center text-foreground">
                                        <ListChecks className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                                        لیست فعالیت‌های ثبت شده
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <DynamicSportsActivityList 
                                        activities={activities} 
                                        onDeleteActivity={handleDeleteActivity}
                                        onEditActivity={handleTriggerEdit} 
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="fasting" className="space-y-8">
                            <DynamicFastingTracker 
                                activeFast={activeFast}
                                onStartFast={handleStartFast}
                                onEndFast={handleEndFast}
                            />
                            <DynamicFastingHistory
                                sessions={fastingSessions}
                                onDelete={handleDeleteFastSession}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
        <footer className="text-center py-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
        </footer>
        </div>
    </ClientOnly>
  );
}
