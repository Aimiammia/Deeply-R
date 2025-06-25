
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, History, Edit3, BookHeart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDailySuccessQuote } from '@/lib/prompts';
import { analyzeUserReflections, type AnalyzeUserReflectionsInput, type AnalyzeUserReflectionsOutput } from '@/ai/flows/analyze-user-reflections';
import type { ReflectionEntry } from '@/types';
import { useSharedState } from '@/hooks/useSharedState';
import { generateId } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const DynamicReflectionForm = dynamic(() => import('@/components/ReflectionForm').then(mod => mod.ReflectionForm), {
  loading: () => <Skeleton className="h-32 w-full" />,
  ssr: false
});
const DynamicReflectionHistoryList = dynamic(() => import('@/components/ReflectionHistoryList').then(mod => mod.ReflectionHistoryList), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: false
});
const DynamicReflectionInsightsDisplay = dynamic(() => import('@/components/ReflectionInsightsDisplay').then(mod => mod.ReflectionInsightsDisplay), {
  loading: () => <Skeleton className="h-48 w-full" />,
  ssr: false
});


export default function ReflectionsPage() {
  const { toast } = useToast();
  const currentPrompt = getDailySuccessQuote();

  const [reflections, setReflections, reflectionsLoading] = useSharedState<ReflectionEntry[]>('dailyReflections', []);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionEntry | null>(null);
  const [insights, setInsights] = useState<AnalyzeUserReflectionsOutput | undefined>(undefined);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [isSavingReflection, setIsSavingReflection] = useState(false);

  const fetchInsights = useCallback(async (reflectionText: string) => {
    setIsLoadingInsights(true);
    setInsightsError(null);
    setInsights(undefined);
    try {
      const analysisInput: AnalyzeUserReflectionsInput = { reflectionText };
      const analysisOutput = await analyzeUserReflections(analysisInput);
      setInsights(analysisOutput);
    } catch (error) {
      console.error('Error analyzing reflection:', error);
      setInsightsError('خطا در تحلیل تأمل. لطفاً دوباره تلاش کنید.');
      toast({
        title: "خطا در تحلیل",
        description: "متاسفانه در هنگام تحلیل تامل شما مشکلی پیش آمد.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  }, [toast]);

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
    await fetchInsights(newReflection.text); 
    setIsSavingReflection(false);
    toast({
      title: "تأمل ذخیره شد",
      description: "تأمل شما با موفقیت ذخیره و تحلیل شد.",
    });
  }, [setReflections, currentPrompt, fetchInsights, toast]);

  const handleSelectReflection = useCallback((reflection: ReflectionEntry) => {
    setSelectedReflection(reflection);
    fetchInsights(reflection.text);
  }, [fetchInsights]);
  
  const sortedReflections = [...reflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
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
          افکار و احساسات خود را ثبت کنید و با کمک هوش مصنوعی به بینش‌های جدیدی دست یابید.
        </p>
        <p className="text-md text-accent italic mb-8">
            نقل قول امروز برای تأمل: {currentPrompt}
        </p>

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

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-foreground">
                  <Brain className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                  بینش‌های تأمل انتخاب شده
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedReflection ? (
                  <DynamicReflectionInsightsDisplay insights={insights} isLoading={isLoadingInsights} error={insightsError} />
                ) : (
                 <p className="text-muted-foreground text-center py-4">یک تأمل از تاریخچه انتخاب کنید یا یک تأمل جدید بنویسید تا تحلیل آن نمایش داده شود.</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center text-foreground">
                  <History className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                  تاریخچه تأملات
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reflectionsLoading ? (
                    <Skeleton className="h-64 w-full" />
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
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
