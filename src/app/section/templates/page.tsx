
'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CopyPlus, Edit3, ListChecks, PlusCircle, Save, Trash2, X } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import { useToast } from '@/hooks/use-toast';
import type { ProjectTemplate, TemplateTask } from '@/types';
import { generateId } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';

export default function TemplatesPage() {
    const sectionTitle = "مدیریت قالب‌ها";
    const sectionPageDescription = "برای پروژه‌های تکراری خود قالب بسازید تا با یک کلیک بتوانید آن‌ها را ایجاد کنید.";

    const { toast } = useToast();
    const [templates, setTemplates, templatesLoading] = useFirestore<ProjectTemplate[]>('projectTemplates', []);
    const [editingTemplate, setEditingTemplate] = useState<ProjectTemplate | null>(null);

    // Form state
    const [templateName, setTemplateName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [tasks, setTasks] = useState<TemplateTask[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const isEditing = !!editingTemplate;

    const resetForm = useCallback(() => {
        setTemplateName('');
        setProjectDescription('');
        setTasks([]);
        setNewTaskTitle('');
        setEditingTemplate(null);
    }, []);

    useEffect(() => {
        if (editingTemplate) {
            setTemplateName(editingTemplate.name);
            setProjectDescription(editingTemplate.projectDescription || '');
            setTasks(editingTemplate.tasks);
        } else {
            resetForm();
        }
    }, [editingTemplate, resetForm]);

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            setTasks([...tasks, { id: generateId(), title: newTaskTitle.trim() }]);
            setNewTaskTitle('');
        }
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleSaveTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateName.trim()) {
            toast({ title: "خطا", description: "نام قالب نمی‌تواند خالی باشد.", variant: "destructive" });
            return;
        }

        const templateData = {
            name: templateName.trim(),
            projectDescription: projectDescription.trim() || null,
            tasks,
        };

        if (isEditing && editingTemplate) {
            setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...templateData } : t));
            toast({ title: "قالب ویرایش شد" });
        } else {
            const newTemplate: ProjectTemplate = {
                ...templateData,
                id: generateId(),
                createdAt: new Date().toISOString(),
            };
            setTemplates(prev => [newTemplate, ...prev]);
            toast({ title: "قالب جدید ذخیره شد" });
        }
        resetForm();
    };
    
    const handleDeleteTemplate = (templateId: string) => {
        setTemplates(prev => prev.filter(t => t.id !== templateId));
        toast({ title: "قالب حذف شد", variant: "destructive" });
        if (editingTemplate?.id === templateId) {
            resetForm();
        }
    };

    if (templatesLoading) {
        return (
            <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="flex justify-center items-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </main>
            </div>
        );
    }

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
                        <CopyPlus className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">{sectionPageDescription}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{isEditing ? 'ویرایش قالب' : 'ایجاد قالب جدید'}</CardTitle>
                            {isEditing && <Button variant="link" size="sm" className="p-0 h-auto self-start" onClick={resetForm}>یا یک قالب جدید بساز</Button>}
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveTemplate} className="space-y-4">
                                <div>
                                    <Label htmlFor="templateName">نام قالب</Label>
                                    <Input id="templateName" value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="مثلا: چک‌لیست انتشار وب‌سایت" required />
                                </div>
                                <div>
                                    <Label htmlFor="projectDescription">توضیحات پیش‌فرض پروژه (اختیاری)</Label>
                                    <Textarea id="projectDescription" value={projectDescription} onChange={e => setProjectDescription(e.target.value)} placeholder="توضیحاتی که بعدا در پروژه ایجاد شده قرار می‌گیرد" rows={2}/>
                                </div>
                                <div>
                                    <Label>وظایف پیش‌فرض قالب</Label>
                                    <div className="space-y-2 mt-2">
                                        {tasks.map(task => (
                                            <div key={task.id} className="flex items-center gap-2 p-2 bg-secondary rounded-md text-sm">
                                                <span className="flex-grow">{task.title}</span>
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteTask(task.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="عنوان وظیفه جدید" onKeyDown={e => {if(e.key === 'Enter'){ e.preventDefault(); handleAddTask();}}}/>
                                        <Button type="button" variant="outline" onClick={handleAddTask}>افزودن</Button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditing ? 'ذخیره تغییرات' : 'ذخیره قالب'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>قالب‌های موجود</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {templatesLoading ? <Loader2 className="animate-spin" /> : (
                                templates.length > 0 ? (
                                    <ul className="space-y-3">
                                        {templates.map(template => (
                                            <li key={template.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                                <div>
                                                    <p className="font-semibold">{template.name}</p>
                                                    <p className="text-xs text-muted-foreground">{template.tasks.length.toLocaleString('fa-IR')} وظیفه</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingTemplate(template)}>
                                                        <Edit3 className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent dir="rtl">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>تایید حذف قالب</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    آیا از حذف قالب "{template.name}" مطمئن هستید؟
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>لغو</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteTemplate(template.id)} variant="destructive">حذف</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">هنوز قالبی ایجاد نشده است.</p>
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <footer className="text-center py-4 text-sm text-muted-foreground mt-8">
                <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
            </footer>
        </div>
    );
}
