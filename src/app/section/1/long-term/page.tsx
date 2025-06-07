
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Construction } from 'lucide-react'; // Added Construction icon
import Image from 'next/image';

export default function LongTermPlannerPage() {
  const sectionTitle = "برنامه‌ریزی بلند مدت";
  const sectionPageDescription = "اهداف بزرگتر و برنامه‌های طولانی‌مدت خود را در این بخش تعریف و پیگیری کنید.";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/section/1">
            <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            بازگشت به برنامه‌ریز
          </Link>
        </Button>
        <Card className="shadow-lg bg-card">
          <CardHeader>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Target className="h-7 w-7 text-primary" />
                <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
                </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <Construction className="mx-auto h-16 w-16 text-primary/70 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">این بخش در دست ساخت است!</h3>
            <p className="text-muted-foreground mb-6">
              به زودی می‌توانید اهداف بلندمدت خود را در اینجا تعیین کنید، آن‌ها را به مراحل کوچکتر تقسیم کنید و پیشرفت خود را دنبال نمایید.
            </p>
            <Image 
                src="https://placehold.co/600x350.png" 
                alt="Long term goals placeholder" 
                width={600} 
                height={350}
                className="rounded-md mx-auto shadow-md"
                data-ai-hint="planning goals"
              />
            <div className="mt-8 p-4 border rounded-md bg-secondary/30">
                <h4 className="text-lg font-semibold text-primary mb-2">قابلیت‌های آینده:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-left rtl:text-right">
                  <li>تعریف اهداف SMART (مشخص، قابل اندازه‌گیری، قابل دستیابی، مرتبط، زمان‌بندی شده)</li>
                  <li>تقسیم اهداف بزرگ به وظایف کوچکتر و قابل مدیریت</li>
                  <li>نمودار پیشرفت و پیگیری نقاط عطف</li>
                  <li>یادآوری‌ها و اعلان‌ها برای اهداف</li>
                  <li>اتصال به برنامه‌ریزی کوتاه مدت برای همسوسازی تلاش‌ها</li>
                </ul>
              </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
  );
}
