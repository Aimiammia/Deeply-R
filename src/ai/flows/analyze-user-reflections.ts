
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user reflections and providing insights.
 *
 * The flow uses an LLM to identify patterns in the user's reflections, such as mood, topics, and keywords.
 * It exports:
 * - `analyzeUserReflections`: The main function to trigger the reflection analysis flow.
 * - `AnalyzeUserReflectionsInput`: The input type for the `analyzeUserReflections` function.
 * - `AnalyzeUserReflectionsOutput`: The output type for the `analyzeUserReflections` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the reflection analysis flow
const AnalyzeUserReflectionsInputSchema = z.object({
  reflectionText: z
    .string() // Changed from array to string
    .describe('The text of the user reflection to be analyzed.'),
});
export type AnalyzeUserReflectionsInput = z.infer<typeof AnalyzeUserReflectionsInputSchema>;

// Define the output schema for the reflection analysis flow
const AnalyzeUserReflectionsOutputSchema = z.object({
  mood: z.string().describe('The overall mood expressed in the reflection.'),
  topics: z.array(z.string()).describe('The main topics discussed in the reflection.'),
  keywords: z.array(z.string()).describe('The most important keywords in the reflection.'),
  summary: z.string().describe('A short summary of the reflection.'),
});
export type AnalyzeUserReflectionsOutput = z.infer<typeof AnalyzeUserReflectionsOutputSchema>;

// Define the tool to analyze the user reflections
const analyzeReflectionsTool = ai.defineTool({
  name: 'analyzeReflections',
  description: 'Analyzes user reflections to identify mood, topics, and keywords.',
  inputSchema: AnalyzeUserReflectionsInputSchema,
  outputSchema: AnalyzeUserReflectionsOutputSchema,
},
async (input) => {
  // This can call any typescript function.
  // Ideally this calls an external service for more accurate sentiment analysis.
  const {reflectionText} = input;
  const promptResult = await reflectionAnalysisPrompt({
    reflectionText,
  });

  if (!promptResult.output) {
    throw new Error("AI model did not return a valid output from reflectionAnalysisPrompt tool.");
  }
  return promptResult.output;
});

// Define the prompt for analyzing the user reflections
const reflectionAnalysisPrompt = ai.definePrompt({
  name: 'reflectionAnalysisPrompt',
  input: {schema: AnalyzeUserReflectionsInputSchema},
  output: {schema: AnalyzeUserReflectionsOutputSchema},
  prompt: `You are an AI assistant designed to analyze user reflections and provide insights.

  Analyze the following reflection text and identify the mood, topics, and keywords.
  Also, provide a short summary of the reflection.

  Reflection Text: {{{reflectionText}}}

  mood: (The overall mood expressed in the reflection)
  topics: (A list of the main topics discussed in the reflection)
  keywords: (A list of the most important keywords in the reflection)
  summary: (A short summary of the reflection)
  `,
});

// Define the Genkit flow for analyzing user reflections
const analyzeUserReflectionsFlow = ai.defineFlow({
  name: 'analyzeUserReflectionsFlow',
  inputSchema: AnalyzeUserReflectionsInputSchema,
  outputSchema: AnalyzeUserReflectionsOutputSchema,
}, async (input) => {
  // Call the analyzeReflections tool to get the analysis results
  // IMPORTANT: We are calling the PROMPT here, not the tool directly.
  const promptResult = await reflectionAnalysisPrompt(input);
  if (!promptResult.output) {
    throw new Error("AI model did not return a valid output for reflection analysis.");
  }
  return promptResult.output;
});

/**
 * Analyzes user reflections to provide insights into their feelings and thoughts.
 * @param input The input containing the user's reflection text.
 * @returns The analysis results including mood, topics, and keywords.
 */
export async function analyzeUserReflections(input: AnalyzeUserReflectionsInput): Promise<AnalyzeUserReflectionsOutput> {
  return analyzeUserReflectionsFlow(input);
}
