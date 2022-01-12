import assert from 'assert'
import { credential } from 'firebase-admin'
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app'

assert(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== undefined,
  'env NEXT_PUBLIC_FIREBASE_PROJECT_ID not found'
)
assert(
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN !== undefined,
  'env NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN not found'
)
assert(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== undefined,
  'env NEXT_PUBLIC_FIREBASE_PROJECT_ID not found'
)
assert(
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET !== undefined,
  'env NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET not found'
)

export const getFirebaseAdmin = (): App => {
  return getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
      })
}
