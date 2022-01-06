import { credential } from 'firebase-admin'
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app'

let privateKey: string | undefined
try {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    // @see https://github.com/gladly-team/next-firebase-auth/discussions/95
    // in k8s deployment the variable includes "'" which needs to be removed
    privateKey = JSON.parse(process.env.FIREBASE_PRIVATE_KEY.replace(/'/gm, ''))
  } else {
    throw 'process.env.FIREBASE_PRIVATE_KEY === undefined'
  }
} catch (err) {
  console.error(process.env.FIREBASE_PRIVATE_KEY, err)
  privateKey = process.env.FIREBASE_PRIVATE_KEY
}

export const getFirebaseAdmin = (): App => {
  return getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      })
}
