
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO date string
  dueDate?: string | null; // ISO date string, optional
  priority?: 'low' | 'medium' | 'high' | null; // Optional
  category?: string | null; // Optional
}
