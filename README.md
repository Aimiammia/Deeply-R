# Firebase Studio - Deeply App

This is a NextJS starter application for "Deeply", a personal organization and reflection app, built in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js**: **Version 18.x or later is strongly recommended.** You can download it from [https://nodejs.org/](https://nodejs.org/). The application uses `crypto.randomUUID()` which is generally available in Node.js v16.7.0+ and modern browsers, but v18+ ensures better compatibility with the overall Next.js ecosystem.
*   **npm** (comes with Node.js) or **Yarn** (optional).

## Getting Started Locally

Follow these steps to run the application on your local machine:

1.  **Clone the Repository / Download Files:**
    Ensure you have all the project files in a local directory.

2.  **Install Dependencies:**
    Open your terminal, navigate to the project's root directory, and run:
    ```bash
    npm install
    ```
    Or, if you prefer Yarn:
    ```bash
    yarn install
    ```
    This command will install all the necessary packages defined in `package.json`.

3.  **Set Up Environment Variables:**
    *   Create a new file named `.env.local` in the root directory of the project (next to `package.json`).
    *   The application uses Genkit for AI features, which requires a Google AI API key. Add your API key to the `.env.local` file:
        ```env
        # .env.local
        GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY_HERE
        ```
        Replace `YOUR_GOOGLE_AI_API_KEY_HERE` with your actual Google AI API key. If you don't have one, AI-powered features may not work correctly or might cause errors. You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Note:** The `.env.local` file is ignored by Git (if you are using version control) and should not be committed. If you don't provide an API key, the application will still run, but AI-related features will likely fail or produce warnings.

4.  **Run the Next.js Development Server:**
    To start the main application, run the following command in your terminal:
    ```bash
    npm run dev
    ```
    Or, with Yarn:
    ```bash
    yarn dev
    ```
    This will start the Next.js development server, typically on `http://localhost:9002` (as configured in `package.json`). Open this URL in your browser to see the application.

5.  **Run the Genkit Development Server (Optional, for AI development/testing):**
    If you intend to work on or test the Genkit AI flows independently, you'll need to run the Genkit development server.
    *   Open a **new terminal window/tab**.
    *   Navigate to the project's root directory.
    *   Run:
        ```bash
        npm run genkit:dev
        ```
        Or, for automatic reloading when AI flow files change:
        ```bash
        npm run genkit:watch
        ```
    *   The Genkit development server usually starts on `http://localhost:4000`, and its developer UI can be accessed at `http://localhost:4000/flows`.

## Available Scripts

In the `package.json`, you'll find several scripts:

*   `npm run dev`: Starts the Next.js application in development mode.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server in watch mode.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts a Next.js production server (after running `build`).
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run typecheck`: Runs TypeScript compiler to check for type errors.

Now you should be all set to run and develop the application locally! If you encounter issues, ensure your Node.js version is up to date (18.x or later) and that you have correctly set up the `.env.local` file if you're using AI features.
