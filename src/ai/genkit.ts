
import { config } from 'dotenv'; // Import dotenv
config(); // Load .env file variables at the very start

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import nextPlugin from '@genkit-ai/next';

// Check for Google AI API Key
const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
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
    nextPlugin(),
    googleAI({ apiKey: apiKey }), // Explicitly pass the API key
  ],
  model: 'googleai/gemini-2.0-flash',
});

