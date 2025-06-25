
import { config } from 'dotenv'; // Import dotenv
config(); // Load .env file variables at the very start

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import nextPlugin from '@genkit-ai/next';

// This configuration now uses the Google AI plugin.
// Ensure you have a GOOGLE_API_KEY in your .env.local file.
// If the key is not provided, Genkit flows will likely fail.
export const ai = genkit({
  plugins: [
    googleAI(),
    nextPlugin()
  ],
  // We recommend using a model that supports function calling, like Gemini.
  // The specific model can be configured in each flow or prompt.
  // Example: model: 'googleai/gemini-1.5-flash-latest'
});
