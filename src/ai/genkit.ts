
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import nextPlugin from '@genkit-ai/next'; // Reverted to default import

export const ai = genkit({
  plugins: [
    nextPlugin(), // Using the default export
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
