'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HomePage() {
  const sections = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sectionNumber) => (
            <Card key={sectionNumber} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-headline text-primary">Section {sectionNumber}</CardTitle>
                <CardDescription>Details for section {sectionNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Content for section {sectionNumber} will go here. You can customize this area as needed.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Daily Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
