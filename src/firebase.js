import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET_ID",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
