
'use client';

import type { Project, Task } from '@/types';
import { ProjectItem } from './ProjectItem';
import { FolderKanban } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  tasks: Task[];
  onDeleteProject: (id: string) => void;
  onEditProject: (project: Project) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void;
}

export function ProjectList({ projects, tasks, onDeleteProject, onEditProject, onToggleTask, onDeleteTask, onEditTask }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground border rounded-lg shadow-sm bg-card mt-6">
        <FolderKanban className="mx-auto h-12 w-12 mb-4 text-primary" />
        <p className="text-lg">هنوز پروژه‌ای تعریف نشده است.</p>
        <p>اولین پروژه خود را از طریق فرم بالا اضافه کنید!</p>
      </div>
    );
  }

  const sortedProjects = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="mt-8">
      <ul className="space-y-4">
        {sortedProjects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            tasks={tasks}
            onDeleteProject={onDeleteProject}
            onEditProject={onEditProject}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}
      </ul>
    </div>
  );
}
