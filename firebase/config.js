// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import 'firebase/compat/storage';

// import Constants from 'expo-constants';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// // Resolve env vars from Expo config or process.env for Node tools
// const extra =
//   Constants.expoConfig?.extra ||
//   Constants.manifest?.extra ||
//   process.env;

// const firebaseConfig = {
//   apiKey: extra.FIREBASE_API_KEY,
//   authDomain: extra.FIREBASE_AUTH_DOMAIN,
//   projectId: extra.FIREBASE_PROJECT_ID,
//   storageBucket: extra.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
//   appId: extra.FIREBASE_APP_ID,
// };

// // Initialize once for both compat and modular APIs
// const app = firebase.apps.length
//   ? firebase.app()
//   : firebase.initializeApp(firebaseConfig);

// // Initialize Firebase App Check in browser environments
// if (typeof window !== 'undefined') {
//   try {
//     initializeAppCheck(app, {
//       provider: new ReCaptchaV3Provider(extra.RECAPTCHA_KEY),
//       isTokenAutoRefreshEnabled: true,
//     });
//   } catch (err) {
//     // ignore duplicate initialization errors
//   }
// }

// // Export compat instance for existing code
// export { firebase };

// // Export modular helpers for new code

// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// firebase/config.js
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Pull these from app.json → expo.extra
const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  RECAPTCHA_KEY
} = Constants.expoConfig.extra;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// App Check with reCAPTCHA v3
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(RECAPTCHA_KEY),
  isTokenAutoRefreshEnabled: true,
});

export default app;
