
'use client';

import { useState, type FormEvent, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle, Save, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Book } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface CreateBookFormProps {
  onSaveBook: (bookData: Omit<Book, 'id' | 'addedAt' | 'finishedAt'>, isEditing: boolean) => void;
  existingBook?: Book | null;
}

export function CreateBookForm({ onSaveBook, existingBook }: CreateBookFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publisher, setPublisher] = useState('');
  const [totalPages, setTotalPages] = useState<number | ''>('');
  const [status, setStatus] = useState<Book['status']>('to-read');
  const [currentPage, setCurrentPage] = useState<number | ''>('');
  const [rating, setRating] = useState<number | ''>('');


  const isEditing = !!existingBook;

  useEffect(() => {
    if (existingBook) {
      setTitle(existingBook.title);
      setAuthor(existingBook.author || '');
      setGenre(existingBook.genre || '');
      setPublisher(existingBook.publisher || '');
      setTotalPages(existingBook.totalPages || '');
      setStatus(existingBook.status);
      setCurrentPage(existingBook.currentPage || '');
      setRating(existingBook.rating || '');
    } else {
      setTitle('');
      setAuthor('');
      setGenre('');
      setPublisher('');
      setTotalPages('');
      setStatus('to-read');
      setCurrentPage('');
      setRating('');
    }
  }, [existingBook]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const bookData: Omit<Book, 'id' | 'addedAt' | 'finishedAt'> = {
        title: title.trim(),
        author: author.trim() || null,
        genre: genre.trim() || null,
        publisher: publisher.trim() || null,
        totalPages: totalPages !== '' ? Number(totalPages) : null,
        status,
        currentPage: currentPage !== '' ? Number(currentPage) : null,
        notes: isEditing ? existingBook?.notes : null, // Preserve notes on edit
        rating: rating !== '' ? Number(rating) : null,
      };
      onSaveBook(bookData, isEditing);

      if (!isEditing) {
        setTitle('');
        setAuthor('');
        setGenre('');
        setPublisher('');
        setTotalPages('');
        setStatus('to-read');
        setCurrentPage('');
        setRating('');
      }
       toast({
        title: isEditing ? "کتاب ویرایش شد" : "کتاب اضافه شد",
        description: `کتاب "${title.trim()}" با موفقیت ${isEditing ? 'ویرایش' : 'ذخیره'} شد.`,
      });
    }
  }, [title, author, genre, publisher, totalPages, status, currentPage, rating, isEditing, existingBook, onSaveBook, toast]);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-primary flex items-center">
        <BookOpen className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />
        {isEditing ? 'ویرایش کتاب' : 'افزودن کتاب جدید'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bookTitle">عنوان کتاب</Label>
          <Input
            id="bookTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلا: کلیدر"
            required
          />
        </div>
        <div>
          <Label htmlFor="bookAuthor">نویسنده (اختیاری)</Label>
          <Input
            id="bookAuthor"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="مثلا: محمود دولت‌آبادی"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bookGenre">ژانر (اختیاری)</Label>
          <Input
            id="bookGenre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="مثلا: رمان، تاریخی"
          />
        </div>
        <div>
          <Label htmlFor="bookPublisher">ناشر (اختیاری)</Label>
          <Input
            id="bookPublisher"
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="مثلا: نشر چشمه"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bookTotalPages">تعداد کل صفحات (اختیاری)</Label>
          <Input
            id="bookTotalPages"
            type="number"
            value={totalPages}
            onChange={(e) => setTotalPages(e.target.value === '' ? '' : parseInt(e.target.value))}
            placeholder="مثلا: ۳۵۰"
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="bookStatus">وضعیت</Label>
           <Select value={status} onValueChange={(value) => setStatus(value as Book['status'])}>
            <SelectTrigger id="bookStatus">
              <SelectValue placeholder="انتخاب وضعیت..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="to-read">برای خواندن</SelectItem>
              <SelectItem value="reading">در حال خواندن</SelectItem>
              <SelectItem value="read">خوانده شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {status === 'reading' && (
         <div>
          <Label htmlFor="bookCurrentPage">صفحه فعلی</Label>
          <Input
            id="bookCurrentPage"
            type="number"
            value={currentPage}
            onChange={(e) => setCurrentPage(e.target.value === '' ? '' : parseInt(e.target.value))}
            placeholder="مثلا: ۱۲۰"
            min="0"
            max={totalPages !== '' ? Number(totalPages) : undefined}
          />
        </div>
      )}

       {status === 'read' && (
         <div>
          <Label htmlFor="bookRating">امتیاز (۱ تا ۵ - اختیاری)</Label>
          <Input
            id="bookRating"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value === '' ? '' : parseInt(e.target.value))}
            placeholder="مثلا: ۴"
            min="1"
            max="5"
          />
        </div>
      )}
      
      <Button type="submit" disabled={!title.trim()} className="w-full">
        {isEditing ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
        {isEditing ? 'ذخیره تغییرات' : 'افزودن کتاب'}
      </Button>
    </form>
  );
}
