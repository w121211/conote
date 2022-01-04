import { credential } from 'firebase-admin'
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app'

export const getFirebaseAdmin = (): App => {
  return getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY ? JSON.parse(process.env.FIREBASE_PRIVATE_KEY) : undefined,
        }),
      })
}
