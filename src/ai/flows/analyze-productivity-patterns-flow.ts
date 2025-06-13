
'use server';
/**
 * @fileOverview A Genkit flow to analyze user's productivity patterns
 * based on their tasks and daily activity logs.
 *
 * Exports:
 * - analyzeProductivityPatterns: Function to trigger the productivity analysis.
 * - AnalyzeProductivityPatternsInput: The input type for the function.
 * - AnalyzeProductivityPatternsOutput: The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Task, DailyActivityLogEntry } from '@/types';

// Schemas based on src/types/index.ts - simplified for this flow
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string().datetime().describe("ISO date string of task creation"),
  // dueDate is optional, and completion date isn't stored directly with task for now
}).describe("Represents a single task item relevant for productivity.");

const DailyActivityLogEntrySchema = z.object({
  id: z.string(),
  date: z.string().datetime().describe("ISO date string of when the log entry was saved"),
  text: z.string(),
}).describe("Represents a single daily activity log entry.");

const AnalyzeProductivityPatternsInputSchema = z.object({
  tasks: z.array(TaskSchema).describe("List of the user's tasks."),
  activityLogs: z.array(DailyActivityLogEntrySchema).describe("List of the user's daily activity logs."),
});
export type AnalyzeProductivityPatternsInput = z.infer<typeof AnalyzeProductivityPatternsInputSchema>;

const AnalyzeProductivityPatternsOutputSchema = z.object({
  analysis: z.string().describe("A textual analysis in Persian of the user's productivity patterns, identifying peak times, common activities leading to task completion, and potential distractions or unproductive periods based on task completion and activity logs."),
});
export type AnalyzeProductivityPatternsOutput = z.infer<typeof AnalyzeProductivityPatternsOutputSchema>;

const productivityAnalysisPrompt = ai.definePrompt({
  name: 'productivityAnalysisPrompt',
  input: { schema: AnalyzeProductivityPatternsInputSchema },
  output: { schema: AnalyzeProductivityPatternsOutputSchema },
  prompt: `شما یک تحلیلگر بهره‌وری شخصی هستید. وظیفه شما تحلیل وظایف تکمیل شده و یادداشت‌های فعالیت روزانه کاربر برای شناسایی الگوهای بهره‌وری به **زبان فارسی** است.

به موارد زیر توجه کنید:
1.  **زمان‌های اوج بهره‌وری:** آیا زمان‌های خاصی از روز یا روزهای خاصی از هفته وجود دارد که کاربر وظایف بیشتری را تکمیل می‌کند یا فعالیت‌های متمرکزتری دارد؟
2.  **فعالیت‌های مرتبط با تکمیل وظایف:** آیا یادداشت‌های فعالیت روزانه نشان‌دهنده فعالیت‌های خاصی هستند که معمولاً قبل یا همزمان با تکمیل وظایف رخ می‌دهند؟ (مثلا: "مطالعه عمیق"، "برنامه‌ریزی جلسه")
3.  **عوامل حواس‌پرتی یا دوره‌های کم‌بازده احتمالی:** آیا الگوهایی در یادداشت‌های فعالیت یا وظایف تکمیل‌نشده وجود دارد که به دوره‌های کم‌بازده یا عوامل حواس‌پرتی اشاره کند؟ (مثلا: "گشت و گذار زیاد در شبکه‌های اجتماعی"، "عدم تمرکز بعد از ظهر")
4.  **پیشنهادات کلی:** بر اساس الگوهای مشاهده شده، یک یا دو پیشنهاد کلی برای بهبود بهره‌وری ارائه دهید.

لحن شما باید سازنده و مفید باشد.

وظایف کاربر:
{{{json tasks}}}

یادداشت‌های فعالیت روزانه کاربر:
{{{json activityLogs}}}
`,
});

const analyzeProductivityPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeProductivityPatternsFlow',
    inputSchema: AnalyzeProductivityPatternsInputSchema,
    outputSchema: AnalyzeProductivityPatternsOutputSchema,
  },
  async (input) => {
    const { output } = await productivityAnalysisPrompt(input);
    if (!output) {
      throw new Error("AI model did not return a valid output for productivity analysis.");
    }
    return output;
  }
);

export async function analyzeProductivityPatterns(input: AnalyzeProductivityPatternsInput): Promise<AnalyzeProductivityPatternsOutput> {
  return analyzeProductivityPatternsFlow(input);
}
