
export default ({ config }) => ({
  ...config,
  expo: {
    name: "TaskManagerApp",
    slug: "taskmanagerapp",
    owner: "starshield",
    version: "1.0.0",

  },
  extra: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    RECAPTCHA_KEY: process.env.RECAPTCHA_KEY,
  },
  plugins: [
    "expo-build-properties",
    "expo-router",
    "@react-native-firebase/app",
    "@react-native-firebase/auth"
  ],
  eas: {
    projectId: "a91633d0-3bfe-466b-9058-45b8f77be384"
  }
});
