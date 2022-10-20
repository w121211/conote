import { useMemo } from 'react'
import {
  FirebaseApp,
  FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from '@firebase/app'

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,

  // Analytics
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

function getFirebaseConfig(): FirebaseOptions {
  if (!config || !config.apiKey) {
    throw new Error(
      'No Firebase configuration object provided.\n' +
        "Add your web app's configuration object to firebase-config.js",
    )
  } else {
    return config
  }
}

// const analytics = getAnalytics(app);

export function getFirebaseClient() {
  return getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig())
}

export function useFirebaseClient(): FirebaseApp {
  const client = useMemo(() => getFirebaseClient(), [])
  return client
}
