import { ListChecks } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background py-4 shadow-sm border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-center space-x-3 rtl:space-x-reverse">
        <ListChecks className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-headline font-bold text-primary">
          My Daily Tasks
        </h1>
      </div>
    </header>
  );
}
