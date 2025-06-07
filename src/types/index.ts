

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

export interface Budget {
  id: string; // Will be the category value for simplicity, ensuring one budget per category
  category: string;
  amount: number;   // Monthly budgeted amount
  createdAt: string; // ISO date string
}

export interface LongTermGoal {
  id: string;
  title: string;
  description: string | null;
  targetDate: string | null; // ISO date string
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  createdAt: string; // ISO date string
  // Future additions:
  // milestones?: Milestone[];
  // smartCriteria?: {
  //   specific: string;
  //   measurable: string;
  //   achievable: string;
  //   relevant: string;
  //   timeBound: string; // or could be part of targetDate
  // };
}

export interface BirthdayEntry {
  id: string;
  name: string;
  jYear: number;   // Jalali year
  jMonth: number;  // 1-indexed Jalali month
  jDay: number;    // Jalali day
  createdAt: string; // ISO string for when it was added
}

export interface CalendarEvent {
  id: string;
  name: string;
  description?: string | null;
  jYear: number;
  jMonth: number; // 1-indexed
  jDay: number;
  createdAt: string; // ISO string for when it was added
  // Future: color, startTime, endTime, allDay
}

// Educational settings are stored in localStorage directly in the component
// No specific type needed here unless we centralize it more later.

    