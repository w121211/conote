import { FirebaseOptions } from '@firebase/app'

/**
 * To find your Firebase config object:
 *
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
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
