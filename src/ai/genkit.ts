
import { config } from 'dotenv'; // Import dotenv
config(); // Load .env file variables at the very start

import { genkit, type Plugin } from 'genkit'; // Import Plugin type for explicit typing
// import { googleAI } from '@genkit-ai/googleai'; // Google AI plugin removed
import nextPlugin from '@genkit-ai/next';

// Check for Google AI API Key
// const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY; // API Key check removed

const plugins: Plugin<any>[] = []; // Explicitly type the array

// Always add nextPlugin for Next.js integration
plugins.push(nextPlugin());

// Google AI plugin loading logic removed
// if (apiKey) {
//   plugins.push(googleAI({ apiKey: apiKey }));
//   console.log('Google AI plugin initialized with API key.');
// } else {
//   console.warn(`
//     ****************************************************************************************
//     * WARNING: Google AI API Key is not set.                                               *
//     * Please set GOOGLE_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in your .env file.         *
//     * The Google AI plugin WILL NOT be initialized.                                        *
//     * AI-powered features requiring Google models (like reflection insights) will not work *
//     * and may cause errors if flows attempt to use them without the plugin.                *
//     ****************************************************************************************
//   `);
// }
console.warn(`
    ****************************************************************************************
    * INFO: Google AI plugin has been removed from Genkit configuration.                   *
    * All AI features relying on Google models will not function until a                   *
    * Genkit-compatible AI provider plugin (e.g., for DeepSeek or another service)         *
    * is configured.                                                                       *
    ****************************************************************************************
  `);


export const ai = genkit({
  plugins: plugins,
  // Removed global default model. Models should be specified in flows or prompts if needed,
  // or resolved by available plugins.
});

