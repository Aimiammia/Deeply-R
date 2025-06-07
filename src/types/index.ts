
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO date string
  dueDate?: string | null; // ISO date string, optional
  priority?: 'low' | 'medium' | 'high' | null; // Optional
  category?: string | null; // Optional
}

export interface ReflectionEntry {
  id: string;
  date: string; // ISO date string of when it was saved
  prompt: string; // The daily success quote or a general prompt active at the time
  text: string;   // The user's reflection text
}

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // ISO date string
  category: string | null;
  createdAt: string; // ISO date string
}
