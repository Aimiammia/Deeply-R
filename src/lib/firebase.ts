
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Function to check if all necessary Firebase config values are present
function checkFirebaseConfig(config: typeof firebaseConfig): boolean {
  return Object.values(config).every(value => value && typeof value === 'string' && value.trim() !== '');
}

export const isFirebaseConfigured = checkFirebaseConfig(firebaseConfig);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isFirebaseConfigured) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // Provide null objects if Firebase is not configured to avoid app crashes
    console.warn("Firebase is not configured. Cloud features will be disabled. Please check your .env.local file.");
    app = null as any; // Using any to satisfy type checker in unconfigured state
    auth = null as any;
    db = null as any;
}


export { app, auth, db };
