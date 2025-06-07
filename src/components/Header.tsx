import { BookHeart } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 text-center">
      <div className="flex items-center justify-center space-x-3">
        <BookHeart className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline font-bold text-primary">
          Deeply Reflections
        </h1>
      </div>
    </header>
  );
}
