

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  dueDate: string | null; // ISO date string
  createdAt: string; // ISO date string
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO date string
  dueDate?: string | null; // ISO date string, optional
  dueTime?: string | null; // Optional time string, e.g., "14:30"
  priority?: 'low' | 'medium' | 'high' | null; // Optional
  category?: string | null; // Optional
  projectId?: string | null; // ID of the project this task belongs to
  projectName?: string | null; // Name of the project this task belongs to
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

export interface Milestone {
  id: string;
  name: string;
  completed: boolean;
}

export interface LongTermGoal {
  id: string;
  title: string;
  description: string | null;
  targetDate: string | null; // ISO date string
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  createdAt: string; // ISO date string
  successCriteria?: string | null;
  milestones?: Milestone[] | null;
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

export interface SubjectProgress {
    status: 'not-started' | 'in-progress' | 'completed';
    currentGrade?: string | null; // e.g., "18.5", "A+", "خوب"
    detailedNotes?: string | null;
}
export interface EducationalSubjectUserProgress {
    [subjectId: string]: SubjectProgress;
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

export interface FinancialInvestment {
  id: string;
  name: string; // e.g., "Shares of Company X", "Bitcoin Holding"
  type: 'stocks' | 'crypto' | 'bonds' | 'gold' | 'fund' | 'other';
  purchaseDate: string; // ISO date string
  quantity: number; // Number of units/shares/grams
  purchasePricePerUnit: number;
  fees: number; // Total fees for acquisition
  currentPricePerUnit: number;
  lastPriceUpdateDate: string; // ISO date string
  notes?: string | null;
  createdAt: string; // ISO date string
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string | null; // ISO date string, optional
  createdAt: string; // ISO date string
  status: 'active' | 'achieved' | 'cancelled';
}

export interface Habit {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  completions: string[]; // Array of ISO date strings (YYYY-MM-DD) for when the habit was completed
}

export interface Book {
  id: string;
  title: string;
  author?: string | null;
  status: 'to-read' | 'reading' | 'read';
  genre?: string | null;
  publisher?: string | null;
  currentPage?: number | null;
  totalPages?: number | null;
  notes?: string | null;
  addedAt: string; // ISO date string
  finishedAt?: string | null; // ISO date string
  rating?: number | null; // Optional rating (e.g., 1-5 stars)
}

export interface SportsActivity {
  id: string;
  activityType: string;
  date: string; // ISO date string
  durationMinutes: number;
  distanceKm?: number | null;
  caloriesBurned?: number | null;
  notes?: string | null;
  createdAt: string; // ISO date string
}

export interface ActiveFast {
  id: string;
  startTime: string; // ISO date string
}

export interface FastingSession {
  id: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  durationHours: number;
  notes?: string | null;
}

export interface KnowledgePage {
  id: string;
  title: string;
  content: string; // Raw text content, can be interpreted as Markdown by a renderer
  tags: string[];
  createdAt: string; // ISO date string
  updatedAt:string; // ISO date string
}
