
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { nextPlugin } from '@genkit-ai/next'; // Corrected to named import

export const ai = genkit({
  plugins: [
    nextPlugin(), // Now using the correctly imported named export
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});

