// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace the following with your actual Firebase project configuration.
// It is highly recommended to use environment variables for this.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// To set this up:
// 1. Create a file named ".env.local" in the root of your project.
// 2. Add your Firebase config values to it like this:
//
//    NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
//    NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
//
// 3. Make sure you have enabled Email/Password sign-in in the Firebase Authentication console.
// 4. Make sure you have created a Firestore database in your Firebase project.


let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase only if all the required environment variables are set.
const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain;

if (isConfigured) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (e) {
        console.error("Error initializing Firebase:", e);
        // If initialization fails, keep app, auth, and db as null
        app = null;
        auth = null;
        db = null;
    }
} else {
    console.warn(
      "Firebase config is missing or incomplete. Firebase services will be disabled. " +
      "Please make sure all NEXT_PUBLIC_FIREBASE_* variables are set in your .env.local file."
    );
}

export { app, auth, db, isConfigured as isFirebaseConfigured };