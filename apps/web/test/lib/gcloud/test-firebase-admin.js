/**
 * Run
 * $ gcloud auth application-default login
 * $ node test-firebase-admin.js
 */

const { firestore, credential } = require('firebase-admin')
const { initializeApp, applicationDefault } = require('firebase-admin/app')

const app = initializeApp({
  credential: credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
})

console.log(app)

const docRef = firestore().doc(`invitedEmails/w121235@yahoo.com.tw`)

docRef.get().then(e => {
  console.log('...')
  console.log(e)
})
