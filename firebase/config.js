import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Resolve env vars from Expo config or process.env for Node tools
const extra =
  Constants.expoConfig?.extra ||
  Constants.manifest?.extra ||
  process.env;

const firebaseConfig = {
  apiKey: "AIzaSyD7GCjiwy7mDtvWK9vRPu5m2bzRbLcZWzw",
  authDomain: "to-do-list-b831f.firebaseapp.com",
  projectId: "to-do-list-b831f",
  storageBucket: "to-do-list-b831f.firebasestorage.app",
  messagingSenderId: "1045803774649",
  appId: "1:1045803774649:web:a0e1b30f39ec857e4c6168",
  measurementId: "G-GJ6T2GECBZ",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase App Check in browser environments
if (typeof window !== 'undefined') {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(extra.RECAPTCHA_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch {
    // ignore duplicate initialization
  }
}

// Export app and modular helpers
export { app, firebase };
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
