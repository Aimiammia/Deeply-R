import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import nextPlugin from '@genkit-ai/next'; // Attempting to use a default import

export const ai = genkit({
  plugins: [
    nextPlugin(), // Using the presumed default export
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
