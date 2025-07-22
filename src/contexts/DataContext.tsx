
'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import type { 
    Task, 
    Project, 
    ReflectionEntry, 
    FinancialTransaction, 
    Budget, 
    FinancialAsset, 
    FinancialInvestment, 
    SavingsGoal, 
    Habit, 
    Book, 
    SportsActivity, 
    ActiveFast, 
    FastingSession, 
    KnowledgePage, 
    ProjectTemplate, 
    Challenge, 
    CalorieProfile, 
    FoodLogEntry, 
    BirthdayEntry, 
    CalendarEvent, 
    DailyActivityLogEntry, 
    EducationalLevelStorage, 
    EducationalSubjectUserProgress 
} from '@/types';

interface DataContextType {
    tasks: Task[];
    setTasks: (value: Task[] | ((val: Task[]) => Task[])) => void;
    tasksLoading: boolean;
    
    projects: Project[];
    setProjects: (value: Project[] | ((val: Project[]) => Project[])) => void;
    projectsLoading: boolean;

    reflections: ReflectionEntry[];
    setReflections: (value: ReflectionEntry[] | ((val: ReflectionEntry[]) => ReflectionEntry[])) => void;
    reflectionsLoading: boolean;

    transactions: FinancialTransaction[];
    setTransactions: (value: FinancialTransaction[] | ((val: FinancialTransaction[]) => FinancialTransaction[])) => void;
    transactionsLoading: boolean;

    budgets: Budget[];
    setBudgets: (value: Budget[] | ((val: Budget[]) => Budget[])) => void;
    budgetsLoading: boolean;
    
    assets: FinancialAsset[];
    setAssets: (value: FinancialAsset[] | ((val: FinancialAsset[]) => FinancialAsset[])) => void;
    assetsLoading: boolean;
    
    investments: FinancialInvestment[];
    setInvestments: (value: FinancialInvestment[] | ((val: FinancialInvestment[]) => FinancialInvestment[])) => void;
    investmentsLoading: boolean;
    
    savingsGoals: SavingsGoal[];
    setSavingsGoals: (value: SavingsGoal[] | ((val: SavingsGoal[]) => SavingsGoal[])) => void;
    savingsGoalsLoading: boolean;

    habits: Habit[];
    setHabits: (value: Habit[] | ((val: Habit[]) => Habit[])) => void;
    habitsLoading: boolean;
    
    books: Book[];
    setBooks: (value: Book[] | ((val: Book[]) => Book[])) => void;
    booksLoading: boolean;

    activities: SportsActivity[];
    setActivities: (value: SportsActivity[] | ((val: SportsActivity[]) => SportsActivity[])) => void;
    activitiesLoading: boolean;

    activeFast: ActiveFast | null;
    setActiveFast: (value: ActiveFast | null | ((val: ActiveFast | null) => ActiveFast | null)) => void;
    activeFastLoading: boolean;

    fastingSessions: FastingSession[];
    setFastingSessions: (value: FastingSession[] | ((val: FastingSession[]) => FastingSession[])) => void;
    fastingSessionsLoading: boolean;
    
    knowledgePages: KnowledgePage[];
    setKnowledgePages: (value: KnowledgePage[] | ((val: KnowledgePage[]) => KnowledgePage[])) => void;
    knowledgePagesLoading: boolean;
    
    projectTemplates: ProjectTemplate[];
    setProjectTemplates: (value: ProjectTemplate[] | ((val: ProjectTemplate[]) => ProjectTemplate[])) => void;
    projectTemplatesLoading: boolean;

    challenges: Challenge[];
    setChallenges: (value: Challenge[] | ((val: Challenge[]) => Challenge[])) => void;
    challengesLoading: boolean;

    calorieProfile: CalorieProfile | null;
    setCalorieProfile: (value: CalorieProfile | null | ((val: CalorieProfile | null) => CalorieProfile | null)) => void;
    calorieProfileLoading: boolean;

    foodLog: FoodLogEntry[];
    setFoodLog: (value: FoodLogEntry[] | ((val: FoodLogEntry[]) => FoodLogEntry[])) => void;
    foodLogLoading: boolean;

    birthdays: BirthdayEntry[];
    setBirthdays: (value: BirthdayEntry[] | ((val: BirthdayEntry[]) => BirthdayEntry[])) => void;
    birthdaysLoading: boolean;

    events: CalendarEvent[];
    setEvents: (value: CalendarEvent[] | ((val: CalendarEvent[]) => CalendarEvent[])) => void;
    eventsLoading: boolean;

    activityLogs: DailyActivityLogEntry[];
    setActivityLogs: (value: DailyActivityLogEntry[] | ((val: DailyActivityLogEntry[]) => DailyActivityLogEntry[])) => void;
    activityLogsLoading: boolean;

    educationalSettings: EducationalLevelStorage;
    setEducationalSettings: (value: EducationalLevelStorage | ((val: EducationalLevelStorage) => EducationalLevelStorage)) => void;
    educationalSettingsLoading: boolean;

