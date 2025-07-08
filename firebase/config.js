import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

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
  appId: "1:1045803774649:web:1609b1efe7571daf4c6168",
  measurementId: "G-619D6XP549",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

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
export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
