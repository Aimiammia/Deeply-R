
import { config } from 'dotenv'; // Import dotenv
config(); // Load .env file variables at the very start

import { genkit } from 'genkit';
import nextPlugin from '@genkit-ai/next';

// The console.warn below informs that Google AI is not configured,
// and another provider (like DeepSeek via a compatible plugin) would be needed for AI features.
console.warn(`
    ****************************************************************************************
    * INFO: Google AI plugin has been removed from Genkit configuration.                   *
    * All AI features relying on Google models will not function until a                   *
    * Genkit-compatible AI provider plugin (e.g., for DeepSeek or another service)         *
    * is configured.                                                                       *
    ****************************************************************************************
  `);

export const ai = genkit({
  plugins: [nextPlugin()], // Initialize with only nextPlugin
  // Global default model has been removed. Models should be specified in flows/prompts.
});
