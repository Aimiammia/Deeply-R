
import { config } from 'dotenv'; // Import dotenv
config(); // Load .env file variables at the very start

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import nextPlugin from '@genkit-ai/next'; // Reverted to default import

// Check for Google AI API Key
if (!process.env.GOOGLE_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.warn(`
    ****************************************************************************************
    * WARNING: Google AI API Key is not set.                                               *
    * Please set GOOGLE_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your .env file.         *
    * AI-powered features (like reflection insights) will not work correctly without it    *
    * and may cause "Failed to fetch" errors on the client.                                *
    ****************************************************************************************
  `);
}

export const ai = genkit({
  plugins: [
    nextPlugin(), // Using the default export
    googleAI(),
  ],
  model: 'googleai/gemini-2.0-flash',
});
