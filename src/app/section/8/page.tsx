
'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, Save, Trash2, ListChecks } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { DailyActivityLogEntry } from '@/types';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebouncedLocalStorage } from '@/hooks/useDebouncedLocalStorage';


export default function DailyActivityLogPage() {
  const { toast } = useToast();
  const sectionTitle = "یادداشت فعالیت‌های روزانه";
  const sectionPageDescription = "فعالیت‌ها، دستاوردها و کارهایی که در طول روز انجام داده‌اید را در اینجا به صورت آیتم‌های لیست وارد و مرور کنید.";

  const [logs, setLogs] = useDebouncedLocalStorage<DailyActivityLogEntry[]>('dailyActivityLogsDeeply', []);
  const [currentLogText, setCurrentLogText] = useState('');
  const [isSaving, setIsSaving] = useState(false);


  const handleSaveLog = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentLogText.trim()) {
      toast({
        title: "متن خالی",
        description: "لطفاً فعالیتی برای ثبت وارد کنید.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const newLog: DailyActivityLogEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text: currentLogText.trim(),
    };

    await new Promise(resolve => setTimeout(resolve, 300)); 

    setLogs(prevLogs => [newLog, ...prevLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentLogText('');
    setIsSaving(false);
    toast({
      title: "فعالیت ثبت شد",
      description: "فعالیت شما با موفقیت در لیست ثبت شد.",
    });
  };

  const handleDeleteLog = (logId: string) => {
    const logToDelete = logs.find(log => log.id === logId);
    setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
    if (logToDelete) {
        toast({
        title: "فعالیت حذف شد",
        description: "فعالیت انتخاب شده با موفقیت حذف شد.",
        variant: "destructive",
        });
    }
  };
  
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl font-headline text-primary">
                {sectionTitle}
                </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              {sectionPageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center text-foreground">
                ثبت فعالیت جدید
              </h2>
              <form onSubmit={handleSaveLog} className="space-y-4">
                <Input
                  type="text"
                  value={currentLogText}
                  onChange={(e) => setCurrentLogText(e.target.value)}
                  placeholder="یک فعالیت انجام شده را وارد کنید (مثلا: مطالعه فصل ۲ کتاب فیزیک)"
                  className="text-base"
                  disabled={isSaving}
                  aria-label="متن فعالیت روزانه"
                />
                <Button type="submit" disabled={isSaving || !currentLogText.trim()} className="w-full sm:w-auto">
                  {isSaving ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground rtl:ml-3 rtl:-mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Save className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                  )}
                  {isSaving ? 'در حال ثبت...' : 'ثبت در لیست'}
                </Button>
              </form>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                <ListChecks className="mr-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                لیست فعالیت‌ها
              </h2>
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">هنوز هیچ فعالیتی ثبت نشده است. اولین فعالیت خود را اضافه کنید!</p>
              ) : (
                <ScrollArea className="h-[400px] pr-3 rtl:pl-3">
                  <div className="space-y-4">
                    {sortedLogs.map((log) => (
                      <Card key={log.id} className="bg-secondary/30">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-md font-semibold text-primary">
                              {format(parseISO(log.date), "eeee، d MMMM yyyy - HH:mm", { locale: faIR })}
                            </CardTitle>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent dir="rtl">
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>تایید حذف فعالیت</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        آیا از حذف این فعالیت: "{log.text}" مطمئن هستید؟ این عمل قابل بازگشت نیست.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>لغو</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteLog(log.id)} variant="destructive">
                                        حذف
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-foreground">{log.text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
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
