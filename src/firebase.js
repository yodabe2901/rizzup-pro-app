import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9IrqHWmObU7cQlDcv8TER5rncAuoY4UA", // Ta vraie clé ici
  authDomain: "rizzup-pro-app.firebaseapp.com",
  projectId: "rizzup-pro-app",
  storageBucket: "rizzup-pro-app.appspot.com",
  messagingSenderId: "771251000103",
  appId: "1:771251000103:web:..."
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Exports des modules
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configuration optionnelle pour Google (évite certains bugs de popup)
googleProvider.setCustomParameters({ prompt: 'select_account' });