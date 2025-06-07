
'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardList, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PlannerLandingPage() {
  const sectionTitle = "برنامه‌ریز";
  const sectionPageDescription = "برنامه‌های کوتاه مدت و اهداف بلند مدت خود را مدیریت کنید.";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            بازگشت به خانه
          </Link>
        </Button>
        <Card className="shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">
              {sectionTitle}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="short-term" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="short-term">برنامه‌ریزی کوتاه مدت</TabsTrigger>
                <TabsTrigger value="long-term">برنامه‌ریزی بلند مدت</TabsTrigger>
              </TabsList>
              <TabsContent value="short-term">
                <Link href="/section/1/short-term" className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg group">
                  <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out hover:scale-[1.03] cursor-pointer h-full flex flex-col bg-card border border-transparent group-hover:border-primary/50">
                    <CardHeader className="flex-shrink-0 pb-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <ClipboardList className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg font-headline text-foreground">
                          برنامه‌ریزی کوتاه مدت
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground pt-1">
                        وظایف روزانه و هفتگی خود را اینجا مدیریت کنید.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pt-2 text-sm text-foreground/90">
                      <p>
                        ایجاد، مشاهده و پیگیری کارهای روزمره و وظایف با سررسید نزدیک.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </TabsContent>
              <TabsContent value="long-term">
                <Link href="/section/1/long-term" className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg group">
                  <Card className="shadow-md hover:shadow-lg transform transition-all duration-300 ease-in-out hover:scale-[1.03] cursor-pointer h-full flex flex-col bg-card border border-transparent group-hover:border-primary/50">
                    <CardHeader className="flex-shrink-0 pb-4">
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Target className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg font-headline text-foreground">
                          برنامه‌ریزی بلند مدت
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground pt-1">
                        اهداف ماهانه، فصلی و سالانه خود را تنظیم و پیگیری کنید.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pt-2 text-sm text-foreground/90">
                      <p>
                        تعریف اهداف بزرگتر، شکستن آن‌ها به مراحل قابل دستیابی و نظارت بر پیشرفت.
                      </p>
                    </CardContent>
                  </Card>
                </Link>
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
