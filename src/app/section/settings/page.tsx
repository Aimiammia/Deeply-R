
'use client';

import { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Settings, Palette, Download, Upload, AlertTriangle, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useColorTheme } from '@/components/ThemeManager';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
    const { toast } = useToast();
    const [colorTheme, setColorTheme, isThemeLoading] = useColorTheme();
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileToImport, setFileToImport] = useState<File | null>(null);

    const handleExport = useCallback(() => {
        setIsExporting(true);
        try {
            const dataToExport: { [key: string]: any } = {};
            // Assuming your local API keys are stored with a specific prefix,
            // or you can explicitly list them. For now, we'll try to find keys.
            // This logic might need adjustment based on final keys used in useFirestore.
            const keysToExport = Object.keys(localStorage);
            
            keysToExport.forEach(key => {
                 // A simple check to see if it's likely our data, might need refinement
                if (key.includes('Deeply')) {
                    dataToExport[key] = JSON.parse(localStorage.getItem(key)!);
                }
            });

            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `deeply-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast({ title: 'موفقیت‌آمیز', description: 'فایل پشتیبان با موفقیت دانلود شد.' });
        } catch (error) {
            console.error('Error exporting data:', error);
            toast({ title: 'خطا', description: 'خطایی در هنگام تهیه فایل پشتیبان رخ داد.', variant: 'destructive' });
        } finally {
            setIsExporting(false);
        }
    }, [toast]);

    const handleImportTrigger = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/json') {
            setFileToImport(file);
            setShowImportConfirm(true);
        } else {
            toast({ title: 'فایل نامعتبر', description: 'لطفاً یک فایل پشتیبان با فرمت .json انتخاب کنید.', variant: 'destructive' });
        }
        event.target.value = ''; // Reset file input
    };

    const handleImportConfirm = () => {
        if (!fileToImport) return;
        
        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not text.");
                }
                const data = JSON.parse(text);
                if (typeof data !== 'object' || data === null) {
                    throw new Error("Invalid JSON structure.");
                }

                Object.keys(data).forEach(key => {
                     localStorage.setItem(key, JSON.stringify(data[key]));
                });
                
                toast({ title: 'موفقیت‌آمیز', description: 'اطلاعات با موفقیت بازیابی شد. لطفاً صفحه را رفرش کنید تا تغییرات اعمال شود.' });
            } catch (error) {
                console.error('Error importing data:', error);
                toast({ title: 'خطا در بازیابی', description: 'فایل پشتیبان نامعتبر است یا در خواندن آن مشکلی پیش آمد.', variant: 'destructive' });
            } finally {
                setIsImporting(false);
                setShowImportConfirm(false);
                setFileToImport(null);
            }
        };
        reader.onerror = () => {
            toast({ title: 'خطا', description: 'خطایی در هنگام خواندن فایل رخ داد.', variant: 'destructive' });
            setIsImporting(false);
        };
        reader.readAsText(fileToImport);
    };

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
                <div className="mb-8">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mb-1">
                        <Settings className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-primary">تنظیمات</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        مدیریت پوسته و داده‌های برنامه.
                    </p>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Palette className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />انتخاب پوسته برنامه</CardTitle>
                            <CardDescription>ظاهر و رنگ‌بندی کلی برنامه را به سلیقه خود تغییر دهید. این تنظیم در همین دستگاه ذخیره می‌شود.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isThemeLoading ? <div className="flex justify-center"><Loader2 className="animate-spin"/></div> : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <Button variant={colorTheme === 'default' ? 'default' : 'outline'} onClick={() => setColorTheme('default')} className="h-auto p-4 flex flex-col gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full bg-[hsl(220,90%,55%)] border-2 border-background shadow-md"></div>
                                        <div className="w-6 h-6 rounded-full bg-[hsl(0,0%,10%)] border-2 border-background shadow-md"></div>
                                    </div>
                                    پیش‌فرض (آبی)
                                </Button>
                                <Button variant={colorTheme === 'theme-jungle' ? 'default' : 'outline'} onClick={() => setColorTheme('theme-jungle')} className="h-auto p-4 flex flex-col gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full bg-[hsl(142,76%,36%)] border-2 border-background shadow-md"></div>
                                        <div className="w-6 h-6 rounded-full bg-[hsl(142,40%,17%)] border-2 border-background shadow-md"></div>
                                    </div>
                                    جنگل (سبز)
                                </Button>
                                 <Button variant={colorTheme === 'theme-crimson' ? 'default' : 'outline'} onClick={() => setColorTheme('theme-crimson')} className="h-auto p-4 flex flex-col gap-2">
                                    <div className="flex gap-1">
                                        <div className="w-6 h-6 rounded-full bg-[hsl(350,80%,55%)] border-2 border-background shadow-md"></div>
                                        <div className="w-6 h-6 rounded-full bg-[hsl(0,15%,15%)] border-2 border-background shadow-md"></div>
                                    </div>
                                    قرمز تیره (Crimson)
                                </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>پشتیبان‌گیری و بازیابی</CardTitle>
                            <CardDescription>
                                از اطلاعات خود که در این مرورگر ذخیره شده، یک فایل پشتیبان JSON تهیه کنید یا فایل پشتیبان قبلی را بازیابی نمایید.
                                <br/>
                                <strong className="text-destructive">توجه:</strong> بازیابی اطلاعات، تمام اطلاعات فعلی شما را بازنویسی خواهد کرد.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={handleExport} disabled={isExporting} className="w-full sm:w-auto">
                                {isExporting ? <Loader2 className="animate-spin ml-2"/> : <Download className="ml-2 h-4 w-4" />}
                                تهیه فایل پشتیبان (Export)
                            </Button>
                            <Button onClick={handleImportTrigger} disabled={isImporting} variant="outline" className="w-full sm:w-auto">
                                {isImporting ? <Loader2 className="animate-spin ml-2"/> : <Upload className="ml-2 h-4 w-4" />}
                                بازیابی از فایل (Import)
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                        </CardContent>
                    </Card>
                </div>
            </main>
             <footer className="text-center py-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
            </footer>

            <AlertDialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
                <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>تایید بازیابی اطلاعات</AlertDialogTitle>
                        <AlertDialogDescription>
                            آیا مطمئن هستید که می‌خواهید اطلاعات را از فایل <span className="font-mono text-primary">{fileToImport?.name}</span> بازیابی کنید؟
                            <br/>
                            <strong className="text-destructive mt-2 block">این عمل تمام اطلاعات فعلی شما در این مرورگر را پاک کرده و اطلاعات فایل پشتیبان را جایگزین آن می‌کند. این کار غیرقابل بازگشت است.</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setFileToImport(null)}>لغو</AlertDialogCancel>
                        <AlertDialogAction onClick={handleImportConfirm} disabled={isImporting}>
                            {isImporting && <Loader2 className="animate-spin ml-2" />}
                            تایید و بازیابی
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
