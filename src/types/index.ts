
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO date string
  dueDate?: string | null; // ISO date string, optional
  priority?: 'low' | 'medium' | 'high' | null; // Optional
  category?: string | null; // Optional
  subjectId?: string | null; // e.g., "math_h10" from educational-data.ts
  subjectName?: string | null; // e.g., "ریاضی دهم"
  startChapter?: number | null;
  endChapter?: number | null;
  educationalLevelContext?: string | null; // Educational level value at time of task creation e.g. "high_10"
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
}

export interface BirthdayEntry {
  id: string;
  name: string;
  jYear: number;   // Jalali year
  jMonth: number;  // 1-indexed Jalali month
  jDay: number;    // Jalali day
  gDate: string;   // Gregorian date as ISO string (for easier sorting/comparison if needed elsewhere)
  createdAt: string; // ISO string for when it was added
}

export interface CalendarEvent {
  id: string;
  name: string;
  description?: string | null;
  jYear: number;
  jMonth: number; // 1-indexed
  jDay: number;
  gDate: string;   // Gregorian date as ISO string
  createdAt: string; // ISO string for when it was added
}

export interface EducationalLevelStorage {
    levelValue: string;
    isConfirmed: boolean;
    lastPromotionCheckDate: string; // ISO Date string
}

export interface DailyActivityLogEntry {
  id: string;
  date: string; // ISO date string of when it was saved
  text: string;
}

export interface FinancialAsset {
  id: string;
  name: string;
  type: 'real_estate' | 'vehicle' | 'bank_account' | 'stocks' | 'crypto' | 'collectibles' | 'other';
  initialValue: number;
  purchaseDate: string; // ISO date string
  currentValue: number;
  lastValueUpdate: string; // ISO date string of when currentValue was last set
  notes?: string | null;
  createdAt: string; // ISO date string of when asset was first created
}
