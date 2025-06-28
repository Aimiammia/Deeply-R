'use client';

import { useState } from 'react';
import type { KnowledgePage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilePlus2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface KnowledgePageListProps {
  pages: KnowledgePage[];
  selectedPageId: string | null;
  onSelectPage: (id: string) => void;
  onNewPage: () => void;
}

export function KnowledgePageList({ pages, selectedPageId, onSelectPage, onNewPage }: KnowledgePageListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPages = pages
    .filter(page => 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="flex flex-col h-full bg-card p-4 rounded-lg shadow-sm border">
        <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:right-2.5 rtl:left-auto" />
            <Input
                type="search"
                placeholder="جستجو در عنوان یا تگ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 rtl:pr-8"
            />
        </div>
        <ScrollArea className="flex-grow mb-4 -mx-4 min-h-[40vh]">
            <div className="px-4">
                {filteredPages.length > 0 ? (
                <ul className="space-y-2">
                    {filteredPages.map(page => (
                    <li key={page.id}>
                        <button
                        onClick={() => onSelectPage(page.id)}
                        className={cn(
                            'w-full text-right p-3 rounded-md transition-colors text-sm text-foreground',
                            selectedPageId === page.id
                            ? 'bg-primary text-primary-foreground font-semibold shadow'
                            : 'bg-muted/50 hover:bg-muted'
                        )}
                        >
                        <p className="font-semibold truncate">{page.title}</p>
                        <p className={cn(
                            "text-xs truncate",
                             selectedPageId === page.id ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                            آخرین ویرایش: {format(new Date(page.updatedAt), 'PPP', { locale: faIR })}
                        </p>
                        </button>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-center text-muted-foreground text-sm p-4">
                    هیچ صفحه‌ای یافت نشد.
                </p>
                )}
            </div>
        </ScrollArea>
        <Button onClick={onNewPage} className="w-full">
          <FilePlus2 className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0"/>
          ایجاد صفحه جدید
        </Button>
    </div>
  );
}
