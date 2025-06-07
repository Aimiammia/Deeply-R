'use client';

import { useState, useEffect, useCallback } from 'react';
import { analyzeUserReflections, type AnalyzeUserReflectionsOutput } from '@/ai/flows/analyze-user-reflections';
import type { ReflectionEntry } from '@/types';
import { getDailyPrompt } from '@/lib/prompts';

import { Header } from '@/components/Header';
import { DailyPromptDisplay } from '@/components/DailyPromptDisplay';
import { ReflectionForm } from '@/components/ReflectionForm';
import { ReflectionInsightsDisplay } from '@/components/ReflectionInsightsDisplay';
import { ReflectionHistoryList } from '@/components/ReflectionHistoryList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { History } from 'lucide-react';


const LOCAL_STORAGE_KEY = 'deeplyReflections_entries';

export default function HomePage() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionEntry | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentPrompt(getDailyPrompt());
    try {
      const storedReflections = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedReflections) {
        const parsedReflections: ReflectionEntry[] = JSON.parse(storedReflections);
        // Ensure dates are consistently handled if they were stored as strings
        const validReflections = parsedReflections.filter(r => r.date && typeof r.date === 'string');
        setReflections(validReflections);
        if (validReflections.length > 0) {
           // Automatically select the most recent reflection to show insights
           setSelectedReflection(validReflections[0]);
        }
      }
    } catch (error) {
      console.error("Failed to load reflections from local storage:", error);
      toast({
        title: "Error",
        description: "Could not load your saved reflections.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveReflectionsToLocalStorage = useCallback((updatedReflections: ReflectionEntry[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedReflections));
    } catch (error) {
      console.error("Failed to save reflections to local storage:", error);
      toast({
        title: "Error",
        description: "Could not save your reflection locally.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  const handleSaveReflection = async (reflectionText: string) => {
    setIsLoadingInsights(true);
    setInsightError(null);
    setSelectedReflection(null); // Clear previously selected to show loading for new one

    const newEntryBase: Omit<ReflectionEntry, 'insights'> = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      prompt: currentPrompt,
      text: reflectionText,
    };

    // Show loading state for the new reflection immediately
    // This is a temporary entry for UI purposes if insights take time
    const tempNewEntryForUI: ReflectionEntry = { ...newEntryBase, insights: undefined };
     // setSelectedReflection(tempNewEntryForUI); // Set this to show loading for the current one

    try {
      const insights = await analyzeUserReflections({ reflectionText });
      const newEntryWithInsights: ReflectionEntry = { ...newEntryBase, insights };
      
      setReflections(prevReflections => {
        const updatedReflections = [newEntryWithInsights, ...prevReflections];
        saveReflectionsToLocalStorage(updatedReflections);
        return updatedReflections;
      });
      setSelectedReflection(newEntryWithInsights); // Show insights for the newly saved reflection
      toast({
        title: "Reflection Saved",
        description: "Your reflection and insights have been saved.",
      });
    } catch (error) {
      console.error('Error analyzing reflection:', error);
      setInsightError('Failed to generate insights for this reflection.');
      // Save reflection without insights if AI fails
      const newEntryWithoutInsights: ReflectionEntry = { ...newEntryBase, insights: undefined };
      setReflections(prevReflections => {
        const updatedReflections = [newEntryWithoutInsights, ...prevReflections];
        saveReflectionsToLocalStorage(updatedReflections);
        return updatedReflections;
      });
      setSelectedReflection(newEntryWithoutInsights);
      toast({
        title: "Reflection Saved (No Insights)",
        description: "Your reflection was saved, but insights could not be generated.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleSelectReflection = (reflection: ReflectionEntry) => {
    setSelectedReflection(reflection);
    setInsightError(null); // Clear any previous error when selecting a new reflection
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Prompt, Input, and Current Insights */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary">Today's Reflection</CardTitle>
                <CardDescription>Take a moment for yourself.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DailyPromptDisplay prompt={currentPrompt} />
                <ReflectionForm onSaveReflection={handleSaveReflection} isLoading={isLoadingInsights} />
              </CardContent>
            </Card>

            {(selectedReflection || isLoadingInsights || insightError) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-headline text-primary">Reflection Insights</CardTitle>
                  {selectedReflection && !isLoadingInsights && (
                     <CardDescription>
                       Insights for reflection from {new Date(selectedReflection.date).toLocaleDateString()}
                     </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ReflectionInsightsDisplay 
                    insights={selectedReflection?.insights} 
                    isLoading={isLoadingInsights && (!selectedReflection || !selectedReflection.insights)} // Show loading if selected is being processed
                    error={insightError}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Reflection History */}
          <div className="space-y-6">
             <div className="flex items-center space-x-2 mb-2">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-headline font-semibold">Reflection History</h2>
             </div>
            <ReflectionHistoryList 
              reflections={reflections} 
              onSelectReflection={handleSelectReflection}
              selectedReflectionId={selectedReflection?.id}
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply Reflections. Crafted with care.</p>
      </footer>
    </div>
  );
}
