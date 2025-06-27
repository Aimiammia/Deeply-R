
'use client';

import type { Project, Task } from '@/types';
import { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TaskItem } from '@/components/tasks/TaskItem';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FolderKanban, Edit3, Trash2, CalendarDays, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, ListChecks } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { formatJalaliDateDisplay } from '@/lib/calendar-helpers';
import { Label } from '@/components/ui/label';

interface ProjectItemProps {
  project: Project;
  tasks: Task[];
  onDeleteProject: (id: string) => void;
  onEditProject: (project: Project) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
}

const statusOptions: { value: Project['status']; label: string; icon: React.ElementType; className: string }[] = [
    { value: 'not-started', label: 'شروع نشده', icon: Clock, className: 'bg-gray-500 text-gray-50' },
    { value: 'in-progress', label: 'در حال انجام', icon: Clock, className: 'bg-blue-500 text-blue-50' },
    { value: 'completed', label: 'تکمیل شده', icon: CheckCircle, className: 'bg-green-500 text-green-50' },
    { value: 'on-hold', label: 'متوقف شده', icon: XCircle, className: 'bg-orange-500 text-orange-50' },
];

const ProjectItemComponent = ({ project, tasks, onDeleteProject, onEditProject, onToggleTask, onDeleteTask, onEditTask }: ProjectItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const projectTasks = useMemo(() => tasks.filter(task => task.projectId === project.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [tasks, project.id]);
  
  const { completedTasksCount, totalTasks, progress } = useMemo(() => {
    const total = projectTasks.length;
    if (total === 0) return { completedTasksCount: 0, totalTasks: 0, progress: project.status === 'completed' ? 100 : 0 };
    const completed = projectTasks.filter(t => t.completed).length;
    return { completedTasksCount: completed, totalTasks: total, progress: (completed / total) * 100 };
  }, [projectTasks, project.status]);

  const currentStatusOption = statusOptions.find(s => s.value === project.status) || statusOptions[0];
  const StatusIcon = currentStatusOption.icon;

  const handleEdit = useCallback(() => {
    onEditProject(project);
  }, [onEditProject, project]);

  return (
    <Card id={`project-${project.id}`} className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-300 scroll-mt-20">
        <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <CardTitle className="text-xl font-headline text-primary flex items-center">
                        <FolderKanban className="mr-2 h-6 w-6 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
                        {project.name}
                    </CardTitle>
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className={cn("text-xs", currentStatusOption.className)}>
                            <StatusIcon className="ml-1 h-3 w-3 rtl:mr-1 rtl:ml-0" />
                            {currentStatusOption.label}
                        </Badge>
                        {project.dueDate && (
                            <Badge variant="secondary" className="text-xs">
                                <CalendarDays className="ml-1 h-3 w-3 rtl:mr-1 rtl:ml-0"/>
                                سررسید: {formatJalaliDateDisplay(parseISO(project.dueDate), 'jYYYY/jMM/jDD')}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={handleEdit} aria-label="ویرایش پروژه">
                        <Edit3 className="h-5 w-5 text-blue-600" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="حذف پروژه">
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>تایید حذف پروژه</AlertDialogTitle>
                            <AlertDialogDescription>
                                آیا از حذف پروژه "{project.name}" مطمئن هستید؟ وظایف مرتبط با این پروژه حذف نخواهند شد، بلکه ارتباطشان با این پروژه قطع می‌شود. این عمل قابل بازگشت نیست.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>لغو</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteProject(project.id)} variant="destructive">حذف</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? "بستن جزئیات" : "باز کردن جزئیات"}>
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-3">
            {project.description && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap border-r-2 border-primary pr-2 rtl:border-l-2 rtl:border-r-0 rtl:pl-2">
                    {project.description}
                </p>
            )}
            <div>
                <Label className="text-xs">پیشرفت ({completedTasksCount.toLocaleString('fa-IR')} از {totalTasks.toLocaleString('fa-IR')} وظیفه)</Label>
                <Progress value={progress} className="w-full mt-1 h-2.5" />
            </div>
            {isExpanded && (
                <div className="pt-4 border-t">
                    <h4 className="text-md font-semibold text-foreground mb-2 flex items-center">
                        <ListChecks className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 text-primary" />
                        وظایف پروژه
                    </h4>
                    {projectTasks.length > 0 ? (
                        <ul className="border rounded-md">
                            {projectTasks.map(task => (
                                <TaskItem 
                                    key={task.id}
                                    task={task}
                                    onToggleComplete={onToggleTask}
                                    onDeleteTask={onDeleteTask}
                                    onEditTask={onEditTask}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center p-4 bg-muted rounded-md">
                            هنوز وظیفه‌ای برای این پروژه تعریف نشده است. می‌توانید از بخش «برنامه‌ریز روزانه» وظایf جدیدی به این پروژه اضافه کنید.
                        </p>
                    )}
                </div>
            )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground pt-3 border-t">
            <span>ایجاد شده در: {format(parseISO(project.createdAt), "PPP - HH:mm", { locale: faIR })}</span>
        </CardFooter>
    </Card>
  );
};
export const ProjectItem = memo(ProjectItemComponent);