    subjectProgress: EducationalSubjectUserProgress;
    setSubjectProgress: (value: EducationalSubjectUserProgress | ((val: EducationalSubjectUserProgress) => EducationalSubjectUserProgress)) => void;
    subjectProgressLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialEducationalSettings: EducationalLevelStorage = {
  levelValue: '',
  isConfirmed: false,
  lastPromotionCheckDate: new Date(1970, 0, 1).toISOString(),
};

export function DataProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks, tasksLoading] = useFirestore<Task[]>('dailyTasksPlanner', []);
    const [projects, setProjects, projectsLoading] = useFirestore<Project[]>('allProjects', []);
    const [reflections, setReflections, reflectionsLoading] = useFirestore<ReflectionEntry[]>('dailyReflections', []);
    const [transactions, setTransactions, transactionsLoading] = useFirestore<FinancialTransaction[]>('financialTransactions', []);
    const [budgets, setBudgets, budgetsLoading] = useFirestore<Budget[]>('financialBudgets', []);
    const [assets, setAssets, assetsLoading] = useFirestore<FinancialAsset[]>('financialAssets', []);
    const [investments, setInvestments, investmentsLoading] = useFirestore<FinancialInvestment[]>('financialInvestments', []);
    const [savingsGoals, setSavingsGoals, savingsGoalsLoading] = useFirestore<SavingsGoal[]>('financialSavingsGoals', []);
    const [habits, setHabits, habitsLoading] = useFirestore<Habit[]>('userHabitsDeeply', []);
    const [books, setBooks, booksLoading] = useFirestore<Book[]>('userBooksDeeply', []);
    const [activities, setActivities, activitiesLoading] = useFirestore<SportsActivity[]>('userSportsActivitiesDeeply', []);
    const [activeFast, setActiveFast, activeFastLoading] = useFirestore<ActiveFast | null>('activeFastDeeply', null);
    const [fastingSessions, setFastingSessions, fastingSessionsLoading] = useFirestore<FastingSession[]>('fastingHistoryDeeply', []);
    const [knowledgePages, setKnowledgePages, knowledgePagesLoading] = useFirestore<KnowledgePage[]>('knowledgeBasePages', []);
    const [projectTemplates, setProjectTemplates, projectTemplatesLoading] = useFirestore<ProjectTemplate[]>('projectTemplates', []);
    const [challenges, setChallenges, challengesLoading] = useFirestore<Challenge[]>('thirtyDayChallenges', []);
    const [calorieProfile, setCalorieProfile, calorieProfileLoading] = useFirestore<CalorieProfile | null>('calorieProfileDeeply', null);
    const [foodLog, setFoodLog, foodLogLoading] = useFirestore<FoodLogEntry[]>('foodLogDeeply', []);
    const [birthdays, setBirthdays, birthdaysLoading] = useFirestore<BirthdayEntry[]>('calendarBirthdaysDeeply', []);
    const [events, setEvents, eventsLoading] = useFirestore<CalendarEvent[]>('calendarEventsDeeply', []);
    const [activityLogs, setActivityLogs, activityLogsLoading] = useFirestore<DailyActivityLogEntry[]>('dailyActivityLogsDeeply', []);
    const [educationalSettings, setEducationalSettings, educationalSettingsLoading] = useFirestore<EducationalLevelStorage>('educationalLevelSettingsDeeply', initialEducationalSettings);
    const [subjectProgress, setSubjectProgress, subjectProgressLoading] = useFirestore<EducationalSubjectUserProgress>('educationalSubjectProgressDeeply', {});

    const value = {
        tasks, setTasks, tasksLoading,
        projects, setProjects, projectsLoading,
        reflections, setReflections, reflectionsLoading,
        transactions, setTransactions, transactionsLoading,
        budgets, setBudgets, budgetsLoading,
        assets, setAssets, assetsLoading,
        investments, setInvestments, investmentsLoading,
        savingsGoals, setSavingsGoals, savingsGoalsLoading,
        habits, setHabits, habitsLoading,
        books, setBooks, booksLoading,
        activities, setActivities, activitiesLoading,
        activeFast, setActiveFast, activeFastLoading,
        fastingSessions, setFastingSessions, fastingSessionsLoading,
        knowledgePages, setKnowledgePages, knowledgePagesLoading,
        projectTemplates, setProjectTemplates, projectTemplatesLoading,
        challenges, setChallenges, challengesLoading,
        calorieProfile, setCalorieProfile, calorieProfileLoading,
        foodLog, setFoodLog, foodLogLoading,
        birthdays, setBirthdays, birthdaysLoading,
        events, setEvents, eventsLoading,
        activityLogs, setActivityLogs, activityLogsLoading,
        educationalSettings, setEducationalSettings, educationalSettingsLoading,
        subjectProgress, setSubjectProgress, subjectProgressLoading,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
