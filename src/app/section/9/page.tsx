
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic'; 
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, BookOpen, PlusCircle, ListChecks, Loader2 } from 'lucide-react'; 
import { useState, useCallback } from 'react'; 
import type { LongTermGoal, Book } from '@/types'; 
import { useToast } from "@/hooks/use-toast";
import { useSharedState } from '@/hooks/useSharedState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton'; 
import { generateId } from '@/lib/utils';
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


const DynamicCreateLongTermGoalForm = dynamic(() => import('@/components/long-term-goals/CreateLongTermGoalForm').then(mod => mod.CreateLongTermGoalForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicLongTermGoalList = dynamic(() => import('@/components/long-term-goals/LongTermGoalList').then(mod => mod.LongTermGoalList), { ssr: false, loading: () => <ListLoadingSkeleton /> });
const DynamicCreateBookForm = dynamic(() => import('@/components/books/CreateBookForm').then(mod => mod.CreateBookForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicBookList = dynamic(() => import('@/components/books/BookList').then(mod => mod.BookList), { ssr: false, loading: () => <ListLoadingSkeleton /> });


export default function SectionNineGoalsPage() { 
  const sectionTitle = "اهداف و کتاب‌ها"; 
  const sectionPageDescription = "اهداف بزرگ و کتاب‌های خود را در این بخش تعریف، پیگیری و مدیریت نمایید.";
  const { toast } = useToast();
  
  const [goals, setGoals, goalsLoading] = useSharedState<LongTermGoal[]>('longTermGoals', []);
  const [editingGoal, setEditingGoal] = useState<LongTermGoal | null>(null);

  const [books, setBooks, booksLoading] = useSharedState<Book[]>('userBooksDeeply', []);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const pageIsLoading = goalsLoading || booksLoading;


 const handleSaveGoal = useCallback((goalData: Omit<LongTermGoal, 'id' | 'createdAt'>, isEditing: boolean) => {
    if (isEditing && editingGoal) { 
        setGoals(prevGoals =>
            prevGoals.map(goal =>
            goal.id === editingGoal.id ? { ...goal, ...goalData, title: goalData.title.trim(), id: editingGoal.id, createdAt: goal.createdAt } : goal
            )
        );
        setEditingGoal(null); 
    } else {
        const newGoal: LongTermGoal = {
            ...goalData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            status: goalData.status || 'not-started',
        };
        setGoals(prevGoals => [newGoal, ...prevGoals].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [setGoals, editingGoal]); 

  const handleDeleteGoal = useCallback((id: string) => {
    const goalToDelete = goals.find(g => g.id === id);
    setGoals(prevGoals => prevGoals.filter(g => g.id !== id));
    if (goalToDelete) {
      toast({
        title: "هدف حذف شد",
        description: `هدف "${goalToDelete.title}" حذف شد.`,
        variant: "destructive",
      });
    }
     if (editingGoal?.id === id) {
      setEditingGoal(null);
    }
  }, [goals, setGoals, toast, editingGoal]);
  
  const handleUpdateGoal = useCallback((id: string, updatedGoalData: Omit<LongTermGoal, 'id' | 'createdAt'>) => {
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
  }, [setGoals]);

  const handleEditGoal = useCallback((goal: LongTermGoal) => {
      setEditingGoal(goal);
      const formCard = document.getElementById('goal-form-card');
      if (formCard) {
          formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  }, []);

  const handleSaveBook = useCallback((bookData: Omit<Book, 'id' | 'addedAt' | 'finishedAt'>, isEditingBook: boolean) => {
    if (isEditingBook && editingBook) {
      const updatedBook: Book = {
        ...editingBook,
        ...bookData,
        title: bookData.title.trim(),
        finishedAt: bookData.status === 'read' && !editingBook.finishedAt ? new Date().toISOString() : (bookData.status !== 'read' ? null : editingBook.finishedAt),
      };
      setBooks(prevBooks => prevBooks.map(b => b.id === editingBook.id ? updatedBook : b));
      setEditingBook(null);
    } else {
      const newBook: Book = {
        ...bookData,
        id: generateId(),
        addedAt: new Date().toISOString(),
        finishedAt: bookData.status === 'read' ? new Date().toISOString() : null,
        notes: bookData.notes || null,
      };
      setBooks(prevBooks => [newBook, ...prevBooks].sort((a,b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()));
    }
  }, [setBooks, editingBook]);

  const handleUpdateBook = useCallback((updatedBook: Book) => {
    setBooks(prevBooks => prevBooks.map(b => b.id === updatedBook.id ? updatedBook : b));
  }, [setBooks]);

  const handleDeleteBook = useCallback((bookId: string) => {
    const bookToDelete = books.find(b => b.id === bookId);
    setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));
    if (bookToDelete) {
      toast({
        title: "کتاب حذف شد",
        description: `کتاب "${bookToDelete.title}" حذف شد.`,
        variant: "destructive",
      });
    }
    if (editingBook?.id === bookId) {
      setEditingBook(null);
    }
  }, [books, setBooks, toast, editingBook]);

  const handleTriggerEditBook = useCallback((book: Book) => {
    setEditingBook(book);
    const formCard = document.getElementById('book-form-card');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);


  return (
    <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Target className="h-8 w-8 text-primary" />
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
                  <BookOpen className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" /> کتاب‌ها
                </TabsTrigger>
              </TabsList>
              
              {pageIsLoading ? (
                 <div className="flex justify-center items-center p-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <TabsContent value="goals" className="space-y-8">
                    <Card id="goal-form-card" className="scroll-mt-20">
                        <CardHeader className="pb-2"> 
                            <CardTitle className="text-xl flex items-center text-foreground">
                                <PlusCircle className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                                {editingGoal ? 'ویرایش هدف' : 'افزودن هدف جدید'}
                            </CardTitle>
                            {editingGoal && (
                               <CardDescription>
                                  <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setEditingGoal(null)}>
                                      افزودن یک هدف جدید به جای ویرایش
                                  </Button>
                               </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <DynamicCreateLongTermGoalForm onSaveGoal={handleSaveGoal} existingGoal={editingGoal} />
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
                            <DynamicLongTermGoalList goals={goals} onDeleteGoal={handleDeleteGoal} onUpdateGoal={handleUpdateGoal} onEditGoal={handleEditGoal} />
                        </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="books" className="space-y-8">
                    <Card id="book-form-card" className="scroll-mt-20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl flex items-center text-foreground">
                                <PlusCircle className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                                {editingBook ? 'ویرایش کتاب' : 'افزودن کتاب جدید'}
                            </CardTitle>
                             {editingBook && (
                               <CardDescription>
                                  <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setEditingBook(null)}>
                                      افزودن یک کتاب جدید به جای ویرایش
                                  </Button>
                               </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <DynamicCreateBookForm onSaveBook={handleSaveBook} existingBook={editingBook} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center text-foreground">
                                <ListChecks className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                                کتابخانه شما
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DynamicBookList 
                                books={books} 
                                onUpdateBook={handleUpdateBook} 
                                onDeleteBook={handleDeleteBook}
                                onTriggerEdit={handleTriggerEditBook} 
                            />
                        </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
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
