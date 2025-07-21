
'use client';

import { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Settings, Palette } from 'lucide-react';
import Link from 'next/link';
import { useColorTheme } from '@/components/ThemeManager';
import { ClientOnly } from '@/components/ClientOnly';
import { useLock } from '@/contexts/LockContext';


export default function SettingsPage() {
    const { toast } = useToast();
    const [colorTheme, setColorTheme] = useColorTheme();

    // The backup and restore functionality is removed as it's not compatible
    // with the local password model. Data is now automatically stored in localStorage.

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
                        مدیریت پوسته و سایر تنظیمات برنامه.
                    </p>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Palette className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0" />انتخاب پوسته برنامه</CardTitle>
                            <CardDescription>ظاهر و رنگ‌بندی کلی برنامه را به سلیقه خود تغییر دهید. این تنظیم در همین دستگاه ذخیره می‌شود.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ClientOnly fallback={<div className="flex justify-center"><Loader2 className="animate-spin"/></div>}>
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
                            </ClientOnly>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>پشتیبان‌گیری و بازیابی</CardTitle>
                            <CardDescription>
                                تمام اطلاعات شما در حافظه محلی (LocalStorage) مرورگرتان ذخیره می‌شود. در این نسخه، پشتیبان‌گیری دستی غیرفعال است.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </main>
             <footer className="text-center py-4 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
            </footer>
        </div>
    );
}
