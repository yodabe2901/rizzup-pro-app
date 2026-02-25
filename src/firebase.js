import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, doc, updateDoc, increment } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// use environment variables so the keys are never committed to source
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
};

// initialize only once (singleton)
let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (err) {
  console.error("[Firebase] Initialization error:", err);
  app = getApps().length ? getApp() : null;
}

// exports with safety checks
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// enable offline persistence if available
if (db) {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firestore] Persistence failed - multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firestore] Persistence is not available in this browser.');
    } else {
      console.error('[Firestore] Persistence error:', err);
    }
  });
}

// helper to atomically increment user xp in Firestore
export const syncUserXP = async (uid, amount) => {
  if (!db) return false;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { xp: increment(amount) });
    return true;
  } catch (error) {
    console.error('[Firebase] syncUserXP failed:', error);
    return false;
  }
};