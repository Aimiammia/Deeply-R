
'use server';
/**
 * @fileOverview A Genkit flow to generate an overall progress report for the user,
 * summarizing insights from various aspects of the application.
 *
 * Exports:
 * - generateOverallProgressReport: Function to trigger the report generation.
 * - GenerateOverallProgressReportInput: The input type for the function.
 * - GenerateOverallProgressReportOutput: The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Task, LongTermGoal, DailyActivityLogEntry, ReflectionEntry } from '@/types';

// Schemas based on src/types/index.ts - simplified for brevity
const TaskSchema = z.object({ title: z.string(), completed: z.boolean(), category: z.string().nullable() });
const LongTermGoalSchema = z.object({ title: z.string(), status: z.string(), description: z.string().nullable() });
const DailyActivityLogEntrySchema = z.object({ text: z.string(), date: z.string().datetime() });
const ReflectionEntrySchema = z.object({ text: z.string(), date: z.string().datetime() });
const FinancialSummarySchema = z.object({
    totalIncomeLast30Days: z.number().optional(),
    totalExpensesLast30Days: z.number().optional(),
    activeBudgetsCount: z.number().optional(),
    savingsGoalsProgress: z.number().optional().describe("Average progress percentage for savings goals"),
  }).optional();


export const GenerateOverallProgressReportInputSchema = z.object({
  tasks: z.array(TaskSchema).describe("User's tasks."),
  longTermGoals: z.array(LongTermGoalSchema).describe("User's long-term goals."),
  activityLogs: z.array(DailyActivityLogEntrySchema).describe("User's daily activity logs."),
  reflections: z.array(ReflectionEntrySchema).describe("User's reflections."),
  financialSummary: FinancialSummarySchema.describe("A summary of user's financial status."),
});
export type GenerateOverallProgressReportInput = z.infer<typeof GenerateOverallProgressReportInputSchema>;

export const GenerateOverallProgressReportOutputSchema = z.object({
  report: z.string().describe("A comprehensive, multi-paragraph report in Persian summarizing the user's overall progress, highlighting achievements, areas for improvement, and connections between different aspects of their activities (e.g., how daily tasks contribute to long-term goals, how mood might affect productivity)."),
});
export type GenerateOverallProgressReportOutput = z.infer<typeof GenerateOverallProgressReportOutputSchema>;

const overallReportPrompt = ai.definePrompt({
  name: 'overallReportPrompt',
  input: { schema: GenerateOverallProgressReportInputSchema },
  output: { schema: GenerateOverallProgressReportOutputSchema },
  prompt: `شما یک مشاور زندگی و تحلیلگر داده‌های شخصی هستید. وظیفه شما تهیه یک گزارش جامع و دوره‌ای به **زبان فارسی** از پیشرفت کلی کاربر در تمام جنبه‌های برنامه است.

با توجه به داده‌های ارائه شده (وظایف، اهداف بلندمدت، یادداشت‌های فعالیت، تأملات، و خلاصه مالی):
1.  **خلاصه دستاوردها:** به موفقیت‌های کلیدی اشاره کنید (مثلاً تکمیل اهداف مهم، پیشرفت قابل توجه در یک حوزه خاص، الگوهای مثبت در تأملات یا فعالیت‌ها).
2.  **پیشرفت به سوی اهداف بلندمدت:** ارزیابی کنید که فعالیت‌ها و وظایف روزانه چگونه به اهداف بلندمدت کمک می‌کنند. آیا همسویی وجود دارد؟
3.  **الگوهای بهره‌وری و فعالیت:** خلاصه‌ای از الگوهای بهره‌وری مشاهده شده (از تحلیل‌های دیگر یا با بررسی مستقیم داده‌ها) ارائه دهید.
4.  **بینش‌های مربوط به خلق و خو:** اگر اطلاعاتی از تأملات در دسترس است، به طور خلاصه به تأثیر احتمالی خلق و خو بر فعالیت‌ها اشاره کنید.
5.  **وضعیت مالی (در صورت وجود داده):** نگاهی کوتاه به وضعیت مالی (درآمد، هزینه، بودجه، پس‌انداز) بیندازید و ارتباط آن با سایر جنبه‌ها (مثلاً استرس مالی و تأثیر آن بر خلق و خو یا بهره‌وری) را در نظر بگیرید، اگرچه این مورد نیاز به تحلیل عمیق‌تر دارد.
6.  **حوزه‌های قابل بهبود:** با لحنی سازنده، به حوزه‌هایی که کاربر می‌تواند در آن‌ها پیشرفت بیشتری داشته باشد یا نیاز به توجه بیشتری دارد، اشاره کنید.
7.  **تصویر کلی و نتیجه‌گیری:** یک دید کلی از وضعیت کاربر ارائه دهید و با یک پیام مثبت و انگیزه‌بخش گزارش را به پایان برسانید.

گزارش باید روان، چند پاراگرافی و قابل فهم باشد.

اطلاعات کاربر:
وظایف: {{{json tasks}}}
اهداف بلندمدت: {{{json longTermGoals}}}
یادداشت‌های فعالیت: {{{json activityLogs}}}
تأملات: {{{json reflections}}}
خلاصه مالی: {{{json financialSummary}}}
`,
});

const generateOverallProgressReportFlow = ai.defineFlow(
  {
    name: 'generateOverallProgressReportFlow',
    inputSchema: GenerateOverallProgressReportInputSchema,
    outputSchema: GenerateOverallProgressReportOutputSchema,
  },
  async (input) => {
    const { output } = await overallReportPrompt(input);
    if (!output) {
      throw new Error("AI model did not return a valid overall progress report.");
    }
    return output;
  }
);

export async function generateOverallProgressReport(input: GenerateOverallProgressReportInput): Promise<GenerateOverallProgressReportOutput> {
  return generateOverallProgressReportFlow(input);
}
