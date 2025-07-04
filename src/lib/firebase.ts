
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
