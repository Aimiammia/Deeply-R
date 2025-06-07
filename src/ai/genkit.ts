import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {nextPlugin} from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    nextPlugin(), // Initialize Next.js plugin first
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
