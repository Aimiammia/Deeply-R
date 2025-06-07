
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, History, Edit3, BookHeart } from 'lucide-react'; // Added BookHeart here
import { ReflectionForm } from '@/components/ReflectionForm';
import { ReflectionHistoryList } from '@/components/ReflectionHistoryList';
import { ReflectionInsightsDisplay } from '@/components/ReflectionInsightsDisplay';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getDailySuccessQuote } from '@/lib/prompts';
import { analyzeUserReflections, type AnalyzeUserReflectionsInput, type AnalyzeUserReflectionsOutput } from '@/ai/flows/analyze-user-reflections';
import type { ReflectionEntry } from '@/types';

export default function ReflectionsPage() {
  const { toast } = useToast();
  const currentPrompt = getDailySuccessQuote();

  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionEntry | null>(null);
  const [insights, setInsights] = useState<AnalyzeUserReflectionsOutput | undefined>(undefined);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    try {
      const storedReflections = localStorage.getItem('dailyReflections');
      if (storedReflections) {
        setReflections(JSON.parse(storedReflections));
      }
    } catch (error) {
      console.error("Failed to parse reflections from localStorage", error);
      localStorage.removeItem('dailyReflections');
    }
    setIsInitialLoadComplete(true);
  }, []);

  useEffect(() => {
    if (isInitialLoadComplete) {
      localStorage.setItem('dailyReflections', JSON.stringify(reflections));
    }
  }, [reflections, isInitialLoadComplete]);

  const fetchInsights = async (reflectionText: string) => {
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
  };

  const handleSaveReflection = async (reflectionText: string) => {
    setIsSavingReflection(true);
    const newReflection: ReflectionEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      prompt: currentPrompt, // Save the active prompt with the reflection
      text: reflectionText,
    };
    setReflections(prevReflections => [newReflection, ...prevReflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setSelectedReflection(newReflection); // Select the new reflection
    await fetchInsights(newReflection.text); // Fetch insights for the new reflection
    setIsSavingReflection(false);
    toast({
      title: "تأمل ذخیره شد",
      description: "تأمل شما با موفقیت ذخیره و تحلیل شد.",
    });
  };

  const handleSelectReflection = (reflection: ReflectionEntry) => {
    setSelectedReflection(reflection);
    fetchInsights(reflection.text);
  };
  
  const sortedReflections = [...reflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary flex items-center">
              <BookHeart className="mr-3 h-7 w-7 rtl:ml-3 rtl:mr-0" />
              تأملات روزانه
            </CardTitle>
            <CardDescription>
              افکار و احساسات خود را ثبت کنید و با کمک هوش مصنوعی به بینش‌های جدیدی دست یابید.
              نقل قول امروز برای تأمل: <span className="italic text-primary">{currentPrompt}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                <Edit3 className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                تأمل جدید بنویسید
              </h2>
              <ReflectionForm onSaveReflection={handleSaveReflection} isLoading={isSavingReflection} />
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                <Brain className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                بینش‌های تأمل انتخاب شده
              </h2>
              {selectedReflection ? (
                <ReflectionInsightsDisplay insights={insights} isLoading={isLoadingInsights} error={insightsError} />
              ) : (
                 <p className="text-muted-foreground text-center py-4">یک تأمل از تاریخچه انتخاب کنید یا یک تأمل جدید بنویسید تا تحلیل آن نمایش داده شود.</p>
              )}
            </div>
            
            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                <History className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                تاریخچه تأملات
              </h2>
              <ReflectionHistoryList 
                reflections={sortedReflections} 
                onSelectReflection={handleSelectReflection}
                selectedReflectionId={selectedReflection?.id}
              />
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Daily Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
