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
}

const getFirebaseConfig = (): FirebaseOptions => {
  if (!config || !config.apiKey) {
    throw new Error(
      'No Firebase configuration object provided.\n' +
        "Add your web app's configuration object to firebase-config.js",
    )
  } else {
    return config
  }
}

export const getFirebaseClient = () => {
  return getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig())
}

export const useFirebaseClient = (): FirebaseApp => {
  const client = useMemo(() => getFirebaseClient(), [])
  return client
}
