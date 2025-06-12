
'use client';

import type { Book } from '@/types';
import { BookItem } from './BookItem';
import { BookOpenCheck } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onTriggerEdit: (book: Book) => void;
}

export function BookList({ books, onUpdateBook, onDeleteBook, onTriggerEdit }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card mt-6">
        <BookOpenCheck className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز کتابی اضافه نشده است.</p>
        <p>اولین کتاب خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedBooks = [...books].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">لیست کتاب‌های شما</h3>
      <ul className="space-y-0"> {/* Removed space-y-4 to let BookItem handle its own margin */}
        {sortedBooks.map((book) => (
          <BookItem
            key={book.id}
            book={book}
            onUpdateBook={onUpdateBook}
            onDeleteBook={onDeleteBook}
            onTriggerEdit={onTriggerEdit}
          />
        ))}
      </ul>
    </div>
  );
}
