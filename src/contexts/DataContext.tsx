
'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Task, Habit, CalendarEvent, BirthdayEntry, ReflectionEntry, DailyActivityLogEntry, FinancialTransaction, Budget, FinancialAsset, FinancialInvestment, SavingsGoal, Project, LongTermGoal, Book, SportsActivity, ActiveFast, FastingSession, KnowledgePage, ProjectTemplate, Challenge, CalorieProfile, FoodLogEntry } from '@/types';
import { useFirestore } from '@/hooks/useFirestore';

// Define the shape of our context data
interface DataContextType {
    tasks: Task[];
    setTasks: (value: Task[] | ((val: Task[]) => Task[])) => void;
    tasksLoading: boolean;

    habits: Habit[];
    setHabits: (value: Habit[] | ((val: Habit[]) => Habit[])) => void;
    habitsLoading: boolean;

    events: CalendarEvent[];
    setEvents: (value: CalendarEvent[] | ((val: CalendarEvent[]) => CalendarEvent[])) => void;
    eventsLoading: boolean;

    birthdays: BirthdayEntry[];
    setBirthdays: (value: BirthdayEntry[] | ((val: BirthdayEntry[]) => BirthdayEntry[])) => void;
    birthdaysLoading: boolean;
    
    reflections: ReflectionEntry[];
    setReflections: (value: ReflectionEntry[] | ((val: ReflectionEntry[]) => ReflectionEntry[])) => void;
    reflectionsLoading: boolean;

    logs: DailyActivityLogEntry[];
    setLogs: (value: DailyActivityLogEntry[] | ((val: DailyActivityLogEntry[]) => DailyActivityLogEntry[])) => void;
    logsLoading: boolean;

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
    
    projects: Project[];
    setProjects: (value: Project[] | ((val: Project[]) => Project[])) => void;
    projectsLoading: boolean;
    
    longTermGoals: LongTermGoal[];
    setLongTermGoals: (value: LongTermGoal[] | ((val: LongTermGoal[]) => LongTermGoal[])) => void;
    longTermGoalsLoading: boolean;
    
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks, tasksLoading] = useFirestore<Task[]>('dailyTasksPlanner', []);
    const [habits, setHabits, habitsLoading] = useFirestore<Habit[]>('userHabitsDeeply', []);
    const [events, setEvents, eventsLoading] = useFirestore<CalendarEvent[]>('calendarEventsDeeply', []);
    const [birthdays, setBirthdays, birthdaysLoading] = useFirestore<BirthdayEntry[]>('calendarBirthdaysDeeply', []);
    const [reflections, setReflections, reflectionsLoading] = useFirestore<ReflectionEntry[]>('dailyReflections', []);
    const [logs, setLogs, logsLoading] = useFirestore<DailyActivityLogEntry[]>('dailyActivityLogsDeeply', []);
    const [transactions, setTransactions, transactionsLoading] = useFirestore<FinancialTransaction[]>('financialTransactions', []);
    const [budgets, setBudgets, budgetsLoading] = useFirestore<Budget[]>('financialBudgets', []);
    const [assets, setAssets, assetsLoading] = useFirestore<FinancialAsset[]>('financialAssets', []);
    const [investments, setInvestments, investmentsLoading] = useFirestore<FinancialInvestment[]>('financialInvestments', []);
    const [savingsGoals, setSavingsGoals, savingsGoalsLoading] = useFirestore<SavingsGoal[]>('financialSavingsGoals', []);
    const [projects, setProjects, projectsLoading] = useFirestore<Project[]>('allProjects', []);
    const [longTermGoals, setLongTermGoals, longTermGoalsLoading] = useFirestore<LongTermGoal[]>('longTermGoals', []);
    const [books, setBooks, booksLoading] = useFirestore<Book[]>('userBooksDeeply', []);
    const [activities, setActivities, activitiesLoading] = useFirestore<SportsActivity[]>('sportsActivitiesDeeply', []);
    const [activeFast, setActiveFast, activeFastLoading] = useFirestore<ActiveFast | null>('activeFastDeeply', null);
    const [fastingSessions, setFastingSessions, fastingSessionsLoading] = useFirestore<FastingSession[]>('fastingSessionsDeeply', []);
    const [knowledgePages, setKnowledgePages, knowledgePagesLoading] = useFirestore<KnowledgePage[]>('knowledgeBasePages', []);
    const [projectTemplates, setProjectTemplates, projectTemplatesLoading] = useFirestore<ProjectTemplate[]>('projectTemplates', []);
    const [challenges, setChallenges, challengesLoading] = useFirestore<Challenge[]>('thirtyDayChallenges', []);
    const [calorieProfile, setCalorieProfile, calorieProfileLoading] = useFirestore<CalorieProfile | null>('calorieProfileDeeply', null);
    const [foodLog, setFoodLog, foodLogLoading] = useFirestore<FoodLogEntry[]>('foodLogDeeply', []);


    const value = {
        tasks, setTasks, tasksLoading,
        habits, setHabits, habitsLoading,
        events, setEvents, eventsLoading,
        birthdays, setBirthdays, birthdaysLoading,
        reflections, setReflections, reflectionsLoading,
        logs, setLogs, logsLoading,
        transactions, setTransactions, transactionsLoading,
        budgets, setBudgets, budgetsLoading,
        assets, setAssets, assetsLoading,
        investments, setInvestments, investmentsLoading,
        savingsGoals, setSavingsGoals, savingsGoalsLoading,
        projects, setProjects, projectsLoading,
        longTermGoals, setLongTermGoals, longTermGoalsLoading,
        books, setBooks, booksLoading,
        activities, setActivities, activitiesLoading,
        activeFast, setActiveFast, activeFastLoading,
        fastingSessions, setFastingSessions, fastingSessionsLoading,
        knowledgePages, setKnowledgePages, knowledgePagesLoading,
        projectTemplates, setProjectTemplates, projectTemplatesLoading,
        challenges, setChallenges, challengesLoading,
        calorieProfile, setCalorieProfile, calorieProfileLoading,
        foodLog, setFoodLog, foodLogLoading,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
