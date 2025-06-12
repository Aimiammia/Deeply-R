
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic'; // Added
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, BookOpen, PlusCircle, ListChecks, Loader2 } from 'lucide-react'; // Added Loader2
import Image from 'next/image';
import { useState, useCallback } from 'react'; // Added useCallback
import type { LongTermGoal, Book } from '@/types'; 
// import { CreateLongTermGoalForm } from '@/components/long-term-goals/CreateLongTermGoalForm'; // Commented
import { LongTermGoalList } from '@/components/long-term-goals/LongTermGoalList';
// import { CreateBookForm } from '@/components/books/CreateBookForm'; // Commented
import { BookList } from '@/components/books/BookList'; 
import { useToast } from "@/hooks/use-toast";
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton'; // Added

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

const DynamicCreateLongTermGoalForm = dynamic(() => import('@/components/long-term-goals/CreateLongTermGoalForm').then(mod => mod.CreateLongTermGoalForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicCreateBookForm = dynamic(() => import('@/components/books/CreateBookForm').then(mod => mod.CreateBookForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });


export default function SectionNineGoalsPage() { 
  const sectionTitle = "اهداف و کتاب‌ها"; 
  const sectionPageDescription = "اهداف بزرگ و کتاب‌های خود را در این بخش تعریف، پیگیری و مدیریت نمایید.";
  const { toast } = useToast();
  
  const [goals, setGoals] = useDebouncedLocalStorage<LongTermGoal[]>('longTermGoals', []);
  const [editingGoal, setEditingGoal] = useState<LongTermGoal | null>(null);

  const [books, setBooks] = useDebouncedLocalStorage<Book[]>('userBooksDeeply', []);
  const [editingBook, setEditingBook] = useState<Book | null>(null);


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
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: goalData.status || 'not-started',
        };
        setGoals(prevGoals => [newGoal, ...prevGoals].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [setGoals, editingGoal, toast]); // Added toast to dependencies if CreateLongTermGoalForm uses it internally for success

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
    // Toast for update is usually handled by the item/form itself after successful edit
  }, [setGoals]);

  // Book Handlers
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
        id: crypto.randomUUID(),
        addedAt: new Date().toISOString(),
        finishedAt: bookData.status === 'read' ? new Date().toISOString() : null,
        notes: bookData.notes || null,
      };
      setBooks(prevBooks => [newBook, ...prevBooks].sort((a,b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()));
    }
     // Toast is usually handled by CreateBookForm itself
  }, [setBooks, editingBook, toast]);

  const handleUpdateBook = useCallback((updatedBook: Book) => {
    setBooks(prevBooks => prevBooks.map(b => b.id === updatedBook.id ? updatedBook : b));
    // Toast for update is usually handled by BookItem after successful interaction
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
  }, []);


  return (
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

              <TabsContent value="goals" className="space-y-8">
                <Card>
                    <CardHeader className="pb-2"> 
                        <CardTitle className="text-xl flex items-center text-foreground">
                            <PlusCircle className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                            {editingGoal ? 'ویرایش هدف' : 'افزودن هدف جدید'}
                        </CardTitle>
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
                <Card>
                     <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center text-foreground">
                            <PlusCircle className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                            {editingBook ? 'ویرایش کتاب' : 'افزودن کتاب جدید'}
                        </CardTitle>
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
                        <BookList 
                            books={books} 
                            onUpdateBook={handleUpdateBook} 
                            onDeleteBook={handleDeleteBook}
                            onTriggerEdit={handleTriggerEditBook} 
                        />
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/50">
                    <CardHeader>
                        <div className="flex items-center">
                            <BookOpen className="h-6 w-6 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
                            <CardTitle className="text-xl text-primary">قابلیت‌های آینده برای بخش کتاب</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground/90 mb-4">
                        این بخش در حال توسعه است تا تجربه مطالعه شما را بهبود بخشد.
                        </p>
                        <Image 
                            src="https://placehold.co/600x300.png" 
                            alt="تصویر مفهومی کتاب‌ها و مطالعه" 
                            width={600} 
                            height={300}
                            className="rounded-md mx-auto shadow-md mt-4 opacity-70"
                            data-ai-hint="books reading library"
                        />
                        <h5 className="text-md font-semibold text-primary mt-6 mb-2">برخی از امکانات برنامه‌ریزی شده:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                            <li>دسته‌بندی کتاب‌ها بر اساس ژانر یا تگ‌های سفارشی.</li>
                            <li>امکان جستجو و فیلتر پیشرفته در کتابخانه.</li>
                            <li>نمایش آمار مطالعه (مثلا تعداد کتاب‌های خوانده شده در ماه/سال).</li>
                            <li> (اختیاری) دریافت پیشنهاد کتاب بر اساس سلیقه یا اهداف با کمک هوش مصنوعی.</li>
                            <li>ادغام با اهداف بلندمدت (مثلا تعریف هدف "خواندن X کتاب" و پیگیری آن از طریق این بخش).</li>
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
