
'use server';
/**
 * @fileOverview A Genkit flow to analyze the correlation between user's mood (from reflections)
 * and their task progress.
 *
 * Exports:
 * - analyzeMoodTaskCorrelation: Function to trigger the mood-task correlation analysis.
 * - AnalyzeMoodTaskCorrelationInput: The input type for the function.
 * - AnalyzeMoodTaskCorrelationOutput: The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ReflectionEntry, Task } from '@/types';

// Schemas based on src/types/index.ts
const ReflectionEntrySchema = z.object({
  id: z.string(),
  date: z.string().datetime().describe("ISO date string of when the reflection was saved"),
  text: z.string().describe("The user's reflection text."),
}).describe("Represents a single reflection entry.");

const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.string().datetime().describe("ISO date string of task creation"),
  // dueDate might be relevant if we check tasks completed *on time* vs mood.
  // For now, focusing on completion status.
}).describe("Represents a single task item.");

export const AnalyzeMoodTaskCorrelationInputSchema = z.object({
  reflections: z.array(ReflectionEntrySchema).describe("List of the user's recent reflections."),
  tasks: z.array(TaskSchema).describe("List of user's tasks, ideally from a similar period as reflections."),
});
export type AnalyzeMoodTaskCorrelationInput = z.infer<typeof AnalyzeMoodTaskCorrelationInputSchema>;

export const AnalyzeMoodTaskCorrelationOutputSchema = z.object({
  analysis: z.string().describe("A textual analysis in Persian on the correlation between the user's inferred mood from reflections and their task completion patterns. It should highlight if positive/negative moods correlate with higher/lower productivity and offer insights."),
});
export type AnalyzeMoodTaskCorrelationOutput = z.infer<typeof AnalyzeMoodTaskCorrelationOutputSchema>;

const moodTaskCorrelationPrompt = ai.definePrompt({
  name: 'moodTaskCorrelationPrompt',
  input: { schema: AnalyzeMoodTaskCorrelationInputSchema },
  output: { schema: AnalyzeMoodTaskCorrelationOutputSchema },
  prompt: `شما یک روانشناس و تحلیلگر رفتار هستید. وظیفه شما تحلیل تأملات روزانه کاربر برای استنباط خلق و خوی آن‌ها و سپس بررسی ارتباط آن با الگوهای تکمیل وظایفشان به **زبان فارسی** است.

با توجه به تأملات و لیست وظایف کاربر:
1.  **استنباط خلق و خو:** از متن هر تأمل، سعی کنید خلق و خوی کلی کاربر در آن زمان (مثبت، منفی، خنثی، مضطرب، پرانرژی و غیره) را استنباط کنید.
2.  **الگوهای تکمیل وظایف:** بررسی کنید آیا در روزهایی که خلق و خوی خاصی (مثلاً مثبت) از تأملات استنباط می‌شود، تعداد وظایف تکمیل شده بیشتر یا کمتر است. آیا کیفیت یا نوع وظایف تکمیل شده نیز تحت تأثیر قرار می‌گیرد؟
3.  **شناسایی ارتباط:** آیا ارتباط معناداری بین خلق و خوی استنباط شده و بهره‌وری در انجام وظایف مشاهده می‌شود؟ به عنوان مثال، آیا کاربر در روزهایی که احساس بهتری دارد، وظایف بیشتری انجام می‌دهد یا وظایف سخت‌تری را به اتمام می‌رساند؟
4.  **ارائه بینش و پیشنهادات:** بینش‌های کلیدی حاصل از این تحلیل را بیان کنید. اگر ارتباطی وجود دارد، پیشنهاداتی برای کاربر ارائه دهید تا از این آگاهی برای برنامه‌ریزی بهتر وظایف خود استفاده کند (مثلاً انجام وظایف خلاقانه در زمان‌های با خلق و خوی مثبت).

لحن شما باید همدلانه، علمی و مفید باشد.

تأملات کاربر:
{{{json reflections}}}

وظایf کاربر (از دوره مشابه تأملات):
{{{json tasks}}}
`,
});

const analyzeMoodTaskCorrelationFlow = ai.defineFlow(
  {
    name: 'analyzeMoodTaskCorrelationFlow',
    inputSchema: AnalyzeMoodTaskCorrelationInputSchema,
    outputSchema: AnalyzeMoodTaskCorrelationOutputSchema,
  },
  async (input) => {
    const { output } = await moodTaskCorrelationPrompt(input);
    if (!output) {
      throw new Error("AI model did not return a valid output for mood-task correlation analysis.");
    }
    return output;
  }
);

export async function analyzeMoodTaskCorrelation(input: AnalyzeMoodTaskCorrelationInput): Promise<AnalyzeMoodTaskCorrelationOutput> {
  return analyzeMoodTaskCorrelationFlow(input);
}
