
'use client';

import type { FastingSession } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History, TimerOff } from 'lucide-react';
import { FastingHistoryItem } from './FastingHistoryItem';

interface FastingHistoryProps {
    sessions: FastingSession[];
    onDelete: (sessionId: string) => void;
}

export function FastingHistory({ sessions, onDelete }: FastingHistoryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <History className="ml-2 h-6 w-6 rtl:mr-2 rtl:ml-0 text-primary" />
                    تاریخچه فستینگ
                </CardTitle>
                <CardDescription>
                    لیست جلسات روزه‌داری تکمیل شده شما.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {sessions.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-inner bg-muted/50">
                        <TimerOff className="mx-auto h-12 w-12 mb-4 text-primary/70" />
                        <p className="text-md">هنوز جلسه‌ای ثبت نشده است.</p>
                        <p className="text-sm">پس از اتمام یک جلسه فستینگ، در اینجا نمایش داده خواهد شد.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {sessions.map(session => (
                            <FastingHistoryItem 
                                key={session.id}
                                session={session}
                                onDelete={onDelete}
                            />
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
