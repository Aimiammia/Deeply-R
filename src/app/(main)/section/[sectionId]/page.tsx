
// src/app/(main)/section/[sectionId]/page.tsx
'use client';

import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

interface SectionPageProps {
  // params are now accessed via useParams hook in client components
}

export default function SectionPage({}: SectionPageProps) {
  const params = useParams<{ sectionId: string }>();
  const sectionId = params.sectionId;

  const isTasksSection = sectionId === '1';
  const sectionTitle = isTasksSection ? "وظایف" : `بخش ${sectionId}`;
  const sectionPageDescription = isTasksSection ? `مدیریت و مشاهده وظایف روزانه شما.` : `صفحه اختصاصی برای بخش ${sectionId}.`;


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
          <CardContent>
            <p>محتوای دقیق بخش {sectionId} در اینجا نمایش داده خواهد شد.</p>
            <p>شما می‌توانید این صفحه را برای نمایش جزئیات و قابلیت‌های خاص این بخش سفارشی‌سازی کنید.</p>
            {isTasksSection && (
              <div className="mt-6 p-4 border rounded-md bg-secondary/30">
                <h3 className="text-lg font-semibold text-primary mb-2">قابلیت‌های بخش وظایف:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>ایجاد وظایف جدید</li>
                  <li>مشاهده لیست وظایف</li>
                  <li>علامت‌گذاری وظایف به عنوان انجام شده</li>
                  <li>ویرایش یا حذف وظایف</li>
                  <li> (به زودی) اولویت‌بندی و دسته‌بندی وظایف</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="text-center py-4 text-sm text