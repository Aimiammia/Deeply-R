
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FolderKanban, PlusCircle, ListChecks, Loader2, CopyPlus } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { Project, Task, ProjectTemplate } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from '@/hooks/useFirestore';
import { Skeleton } from '@/components/ui/skeleton';
import { generateId } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const FormLoadingSkeleton = () => (
  <div className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mb-8 animate-pulse">
    <Skeleton className="h-8 w-1/3 mb-4 rounded" />
    <Skeleton className="h-10 w-full rounded" />
    <Skeleton className="h-20 w-full rounded" />
    <div className="flex gap-4">
      <Skeleton className="h-10 flex-1 rounded" />
      <Skeleton className="h-10 flex-1 rounded" />
    </div>
    <Skeleton className="h-10 w-full rounded" />
  </div>
);

const ListLoadingSkeleton = () => (
  <div className="mt-8 animate-pulse">
    <Skeleton className="h-8 w-1/2 mb-4 rounded" />
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-lg" />
      <Skeleton className="h-28 w-full rounded-lg" />
      <Skeleton className="h-28 w-full rounded-lg" />
    </div>
  </div>
);

const DynamicCreateProjectForm = dynamic(() => import('@/components/projects/CreateProjectForm').then(mod => mod.CreateProjectForm), { ssr: false, loading: () => <FormLoadingSkeleton /> });
const DynamicProjectList = dynamic(() => import('@/components/projects/ProjectList').then(mod => mod.ProjectList), { ssr: false, loading: () => <ListLoadingSkeleton /> });

export default function ProjectsPage() {
  const sectionTitle = "مدیریت پروژه‌ها";
  const sectionPageDescription = "پروژه‌های خود را با وظایف، مهلت‌ها و وضعیت پیشرفت مدیریت کنید.";
  const { toast } = useToast();

  const [projects, setProjects, projectsLoading] = useFirestore<Project[]>('allProjects', []);
  const [tasks, setTasks, tasksLoading] = useFirestore<Task[]>('dailyTasksPlanner', []);
  const [templates, , templatesLoading] = useFirestore<ProjectTemplate[]>('projectTemplates', []);
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const pageIsLoading = projectsLoading || tasksLoading;

  const handleSaveProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt'>, isEditing: boolean) => {
    if (isEditing && editingProject) {
      const updatedProject = { ...editingProject, ...projectData };
      setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
      toast({ title: "پروژه ویرایش شد" });
    } else {
      const newProject: Project = { ...projectData, id: generateId(), createdAt: new Date().toISOString() };
      setProjects(prev => [newProject, ...prev]);
      toast({ title: "پروژه جدید اضافه شد" });
    }
    setShowForm(false);
    setEditingProject(null);
  }, [setProjects, editingProject, toast]);
  
  const handleDeleteProject = useCallback((projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    // Also, unset the projectId from any tasks associated with it
    setTasks(prevTasks => prevTasks.map(t => t.projectId === projectId ? { ...t, projectId: null, projectName: null } : t));
    if (projectToDelete) {
      toast({ title: "پروژه حذف شد", description: `پروژه "${projectToDelete.name}" و ارتباط آن با وظایف حذف شد.`, variant: "destructive" });
    }
  }, [projects, setProjects, setTasks, toast]);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
    const formCard = document.getElementById('project-form-card');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const handleAddNew = () => {
    setEditingProject(null);
    setShowForm(true);
  };
  
  const handleToggleTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const isCompleted = !task.completed;
          return { ...task, completed: isCompleted, completedAt: isCompleted ? new Date().toISOString() : null };
        }
        return task;
      })
    );
  }, [setTasks]);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);
  
  const handleEditTask = useCallback((id: string, newTitle: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  }, [setTasks]);

  const handleUseTemplate = useCallback((template: ProjectTemplate) => {
    const newProjectId = generateId();
    const newProject: Project = {
        id: newProjectId,
        name: template.name,
        description: template.projectDescription,
        status: 'not-started',
        dueDate: null,
        createdAt: new Date().toISOString(),
    };

    const newTasks: Task[] = template.tasks.map(taskTemplate => ({
        id: generateId(),
        title: taskTemplate.title,
        completed: false,
        createdAt: new Date().toISOString(),
        projectId: newProjectId,
        projectName: newProject.name,
        dueDate: null,
        dueTime: null,
        priority: null,
        category: null,
        subjectId: null,
        subjectName: null,
        startChapter: null,
        endChapter: null,
        educationalLevelContext: null,
        estimatedMinutes: null,
        pomodorosCompleted: 0
    }));

    setProjects(prev => [newProject, ...prev]);
    setTasks(prev => [...newTasks, ...prev]);

    toast({
        title: "پروژه از قالب ایجاد شد",
        description: `پروژه "${newProject.name}" با ${newTasks.length.toLocaleString('fa-IR')} وظیفه ایجاد شد.`,
    });
    setIsTemplateDialogOpen(false);
  }, [setProjects, setTasks, toast]);

  if (pageIsLoading) {
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <FolderKanban className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">{sectionTitle}</h1>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                بازگشت به خانه
              </Link>
            </Button>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            {sectionPageDescription}
          </p>

          <div className="space-y-8">
            <Card id="project-form-card" className="scroll-mt-20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center text-foreground">
                    <PlusCircle className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                    {showForm ? (editingProject ? 'ویرایش پروژه' : 'افزودن پروژه جدید') : 'افزودن پروژه جدید'}
                  </CardTitle>
                   {!showForm && <CardDescription>برای افزودن پروژه جدید روی دکمه کلیک کنید.</CardDescription>}
                </div>
                 <Button onClick={() => {
                      if (showForm) { 
                          setShowForm(false);
                          setEditingProject(null);
                      } else {
                          handleAddNew();
                      }
                  }} variant={showForm ? "outline" : "default"}>
                      {showForm ? 'انصراف' : (<><PlusCircle className="ml-2 h-4 w-4 rtl:mr-2 rtl:mr-0"/> افزودن</>)}
                  </Button>
              </CardHeader>
              {showForm && (
                <CardContent>
                  <DynamicCreateProjectForm onSaveProject={handleSaveProject} existingProject={editingProject} />
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl flex items-center text-foreground">
                        <ListChecks className="ml-2 h-5 w-5 text-primary rtl:ml-2 rtl:mr-0" />
                        لیست پروژه‌های شما
                    </CardTitle>
                    <Button onClick={() => setIsTemplateDialogOpen(true)} variant="secondary" disabled={templatesLoading || templates.length === 0}>
                        <CopyPlus className="ml-2 h-4 w-4 rtl:mr-2 rtl:mr-0"/> استفاده از قالب
                    </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pageIsLoading ? (
                    <ListLoadingSkeleton />
                ) : (
                    <DynamicProjectList 
                        projects={projects}
                        tasks={tasks}
                        onDeleteProject={handleDeleteProject}
                        onEditProject={handleEditProject}
                        onToggleTask={handleToggleTask}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={handleEditTask}
                    />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <footer className="text-center py-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Deeply. All rights reserved.</p>
        </footer>
      </div>
  );
}
