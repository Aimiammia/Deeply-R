
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History, Edit3, BookHeart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDailySuccessQuote } from '@/lib/prompts';
import type { ReflectionEntry } from '@/types';
import { useFirestore } from '@/hooks/useFirestore';
import { generateId } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientOnly } from '@/components/ClientOnly';

const DynamicReflectionForm = dynamic(() => import('@/components/ReflectionForm').then(mod => mod.ReflectionForm), {
  loading: () => <Skeleton className="h-48 w-full" />,
  ssr: false
});
const DynamicReflectionHistoryList = dynamic(() => import('@/components/ReflectionHistoryList').then(mod => mod.ReflectionHistoryList), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});


export default function ReflectionsPage() {
  const { toast } = useToast();
  const currentPrompt = getDailySuccessQuote();

  const [reflections, setReflections, reflectionsLoading] = useFirestore<ReflectionEntry[]>('dailyReflections', []);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionEntry | null>(null);
  const [isSavingReflection, setIsSavingReflection] = useState(false);


  const handleSaveReflection = useCallback(async (reflectionText: string) => {
    setIsSavingReflection(true);
    const newReflection: ReflectionEntry = {
      id: generateId(),
      date: new Date().toISOString(),
      prompt: currentPrompt, 
      text: reflectionText,
    };
    setReflections(prevReflections => [newReflection, ...prevReflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setSelectedReflection(newReflection); 
    setIsSavingReflection(false);
    toast({
      title: "تأمل ذخیره شد",
      description: "تأمل شما با موفقیت ذخیره شد.",
    });
  }, [setReflections, currentPrompt, toast]);

  const handleSelectReflection = useCallback((reflection: ReflectionEntry) => {
    setSelectedReflection(reflection);
  }, []);
  
  const sortedReflections = [...reflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <BookHeart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">تأملات روزانه</h1>
          </div>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              بازگشت به خانه
            </Link>
          </Button>
        </div>
        <p className="text-lg text-muted-foreground mb-4">
          افکار و احساسات خود را برای مرور و بازبینی در آینده ثبت کنید.
        </p>
        <p className="text-md text-primary italic mb-8">
            نقل قول امروز برای تأمل: {currentPrompt}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center text-foreground">
                    <Edit3 className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                    تأمل جدید بنویسید
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DynamicReflectionForm onSaveReflection={handleSaveReflection} isLoading={isSavingReflection} />
                </CardContent>
                </Card>
            </div>
            
            <div className="space-y-8">
                <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center text-foreground">
                    <History className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                    تاریخچه تأملات
                    </CardTitle>
                     <CardDescription>
                        برای مشاهده متن کامل، روی هر آیتم کلیک کنید.
                     </CardDescription>
                </CardHeader>
                <CardContent>
                    {reflectionsLoading ? (
                        <Skeleton className="h-96 w-full" />
                    ) : (
                        <DynamicReflectionHistoryList 
                            reflections={sortedReflections} 
                            onSelectReflection={handleSelectReflection}
                            selectedReflectionId={selectedReflection?.id}
                        />
                    )}
                </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
    </ClientOnly>
  );
}
