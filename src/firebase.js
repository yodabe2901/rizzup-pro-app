import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVLGCKKMDxOX9ooSYlEjVFCUpfXjSTAqQ",
  authDomain: "rizzup-cfbf6.firebaseapp.com",
  projectId: "rizzup-cfbf6",
  storageBucket: "rizzup-cfbf6.firebasestorage.app",
  messagingSenderId: "876645582428",
  appId: "1:876645582428:web:b05470ed91387b2ddc0899",
  measurementId: "G-P1BP4N0S8H"
};

// Initialisation
const app = initializeApp(firebaseConfig);

// Exports pour ton application
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');