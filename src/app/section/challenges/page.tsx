
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Trophy, PlusCircle, Loader2 } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import { useToast } from '@/hooks/use-toast';
import type { Challenge } from '@/types';
import { generateId } from '@/lib/utils';
import { ClientOnly } from '@/components/ClientOnly';
import { ChallengeItem } from '@/components/challenges/ChallengeItem';
import { Label } from '@/components/ui/label';

export default function ChallengesPage() {
    const sectionTitle = "چالش‌های ۳۰ روزه";
    const sectionPageDescription = "با شروع چالش‌های یک ماهه، خود را به سمت پیشرفت و ایجاد عادت‌های جدید سوق دهید.";

    const { toast } = useToast();
    const [challenges, setChallenges, challengesLoading] = useFirestore<Challenge[]>('thirtyDayChallenges', []);
    
    // Form state for new challenge
    const [challengeName, setChallengeName] = useState('');
    const [challengeDescription, setChallengeDescription] = useState('');

    const handleAddChallenge = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!challengeName.trim()) {
            toast({ title: "خطا", description: "نام چالش نمی‌تواند خالی باشد.", variant: "destructive" });
            return;
        }

        const newChallenge: Challenge = {
            id: generateId(),
            name: challengeName.trim(),
            description: challengeDescription.trim() || null,
            startDate: new Date().toISOString(),
            completions: {},
        };

        setChallenges(prev => [newChallenge, ...prev]);
        toast({ title: "چالش جدید شروع شد!", description: `چالش "${newChallenge.name}" با موفقیت آغاز شد.` });

        // Reset form
        setChallengeName('');
        setChallengeDescription('');
    }, [challengeName, challengeDescription, setChallenges, toast]);

    const handleToggleDay = useCallback((challengeId: string, day: number) => {
        setChallenges(prev =>
            prev.map(c => {
                if (c.id === challengeId) {
                    const newCompletions = { ...c.completions };
                    newCompletions[day] = !newCompletions[day];
                    return { ...c, completions: newCompletions };
                }
                return c;
            })
        );
    }, [setChallenges]);

    const handleDeleteChallenge = useCallback((challengeId: string) => {
        setChallenges(prev => prev.filter(c => c.id !== challengeId));
    }, [setChallenges]);

    const sortedChallenges = [...challenges].sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    return (
        <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
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
                            <Trophy className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
                        </div>
                        <p className="text-lg text-muted-foreground">{sectionPageDescription}</p>
                    </div>

                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>شروع یک چالش جدید</CardTitle>
                                <CardDescription>یک چالش جدید برای خود تعریف کنید و آن را برای ۳۰ روز آینده دنبال کنید.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddChallenge} className="space-y-4">
                                    <div>
                                        <Label htmlFor="challengeName">نام چالش</Label>
                                        <Input
                                            id="challengeName"
                                            value={challengeName}
                                            onChange={e => setChallengeName(e.target.value)}
                                            placeholder="مثلا: ۳۰ روز ورزش روزانه"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="challengeDescription">توضیحات (اختیاری)</Label>
                                        <Textarea
                                            id="challengeDescription"
                                            value={challengeDescription}
                                            onChange={e => setChallengeDescription(e.target.value)}
                                            placeholder="جزئیات و قوانین چالش خود را اینجا بنویسید."
                                            rows={2}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full sm:w-auto">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        شروع چالش
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">چالش‌های فعال شما</h2>
                            {challengesLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : sortedChallenges.length > 0 ? (
                                <div className="space-y-6">
                                    {sortedChallenges.map(challenge => (
                                        <ChallengeItem
                                            key={challenge.id}
                                            challenge={challenge}
                                            onToggleDay={handleToggleDay}
                                            onDelete={handleDeleteChallenge}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground p-8 bg-card rounded-lg border">
                                    هنوز هیچ چالشی را شروع نکرده‌اید. اولین چالش خود را از فرم بالا ایجاد کنید!
                                </p>
                            )}
                        </div>
                    </div>
                </main>
                 <footer className="text-center py-4 text-sm text-muted-foreground mt-8">
                    <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
                </footer>
            </div>
        </ClientOnly>
    );
}
