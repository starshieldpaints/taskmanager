// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import "firebase/compat/storage";
// import Constants from 'expo-constants';

// // Environment variables are injected via app.config.js. Access them from
// // Constants.expoConfig.extra without destructuring to avoid name collisions
// // Try multiple sources so the app works in Expo Go, web, or a native build
// // `expoConfig.extra` is available in development. `manifest.extra` covers
// // EAS build environments. Finally, fall back to `process.env` when running in
// // Node-based tooling.
// const extra =
//   Constants.expoConfig?.extra ||
//   Constants.manifest?.extra ||
//   process.env;


// // Environment variables are injected via app.config.js. Access them from
// // Constants.expoConfig.extra without destructuring to avoid name collisions


// // Environment variables are injected via app.config.js. Access them from
// // Constants.expoConfig.extra without destructuring to avoid name collisions


// // Environment variables are injected via app.config.js into Constants.expoConfig.extra

// // Environment variables are injected via app.config.js into Constants.expoConfig.extra

// const {
//   FIREBASE_API_KEY,
//   FIREBASE_AUTH_DOMAIN,
//   FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID,
// } = Constants.expoConfig?.extra ?? {};
// const firebaseConfig = {

//   apiKey: "AIzaSyD7GCjiwy7mDtvWK9vRPu5m2bzRbLcZWzw",
//   authDomain: "to-do-list-b831f.firebaseapp.com",
//   projectId: "to-do-list-b831f",
//   storageBucket: "to-do-list-b831f.firebasestorage.app",
//   messagingSenderId: "1045803774649",
//   appId: "1:1045803774649:web:1609b1efe7571daf4c6168",
// }


// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// export { firebase };

// firebase/config.js
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
