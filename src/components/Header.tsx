import { ListChecks, Brain } from 'lucide-react'; // Added Brain for a more general icon

export function Header() {
  return (
    <header className="bg-background py-3 shadow-sm border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-center space-x-2 rtl:space-x-reverse">
        <Brain className="h-7 w-7 text-primary" /> 
        <h1 className="text-2xl font-headline font-bold text-primary">
          Deeply
        </h1>
      </div>
    </header>
  );
}
