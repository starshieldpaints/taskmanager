// firebase/config.js
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const extra =
  Constants.expoConfig?.extra ||
  Constants.manifest?.extra ||
  process.env;

const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID,
  storageBucket: extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// ==== App Check ====
// In dev on localhost, tell the SDK “I’m in debug mode” by setting this flag.
// In production, this flag should be absent, so reCAPTCHA v3 kicks in.
if (typeof window !== 'undefined') {
  // debug builds only: no real reCAPTCHA key needed for local dev
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(extra.RECAPTCHA_KEY),
    isTokenAutoRefreshEnabled: true,
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
