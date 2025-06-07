import type { AnalyzeUserReflectionsOutput } from '@/ai/flows/analyze-user-reflections';

export interface ReflectionEntry {
  id: string;
  date: string; // ISO string
  prompt: string;
  text: string;
  insights?: AnalyzeUserReflectionsOutput;
}
