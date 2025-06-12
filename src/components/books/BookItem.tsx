
'use client';

import type { Book } from '@/types';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Save, BookOpen, CalendarDays, Star, MessageSquare, ChevronDown, ChevronUp, GripVertical, Layers, Building } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BookItemProps {
  book: Book;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onTriggerEdit: (book: Book) => void; 
}

export function BookItem({ book, onUpdateBook, onDeleteBook, onTriggerEdit }: BookItemProps) {
  const { toast } = useToast();
  const [currentBookPage, setCurrentBookPage] = useState<number | ''>(book.currentPage || '');
  const [bookNotes, setBookNotes] = useState(book.notes || '');
  const [isExpanded, setIsExpanded] = useState(false); 

  const handleStatusChange = (newStatus: Book['status']) => {
    let updatedBook = { ...book, status: newStatus };
    if (newStatus === 'read') {
      updatedBook.finishedAt = new Date().toISOString();
      if (book.totalPages) {
        updatedBook.currentPage = book.totalPages;
        setCurrentBookPage(book.totalPages);
      }
    } else {
      updatedBook.finishedAt = null;
    }
    onUpdateBook(updatedBook);
    toast({ title: "وضعیت کتاب به‌روز شد", description: `وضعیت کتاب "${book.title}" به "${newStatus}" تغییر یافت.` });
  };

  const handleCurrentPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentBookPage(val === '' ? '' : parseInt(val));
  };
  
  const handleCurrentPageBlur = () => {
     if (currentBookPage !== '' && book.totalPages && Number(currentBookPage) > book.totalPages) {
        setCurrentBookPage(book.totalPages);
        toast({ title: "خطا", description: "صفحه فعلی نمی‌تواند بیشتر از کل صفحات باشد.", variant: "destructive"});
        onUpdateBook({ ...book, currentPage: book.totalPages });
     } else if (currentBookPage !== '' && Number(currentBookPage) < 0) {
        setCurrentBookPage(0);
        toast({ title: "خطا", description: "صفحه فعلی نمی‌تواند منفی باشد.", variant: "destructive"});
        onUpdateBook({ ...book, currentPage: 0 });
     }
     else if (book.currentPage !== Number(currentBookPage) && currentBookPage !== '') {
        onUpdateBook({ ...book, currentPage: Number(currentBookPage) });
        toast({ title: "پیشرفت ذخیره شد", description: `صفحه فعلی کتاب "${book.title}" به‌روز شد.` });
     } else if (currentBookPage === '' && book.currentPage !== null) {
        onUpdateBook({ ...book, currentPage: null });
        toast({ title: "پیشرفت پاک شد", description: `صفحه فعلی کتاب "${book.title}" پاک شد.` });
     }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBookNotes(e.target.value);
  };

  const handleNotesBlur = () => {
    if (book.notes !== bookNotes) {
      onUpdateBook({ ...book, notes: bookNotes || null });
      toast({ title: "یادداشت ذخیره شد", description: `یادداشت برای کتاب "${book.title}" به‌روز شد.` });
    }
  };
  
  const handleRatingChange = (newRatingStr: string) => {
    const newRating = newRatingStr === '' ? null : parseInt(newRatingStr);
    if (newRating === null || (newRating >= 1 && newRating <= 5)) {
      onUpdateBook({ ...book, rating: newRating });
      toast({ title: "امتیاز کتاب به‌روز شد." });
    } else {
      toast({ title: "خطا", description: "امتیاز باید بین ۱ تا ۵ باشد.", variant: "destructive" });
    }
  };

  const progressPercentage = (book.totalPages && book.currentPage) ? (book.currentPage / book.totalPages) * 100 : 0;

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <CardTitle className="text-lg font-headline text-primary flex items-center">
              <BookOpen className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
              {book.title}
            </CardTitle>
            {book.author && <CardDescription className="text-xs text-muted-foreground">{book.author}</CardDescription>}
          </div>
          <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={() => onTriggerEdit(book)} aria-label="ویرایش کتاب">
              <Edit3 className="h-4 w-4 text-blue-500" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="حذف کتاب">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>تایید حذف کتاب</AlertDialogTitle>
                  <AlertDialogDescription>
                    آیا از حذف کتاب "{book.title}" مطمئن هستید؟
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>لغو</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteBook(book.id)} variant="destructive">حذف</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? "بستن جزئیات" : "باز کردن جزئیات"}>
             {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-[150px]">
                <Label htmlFor={`status-${book.id}`} className="text-xs">وضعیت</Label>
                <Select value={book.status} onValueChange={(value) => handleStatusChange(value as Book['status'])} >
                    <SelectTrigger id={`status-${book.id}`} className="h-9">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="to-read">برای خواندن</SelectItem>
                    <SelectItem value="reading">در حال خواندن</SelectItem>
                    <SelectItem value="read">خوانده شده</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {book.rating !== null && book.rating !== undefined && book.status === 'read' && (
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={cn("h-5 w-5", i < book.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                    ))}
                </div>
            )}
        </div>

        {isExpanded && book.status === 'reading' && book.totalPages && book.totalPages > 0 && (
          <div className="pt-2 space-y-2">
            <Label htmlFor={`current-page-${book.id}`} className="text-xs">پیشرفت مطالعه (صفحه فعلی از {book.totalPages.toLocaleString('fa-IR')})</Label>
            <div className="flex items-center gap-2">
              <Input
                id={`current-page-${book.id}`}
                type="number"
                value={currentBookPage}
                onChange={handleCurrentPageChange}
                onBlur={handleCurrentPageBlur}
                placeholder="صفحه فعلی"
                min="0"
                max={book.totalPages}
                className="h-9 w-24 text-center"
              />
              <Progress value={progressPercentage} className="flex-grow h-2.5" />
            </div>
          </div>
        )}
        
        {isExpanded && book.status === 'read' && (
          <div className="pt-2 space-y-2">
            <Label htmlFor={`rating-${book.id}`} className="text-xs">امتیاز شما (۱ تا ۵)</Label>
             <Select value={book.rating?.toString() || ''} onValueChange={handleRatingChange}>
                <SelectTrigger id={`rating-${book.id}`} className="h-9">
                    <SelectValue placeholder="امتیاز دهید..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value=""><em>بدون امتیاز</em></SelectItem>
                    <SelectItem value="1">۱ ستاره</SelectItem>
                    <SelectItem value="2">۲ ستاره</SelectItem>
                    <SelectItem value="3">۳ ستاره</SelectItem>
                    <SelectItem value="4">۴ ستاره</SelectItem>
                    <SelectItem value="5">۵ ستاره</SelectItem>
                </SelectContent>
            </Select>
          </div>
        )}


        {isExpanded && (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"> 
                    {book.genre && (
                        <div>
                            <Label className="text-xs flex items-center mb-1 text-muted-foreground"><Layers className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />ژانر</Label>
                            <p className="text-foreground bg-secondary/50 p-2 rounded-md text-xs">{book.genre}</p>
                        </div>
                    )}
                    {book.publisher && (
                        <div>
                            <Label className="text-xs flex items-center mb-1 text-muted-foreground"><Building className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" />ناشر</Label>
                            <p className="text-foreground bg-secondary/50 p-2 rounded-md text-xs">{book.publisher}</p>
                        </div>
                    )}
                </div>
                <div className="pt-2">
                    <Label htmlFor={`notes-${book.id}`} className="text-xs flex items-center mb-1 text-muted-foreground">
                        <MessageSquare className="ml-1 h-3.5 w-3.5 rtl:mr-1 rtl:ml-0" /> یادداشت‌ها
                    </Label>
                    <Textarea
                        id={`notes-${book.id}`}
                        value={bookNotes}
                        onChange={handleNotesChange}
                        onBlur={handleNotesBlur}
                        placeholder="یادداشت‌های خود را درباره این کتاب بنویسید..."
                        rows={3}
                        className="text-sm"
                    />
                </div>
            </>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-3 border-t flex justify-between">
        <span>
          افزوده شده در: {format(parseISO(book.addedAt), "yyyy/MM/dd", { locale: faIR })}
        </span>
        {book.finishedAt && book.status === 'read' && (
          <span>
            خوانده شده در: {format(parseISO(book.finishedAt), "yyyy/MM/dd", { locale: faIR })}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};
// Removed React.memo wrapper
export { BookItem };
