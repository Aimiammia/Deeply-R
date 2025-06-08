
'use server';
/**
 * @fileOverview A Genkit flow to assess user's progress towards their long-term goals
 * based on their tasks and daily activity logs.
 *
 * Exports:
 * - assessGoalProgress: Function to trigger the goal progress assessment.
 * - AssessGoalProgressInput: The input type for the assessGoalProgress function.
 * - AssessGoalProgressOutput: The return type for the assessGoalProgress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas based on src/types/index.ts
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string().describe("ISO date string of task creation"),
  dueDate: z.string().datetime().nullable().describe("Optional ISO date string for task due date"),
  priority: z.enum(['low', 'medium', 'high']).nullable().describe("Optional task priority"),
  category: z.string().nullable().describe("Optional task category"),
  subjectId: z.string().nullable().optional().describe("Optional subject ID for educational tasks"),
  subjectName: z.string().nullable().optional().describe("Optional subject name for educational tasks"),
  startChapter: z.number().nullable().optional().describe("Optional start chapter for educational tasks"),
  endChapter: z.number().nullable().optional().describe("Optional end chapter for educational tasks"),
  educationalLevelContext: z.string().nullable().optional().describe("Optional educational level context at time of task creation"),
}).describe("Represents a single task item.");

const LongTermGoalSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().describe("Optional description for the goal"),
  targetDate: z.string().datetime().nullable().describe("Optional ISO date string for goal target date"),
  status: z.enum(['not-started', 'in-progress', 'completed', 'on-hold']).describe("Current status of the goal"),
  createdAt: z.string().datetime().describe("ISO date string of goal creation"),
}).describe("Represents a long-term goal.");

const DailyActivityLogEntrySchema = z.object({
  id: z.string(),
  date: z.string().datetime().describe("ISO date string of when the log entry was saved"),
  text: z.string(),
}).describe("Represents a single daily activity log entry.");


export const AssessGoalProgressInputSchema = z.object({
  longTermGoals: z.array(LongTermGoalSchema).describe("List of the user's long-term goals."),
  tasks: z.array(TaskSchema).describe("List of the user's tasks (daily/short-term)."),
  activityLogs: z.array(DailyActivityLogEntrySchema).describe("List of the user's daily activity logs."),
});
export type AssessGoalProgressInput = z.infer<typeof AssessGoalProgressInputSchema>;

export const AssessGoalProgressOutputSchema = z.object({
  assessment: z.string().describe("A comprehensive assessment in Persian of the user's progress towards their long-term goals, considering their tasks and daily activities. This should include positive aspects, areas for improvement, and actionable insights."),
});
export type AssessGoalProgressOutput = z.infer<typeof AssessGoalProgressOutputSchema>;

const assessGoalProgressPrompt = ai.definePrompt({
  name: 'assessGoalProgressPrompt',
  input: { schema: AssessGoalProgressInputSchema },
  output: { schema: AssessGoalProgressOutputSchema },
  prompt: `شما یک دستیار هوش مصنوعی متخصص هستید که به کاربران کمک می‌کنید تا پیشرفت خود را در جهت اهداف بلندمدتشان ارزیابی کنند.
اطلاعاتی شامل اهداف بلندمدت کاربر، وظایف روزانه/کوتاه‌مدت آن‌ها و یادداشت‌های فعالیت روزانه‌شان در اختیار شما قرار گرفته است.

وظیفه شما تحلیل این اطلاعات و ارائه یک ارزیابی جامع و کاربردی به **زبان فارسی** است.

در تحلیل خود به موارد زیر توجه کنید:
1.  **همسویی وظایف و فعالیت‌ها با اهداف بلندمدت:** آیا وظایف روزانه و فعالیت‌های ثبت‌شده کاربر در راستای اهداف بلندمدت او هستند؟ به وظایفی که مستقیماً به یک هدف کمک می‌کنند اشاره کنید. اگر بسیاری از وظایف یا فعالیت‌ها نامرتبط به نظر می‌رسند، آن را ذکر کنید.
2.  **پیشرفت در اهداف:**
    *   برای اهداف "در حال انجام" (in-progress)، آیا وظایف تکمیل‌شده‌ای وجود دارد که آن‌ها را به جلو ببرد؟
    *   آیا مهلت انجام وظایف مرتبط با اهداف رعایت می‌شود؟
    *   آیا یادداشت‌های فعالیت روزانه نشان‌دهنده تلاش در جهت این اهداف هستند؟
3.  **موانع یا چالش‌های احتمالی:**
    *   آیا تعداد زیادی وظیفه معوق (دارای تاریخ سررسید گذشته و تکمیل‌نشده)، به‌خصوص مرتبط با اهداف، وجود دارد؟
    *   آیا یادداشت‌های فعالیت روزانه نشان‌دهنده فعالیت‌هایی است که ممکن است مانع پیشرفت هدف شوند (مثلا اتلاف وقت زیاد)؟
    *   آیا اهدافی با وضعیت "متوقف شده" (on-hold) وجود دارد؟ در صورت وجود، به آن اشاره کنید.
4.  **نقاط قوت و پیشنهادها:**
    *   به جنبه‌هایی که کاربر در آن‌ها عملکرد خوبی دارد، اشاره کنید (مثلا تکمیل منظم وظایف مرتبط با یک هدف خاص).
    *   اگر پیشرفت کند است یا همسویی وجود ندارد، پیشنهادهای سازنده و ملایمی ارائه دهید. (مثال: "به نظر می‌رسد وظایف اخیر کمتر با هدف 'X' همسو بوده‌اند. شاید برنامه‌ریزی چند فعالیت کوچک مرتبط با این هدف در هفته آینده مفید باشد.")
    *   لحن شما باید حمایتی و انگیزه‌بخش باشد، نه قضاوتی.

**نحوه ارائه خروجی:**
ارزیابی خود را به صورت یک متن روان و قابل فهم (چند پاراگراف) در فیلد 'assessment' ارائه دهید.

اهداف بلند مدت کاربر:
{{{json longTermGoals}}}

وظایf کاربر:
{{{json tasks}}}

یادداشت‌های فعالیت روزانه کاربر:
{{{json activityLogs}}}
`,
});

const assessGoalProgressFlow = ai.defineFlow(
  {
    name: 'assessGoalProgressFlow',
    inputSchema: AssessGoalProgressInputSchema,
    outputSchema: AssessGoalProgressOutputSchema,
  },
  async (input) => {
    const { output } = await assessGoalProgressPrompt(input);
    return output!;
  }
);

export async function assessGoalProgress(input: AssessGoalProgressInput): Promise<AssessGoalProgressOutput> {
  return assessGoalProgressFlow(input);
}
