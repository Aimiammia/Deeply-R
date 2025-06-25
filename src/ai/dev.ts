

// This file is used to configure Genkit for development.
// It is not needed for production builds.

import { config } from 'dotenv';
config();

// Import your Genkit flows here
import '@/ai/flows/analyze-user-reflections.ts';
import '@/ai/flows/assess-goal-progress-flow.ts';
import '@/ai/flows/analyze-productivity-patterns-flow.ts';
import '@/ai/flows/suggest-task-optimizations-flow.ts';
import '@/ai/flows/analyze-mood-task-correlation-flow.ts';
import '@/ai/flows/generate-overall-progress-report-flow.ts';
