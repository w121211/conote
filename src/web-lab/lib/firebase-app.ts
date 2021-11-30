import { useState, useEffect, useMemo } from 'react'
import {
  FirebaseApp,
  FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from '@firebase/app'

// export default function useFirebaseAuth() {
//   const [authUser, setAuthUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   const authStateChanged = async (authState) => {
//     if (!authState) {
//       setLoading(false)
//       return
//     }

//     setLoading(true)

//     var formattedUser = formatAuthUser(authState)

//     setAuthUser(formattedUser)

//     setLoading(false)
//   }

//   const clear = () => {
//     setAuthUser(null)
//     setLoading(true)
//   }

//   const signInWithEmailAndPassword = (email, password) =>
//     firebase.auth().signInWithEmailAndPassword(email, password)

//   const createUserWithEmailAndPassword = (email, password) =>
//     firebase.auth().createUserWithEmailAndPassword(email, password)

//   const signOut = () => firebase.auth().signOut().then(clear)

//   useEffect(() => {
//     const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged)
//     return () => unsubscribe()
//   }, [])

//   return {
//     authUser,
//     loading,
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
//     signOut,
//   }
// }

const config: FirebaseOptions = {
  /* TODO: ADD YOUR FIREBASE CONFIGURATION OBJECT HERE */
  apiKey: 'AIzaSyCqIfX2lIaYbBtyl59LyPICxcno2h0sFPw',
  authDomain: 'conote-auth.firebaseapp.com',
  projectId: 'conote-auth',
  storageBucket: 'conote-auth.appspot.com',
  messagingSenderId: '715492568657',
  appId: '1:715492568657:web:fd9ce73255ec5991d51270',
  measurementId: 'G-XGJSLMV2G2',
}

export const getFirebaseConfig = (): FirebaseOptions => {
  if (!config || !config.apiKey) {
    throw new Error(
      'No Firebase configuration object provided.' +
        '\n' +
        "Add your web app's configuration object to firebase-config.js"
    )
  } else {
    return config
  }
}

// const firebaseCredentials = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// }

//If an firebase app hasn't already been created
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseCredentials)
// }

// export default firebase;

const getFirebaseApp = () => {
  return getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig())
}

export const useFirebase = (): FirebaseApp => {
  const store = useMemo(() => getFirebaseApp(), [])
  return store
}
