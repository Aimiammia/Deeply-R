'use client';

import { useState, useEffect } from 'react';
import type { KnowledgePage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Save, Trash2, FileSignature, X } from 'lucide-react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface KnowledgePageEditorProps {
  page: KnowledgePage | null;
  onSave: (pageData: Omit<KnowledgePage, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onDelete: (id: string) => void;
}

export function KnowledgePageEditor({ page, onSave, onDelete }: KnowledgePageEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setContent(page.content);
      setTags(page.tags.join(', '));
      // Heuristic for new page: if it has the default new title and was just created.
      if (page.title === 'صفحه جدید بدون عنوان' && page.createdAt === page.updatedAt) {
        setIsEditing(true);
      } else {
        setIsEditing(false); 
      }
    } else {
      // No page selected, clear fields
      setTitle('');
      setContent('');
      setTags('');
      setIsEditing(false);
    }
  }, [page]);

  const handleSave = () => {
    if (title.trim()) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      onSave({
        id: page?.id,
        title,
        content,
        tags: tagArray
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (page?.id) {
      onDelete(page.id);
    }
  };

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-card p-6 rounded-lg border shadow-sm">
        <FileSignature className="h-16 w-16 mb-4 text-primary/70" />
        <h3 className="text-xl font-semibold text-foreground">پایگاه دانش شما</h3>
        <p className="mt-2 text-sm">یک صفحه را از لیست انتخاب کنید تا محتوای آن را مشاهده کنید، یا یک صفحه جدید ایجاد کنید.</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">{page.id ? 'ویرایش صفحه' : 'ایجاد صفحه جدید'}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 overflow-auto">
          <div>
            <Label htmlFor="pageTitle">عنوان</Label>
            <Input id="pageTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان صفحه..." />
          </div>
          <div>
            <Label htmlFor="pageContent">محتوا</Label>
            <Textarea id="pageContent" value={content} onChange={(e) => setContent(e.target.value)} placeholder="محتوای خود را اینجا بنویسید..." rows={15} />
          </div>
          <div>
            <Label htmlFor="pageTags">تگ‌ها (با کاما جدا کنید)</Label>
            <Input id="pageTags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="مثلا: برنامه‌نویسی, ایده, مهم" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => setIsEditing(false)} variant="outline">
            <X className="mr-2 h-4 w-4" />
            انصراف
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            <Save className="mr-2 h-4 w-4" />
            ذخیره
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl text-primary">{page.title}</CardTitle>
                    <CardDescription className="mt-2 flex flex-wrap gap-2">
                        {page.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                     <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0"/>
                        ویرایش
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0"/>
                                حذف
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>تایید حذف صفحه</AlertDialogTitle>
                                <AlertDialogDescription>
                                آیا از حذف صفحه "{page.title}" مطمئن هستید؟ این عمل قابل بازگشت نیست.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>لغو</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} variant="destructive">حذف</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap p-4 bg-muted/30 rounded-md">
                {page.content || <span className="text-muted-foreground italic">محتوایی برای نمایش وجود ندارد.</span>}
            </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex justify-between">
            <span>ایجاد: {format(new Date(page.createdAt), 'PPP p', { locale: faIR })}</span>
            <span>آخرین ویرایش: {format(new Date(page.updatedAt), 'PPP p', { locale: faIR })}</span>
        </CardFooter>
    </Card>
  );
}
