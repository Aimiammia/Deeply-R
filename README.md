# Firebase Studio - Deeply App

This is a Next.js application for "Deeply", a personal organization and reflection app, built in Firebase Studio.

This version uses **Firebase Authentication** for user accounts and **Cloud Firestore** for real-time data synchronization across devices.

## Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js**: **Version 18.x or later is strongly recommended.** You can download it from [https://nodejs.org/](https://nodejs.org/).
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

3.  **Set Up Environment Variables (`.env.local`):**
    *   This application requires a Firebase project to handle user authentication and cloud data storage.
    *   Create a new file named `.env.local` in the root directory of the project (next to `package.json`).
    *   **Copy the contents of the `.env` file** into your new `.env.local` file.
    *   **Fill in the values** for your Firebase project. You can find these values in your Firebase project settings under "General" -> "Your apps" -> "SDK setup and configuration".
        ```env
        # .env.local
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY_HERE
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN_HERE
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET_HERE
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID_HERE
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID_HERE

        # You can optionally add a Google AI API key for Genkit features
        GOOGLE_API_KEY=
        ```
    *   **Important:** Without these Firebase credentials, user login, registration, and data synchronization will **not** work.

4.  **Set Up Firebase:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a new project (or use an existing one).
    *   In the project dashboard, go to **Authentication** (in the Build menu). Click "Get started" and enable the **Email/Password** sign-in provider.
    *   Go to **Cloud Firestore** (in the Build menu). Click "Create database", start in **production mode**, and choose a location.
    *   In the Firestore data view, go to the **Rules** tab and paste the following rules. This ensures that users can only read and write their own data. Click **Publish**.
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Users can only read/write their own data, stored under /users/{userId}
            match /users/{userId}/{document=**} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```

5.  **Run the Next.js Development Server:**
    To start the application, run the following command in your terminal:
    ```bash
    npm run dev
    ```
    This will start the Next.js development server, typically on `http://localhost:9002`. Open this URL in your browser to see the application. You should be redirected to the login page.

## Available Scripts

In the `package.json`, you'll find several scripts:

*   `npm run dev`: Starts the Next.js application in development mode.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts a Next.js production server (after running `build`).
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run typecheck`: Runs TypeScript compiler to check for type errors.
