'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BrainCircuit, Loader2 } from 'lucide-react';
import { useSharedState } from '@/hooks/useSharedState';
import { ClientOnly } from '@/components/ClientOnly';
import { generateId } from '@/lib/utils';
import type { KnowledgePage } from '@/types';
import { KnowledgePageList } from '@/components/knowledge/KnowledgePageList';
import { KnowledgePageEditor } from '@/components/knowledge/KnowledgePageEditor';


export default function KnowledgeBasePage() {
  const sectionTitle = "پایگاه دانش شخصی";
  const sectionPageDescription = "یادداشت‌ها، خلاصه‌ها و دانش خود را در یک ویکی شخصی سازماندهی و مدیریت کنید.";
  
  const [pages, setPages, pagesLoading] = useSharedState<KnowledgePage[]>('knowledgeBasePages', []);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  const handleSelectPage = useCallback((id: string) => {
    setSelectedPageId(id);
  }, []);

  const handleNewPage = useCallback(() => {
    const now = new Date().toISOString();
    const newPage: KnowledgePage = {
        id: generateId(),
        title: 'صفحه جدید بدون عنوان',
        content: '',
        tags: [],
        createdAt: now,
        updatedAt: now,
    };
    setPages(prev => [newPage, ...prev]);
    setSelectedPageId(newPage.id);
  }, [setPages]);

  const handleSavePage = useCallback((pageData: Omit<KnowledgePage, 'createdAt'| 'updatedAt'> & { id?: string }) => {
    setPages(prev => {
        const now = new Date().toISOString();
        const pageExists = prev.some(p => p.id === pageData.id);

        if (pageExists && pageData.id) {
            return prev.map(p => 
                p.id === pageData.id 
                    ? { ...p, title: pageData.title, content: pageData.content, tags: pageData.tags, updatedAt: now } 
                    : p
            );
        }
        return prev; // Should not create new pages from here, only update
    });
  }, [setPages]);
  
  const handleDeletePage = useCallback((id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
    if (selectedPageId === id) {
        setSelectedPageId(null);
    }
  }, [setPages, selectedPageId]);

  const selectedPage = useMemo(() => pages.find(p => p.id === selectedPageId) || null, [pages, selectedPageId]);

  return (
    <ClientOnly fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
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
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {sectionPageDescription}
          </p>
        </div>
        
        {pagesLoading ? (
            <div className="flex justify-center items-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="md:col-span-1 lg:col-span-1">
                    <KnowledgePageList 
                        pages={pages}
                        selectedPageId={selectedPageId}
                        onSelectPage={handleSelectPage}
                        onNewPage={handleNewPage}
                    />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                    <KnowledgePageEditor 
                        page={selectedPage}
                        onSave={handleSavePage}
                        onDelete={handleDeletePage}
                    />
                </div>
            </div>
        )}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground mt-8">
        <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
      </footer>
    </div>
    </ClientOnly>
  );
}
