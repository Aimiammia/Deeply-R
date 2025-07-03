
'use client';

import { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Upload, AlertTriangle, Loader2, Settings, Palette } from 'lucide-react';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { useColorTheme } from '@/components/ThemeManager';
import { cn } from '@/lib/utils';
import { ClientOnly } from '@/components/ClientOnly';

const LOCALSTORAGE_KEYS_TO_BACKUP = [
  'dailyTasksPlanner',
  'allProjects',
  'dailyReflections',
  'financialTransactions',
  'financialBudgets',
  'financialAssets',
  'financialInvestments',
  'financialSavingsGoals',
  'calendarBirthdaysDeeply',
  'calendarEventsDeeply',
  'userHabitsDeeply',
  'dailyActivityLogsDeeply',
  'longTermGoals',
  'userBooksDeeply',
  'userSportsActivitiesDeeply',
  'activeFastDeeply',
  'fastingHistoryDeeply',
  'educationalLevelSettingsDeeply',
  'educationalSubjectProgressDeeply',
  'knowledgeBasePages',
  'projectTemplates',
  'theme',
  'color-theme' // Added color theme
];

export default function SettingsPage() {
    const { toast } = useToast();
    const [isRestoring, setIsRestoring] = useState(false);
    const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
    const [restoreFile, setRestoreFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [colorTheme, setColorTheme, isThemeLoading] = useColorTheme();

    const handleBackup = useCallback(() => {
        try {
            const backupData: { [key: string]: any } = {};
            LOCALSTORAGE_KEYS_TO_BACKUP.forEach(key => {
                const item = localStorage.getItem(key);
                if (item) {
                    try {
                      backupData[key] = JSON.parse(item);
                    } catch (e) {
                      // Also handle cases where the value is a plain string, like the theme
                      if (typeof item === 'string') {
                          backupData[key] = item;
                      } else {
                         console.warn(`Could not parse localStorage item: ${key}`, e);
                      }
                    }
                }
            });

            if (Object.keys(backupData).length === 0) {
                toast({
                    title: "پشتیبان‌گیری ناموفق",
                    description: "هیچ داده‌ای برای پشتیبان‌گیری یافت نشد.",
                    variant: "destructive",
                });
                return;
            }

            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const today = new Date().toISOString().split('T')[0];
            link.href = url;
            link.download = `deeply_backup_${today}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({
                title: "پشتیبان‌گیری موفق",
                description: "فایل پشتیبان شما با موفقیت دانلود شد.",
            });
        } catch (error) {
            console.error("Backup failed:", error);
            toast({
                title: "خطا در پشتیبان‌گیری",
                description: "هنگام تهیه فایل پشتیبان مشکلی پیش آمد.",
                variant: "destructive",
            });
        }
    }, [toast]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setRestoreFile(file);
            setShowRestoreConfirm(true);
        }
    };

    const handleRestore = useCallback(() => {
        if (!restoreFile) return;
        setIsRestoring(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File could not be read as text.");
                }
                const dataToRestore = JSON.parse(text);

                if (typeof dataToRestore !== 'object' || dataToRestore === null) {
                    throw new Error("Invalid backup file format.");
                }

                Object.keys(dataToRestore).forEach(key => {
                    if (LOCALSTORAGE_KEYS_TO_BACKUP.includes(key)) {
                        const value = dataToRestore[key];
                        // Some values (like themes) might not be JSON objects
                        const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
                        localStorage.setItem(key, valueToStore);
                    }
                });

                toast({
                    title: "بازیابی موفق",
                    description: "اطلاعات شما با موفقیت بازیابی شد. لطفاً صفحه را رفرش کنید تا تغییرات اعمال شوند.",
                    duration: 7000,
                });

            } catch (error) {
                console.error("Restore failed:", error);
                toast({
                    title: "خطا در بازیابی",
                    description: "فایل پشتیبان نامعتبر است یا در فرآیند بازیابی مشکلی پیش آمده.",
                    variant: "destructive",
                });
            } finally {
                setIsRestoring(false);
                setShowRestoreConfirm(false);
                setRestoreFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };
        reader.onerror = () => {
            setIsRestoring(false);
            setShowRestoreConfirm(false);
            toast({
                title: "خطا در خواندن فایل",
                description: "امکان خواندن فایل انتخاب شده وجود ندارد.",
                variant: "destructive",
            });
        };
        reader.readAsText(restoreFile);
    }, [restoreFile, toast]);

    return (
        <>
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Button asChild variant="outline" className="mb-6">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        بازگشت به خانه
                    </Link>
                </Button>
                <div className="mb-8">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-1">
                        <Settings className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-primary">تنظیمات</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        مدیریت پشتیبان‌گیری، بازیابی و سایر تنظیمات برنامه.
                    </p>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Palette className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />انتخاب پوسته برنامه</CardTitle>
                            <CardDescription>ظاهر و رنگ‌بندی کلی برنامه را به سلیقه خود تغییر دهید.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ClientOnly fallback={<div className="flex justify-center"><Loader2 className="animate-spin"/></div>}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <Button variant={colorTheme === 'default' ? 'default' : 'outline'} onClick={() => setColorTheme('default')} className="h-auto p-4 flex flex-col gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full bg-[hsl(217,91%,60%)] border-2 border-background shadow-md"></div>
                                        <div className="w-6 h-6 rounded-full bg-[hsl(222,47%,11%)] border-2 border-background shadow-md"></div>
                                    </div>
                                    پیش‌فرض (آبی)
                                </Button>
                                <Button variant={colorTheme === 'theme-jungle' ? 'default' : 'outline'} onClick={() => setColorTheme('theme-jungle')} className="h-auto p-4 flex flex-col gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full bg-[hsl(142,76%,36%)] border-2 border-background shadow-md"></div>
                                        <div className="w-6 h-6 rounded-full bg-[hsl(142,50%,10%)] border-2 border-background shadow-md"></div>
                                    </div>
                                    جنگل (سبز)
                                </Button>
                                 <Button variant={colorTheme === 'theme-crimson' ? 'default' : 'outline'} onClick={() => setColorTheme('theme-crimson')} className="h-auto p-4 flex flex-col gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full bg-[hsl(350,80%,55%)] border-2 border-background shadow-md"></div>
                                        <div className="w-6 h-6 rounded-full bg-[hsl(0,10%,8%)] border-2 border-background shadow-md"></div>
                                    </div>
                                    قرمز تیره (Crimson)
                                </Button>
                                </div>
                            </ClientOnly>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><Download className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />پشتیبان‌گیری</CardTitle>
                                <CardDescription>از تمام اطلاعات خود یک فایل پشتیبان با فرمت JSON تهیه کنید تا در آینده بتوانید آن را بازیابی نمایید.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={handleBackup} className="w-full">
                                    <Download className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                                    تهیه فایل پشتیبان (.json)
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><Upload className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />بازیابی اطلاعات</CardTitle>
                                <CardDescription>یک فایل پشتیبان (.json) را برای بازگرداندن اطلاعات خود انتخاب کنید. این کار اطلاعات فعلی شما را بازنویسی می‌کند.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="restore-input"
                                />
                                <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="destructive">
                                    <Upload className="ml-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                    انتخاب فایل پشتیبان و بازیابی
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
             <footer className="text-center py-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
            </footer>
        </div>
        <AlertDialog open={showRestoreConfirm} onOpenChange={setShowRestoreConfirm}>
            <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center">
                        <AlertTriangle className="ml-2 h-5 w-5 text-destructive" />
                        تایید بازیابی اطلاعات
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        آیا مطمئن هستید؟ بازیابی اطلاعات از فایل پشتیبان، تمام داده‌های فعلی شما در برنامه را **بازنویسی** خواهد کرد. این عمل قابل بازگشت نیست.
                        <br />
                        <strong className="mt-2 block">فایل انتخاب شده: {restoreFile?.name}</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setRestoreFile(null)}>لغو</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestore} disabled={isRestoring} className="bg-destructive hover:bg-destructive/90">
                        {isRestoring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        بله، بازیابی کن
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}
