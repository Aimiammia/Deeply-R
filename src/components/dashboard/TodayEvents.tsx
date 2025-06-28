'use client';

import { Gift, Calendar } from 'lucide-react';

interface EventItem {
    type: 'event' | 'birthday';
    name: string;
}

interface TodayEventsProps {
    events: EventItem[];
}

export function TodayEvents({ events }: TodayEventsProps) {
    if (events.length === 0) {
        return (
            <p className="text-center text-sm text-muted-foreground py-4">
                امروز هیچ رویداد یا تولدی ثبت نشده است.
            </p>
        );
    }
    
    return (
        <ul className="space-y-3">
            {events.map((item, index) => {
                const Icon = item.type === 'birthday' ? Gift : Calendar;
                const color = item.type === 'birthday' ? 'text-yellow-500' : 'text-blue-500';
                return (
                    <li key={index} className="flex items-center gap-3 p-3 rounded-md bg-secondary/50">
                        <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} />
                        <span className="text-base font-medium text-foreground">{item.name}</span>
                    </li>
                );
            })}
        </ul>
    );
}
