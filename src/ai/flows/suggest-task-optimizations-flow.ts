
'use server';
/**
 * @fileOverview A Genkit flow to suggest task optimizations for better alignment with long-term goals.
 *
 * Exports:
 * - suggestTaskOptimizations: Function to trigger task optimization suggestions.
 * - SuggestTaskOptimizationsInput: The input type for the function.
 * - SuggestTaskOptimizationsOutput: The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Task, LongTermGoal } from '@/types';

// Schemas based on src/types/index.ts - simplified
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  // Include other relevant fields like dueDate, priority if needed for suggestions
  category: z.string().nullable(),
  description: z.string().nullable().optional(), // Assuming tasks might have descriptions
}).describe("Represents a single task item.");

const LongTermGoalSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.string(), // e.g., 'in-progress'
}).describe("Represents a long-term goal.");

export const SuggestTaskOptimizationsInputSchema = z.object({
  tasks: z.array(TaskSchema).describe("List of the user's current tasks, including completed and uncompleted."),
  longTermGoals: z.array(LongTermGoalSchema).describe("List of the user's long-term goals."),
});
export type SuggestTaskOptimizationsInput = z.infer<typeof SuggestTaskOptimizationsInputSchema>;

export const SuggestTaskOptimizationsOutputSchema = z.object({
  suggestions: z.string().describe("Actionable suggestions in Persian for optimizing daily tasks to better achieve long-term goals. This may include breaking down large tasks, prioritizing tasks aligned with goals, or rephrasing tasks for clarity."),
});
export type SuggestTaskOptimizationsOutput = z.infer<typeof SuggestTaskOptimizationsOutputSchema>;

const taskOptimizationPrompt = ai.definePrompt({
  name: 'taskOptimizationPrompt',
  input: { schema: SuggestTaskOptimizationsInputSchema },
  output: { schema: SuggestTaskOptimizationsOutputSchema },
  prompt: `شما یک مربی برنامه‌ریزی و دستیار هوش مصنوعی هستید. وظیفه شما ارائه پیشنهاداتی به **زبان فارسی** برای تنظیم بهتر وظایف روزانه کاربر جهت دستیابی موثرتر به اهداف بلندمدتشان است.

با توجه به لیست وظایف (انجام شده و نشده) و اهداف بلندمدت کاربر:
1.  **همسوسازی با اهداف:** آیا وظایفی وجود دارند که مستقیماً به اهداف بلندمدت کمک نمی‌کنند یا می‌توانند بهتر با آن‌ها همسو شوند؟ پیشنهاداتی برای همسوسازی ارائه دهید.
2.  **تقسیم وظایف بزرگ:** اگر وظایف بزرگی وجود دارند که به نظر می‌رسد پیشرفت در آن‌ها کند است یا شروع آن‌ها دشوار است، پیشنهاد دهید که به مراحل کوچکتر و قابل مدیریت‌تر تقسیم شوند.
3.  **اولویت‌بندی:** آیا وظایف مهم مرتبط با اهداف، اولویت کافی دارند؟ (توجه: داده اولویت ممکن است مستقیماً در ورودی نباشد، اما می‌توانید بر اساس اهمیت هدف و ارتباط وظیفه با آن، اهمیت نسبی را استنباط کنید).
4.  **شفاف‌سازی وظایف:** اگر عناوین یا توضیحات وظایف مبهم هستند، پیشنهاد دهید که شفاف‌تر و عملیاتی‌تر شوند. (مثال: به جای "کار روی پروژه"، "نوشتن بخش مقدمه گزارش پروژه X").
5.  **حذف یا تعویق وظایf غیرضروری:** اگر وظایفی وجود دارند که اهمیت کمی دارند و مانع تمرکز بر اهداف اصلی می‌شوند، با احتیاط پیشنهاد حذف یا تعویق آن‌ها را بدهید.

لحن شما باید حمایتی، سازنده و عملی باشد.

وظایف کاربر:
{{{json tasks}}}

اهداف بلندمدت کاربر:
{{{json longTermGoals}}}
`,
});

const suggestTaskOptimizationsFlow = ai.defineFlow(
  {
    name: 'suggestTaskOptimizationsFlow',
    inputSchema: SuggestTaskOptimizationsInputSchema,
    outputSchema: SuggestTaskOptimizationsOutputSchema,
  },
  async (input) => {
    const { output } = await taskOptimizationPrompt(input);
    if (!output) {
      throw new Error("AI model did not return valid suggestions for task optimization.");
    }
    return output;
  }
);

export async function suggestTaskOptimizations(input: SuggestTaskOptimizationsInput): Promise<SuggestTaskOptimizationsOutput> {
  return suggestTaskOptimizationsFlow(input);
}
