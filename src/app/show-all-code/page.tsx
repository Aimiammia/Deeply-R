'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface FilesData {
  [path: string]: string;
}

export default function ShowAllCodePage() {
  const [files, setFiles] = useState<FilesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch('/api/get-all-files');
        if (!response.ok) {
          throw new Error('Failed to fetch file data.');
        }
        const data: FilesData = await response.json();
        setFiles(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Could not load project files.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchFiles();
  }, [toast]);

  const handleCopy = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: 'Copied to Clipboard!',
        description: `Content of ${fileName} has been copied.`,
      });
    }).catch(err => {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy to clipboard. Please copy manually.',
        variant: 'destructive',
      });
    });
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
        <h1 className="text-3xl font-bold text-primary mb-2">Project Code Viewer</h1>
        <p className="text-muted-foreground mb-6">
          Here is the complete code for your project. You can expand each section to view and copy the code for each file.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Loading all project files...</p>
          </div>
        ) : !files || Object.keys(files).length === 0 ? (
          <p className="text-center text-destructive">No files could be loaded.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(files)
              .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
              .map(([path, content]) => (
                <details key={path} className="border rounded-lg overflow-hidden">
                  <summary className="p-4 cursor-pointer hover:bg-muted font-mono text-primary flex justify-between items-center">
                    <span className="flex-1 break-all">{path}</span>
                    <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0" onClick={(e) => {
                      e.preventDefault(); // Prevent details from toggling
                      handleCopy(content, path);
                    }}>
                      Copy
                    </Button>
                  </summary>
                  <pre className="bg-gray-900 text-gray-200 p-4 overflow-x-auto text-sm">
                    <code>{content}</code>
                  </pre>
                </details>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
