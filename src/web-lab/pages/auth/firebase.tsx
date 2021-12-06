import {
  connectAuthEmulator,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
  signOut,
} from '@firebase/auth'
import { getAnalytics } from 'firebase/analytics'
import * as firebaseui from 'firebaseui'
import { useAuthState } from 'react-firebase-hooks/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { firebaseApp } from '../../lib/firebase'

// const firebaseConfig: FirebaseOptions = {
//   apiKey: 'AIzaSyCqIfX2lIaYbBtyl59LyPICxcno2h0sFPw',
//   // authDomain: 'conote-auth.firebaseapp.com',
//   authDomain: 'localhost:9099',
//   projectId: 'conote-auth',
//   storageBucket: 'conote-auth.appspot.com',
//   messagingSenderId: '715492568657',
//   appId: '1:715492568657:web:fd9ce73255ec5991d51270',
//   measurementId: 'G-XGJSLMV2G2',
// }

// Initialize Firebase
// const firebaseApp =
//   getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig())

// console.log(firebaseApp)

// const firebaseApp = initializeApp(firebaseConfig)

// const analytics = getAnalytics(firebaseApp)

const auth = getAuth(firebaseApp)
// connectAuthEmulator(auth, 'http://localhost:9099')

const loginGoogle = async () => {
  // signInWithEmailAndPassword(auth, 'test@test.com', 'password');
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

const loginEmail = async (email: string) => {
  // signInWithEmailAndPassword(auth, 'test@test.com', 'password');
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios',
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12',
    },
    dynamicLinkDomain: 'example.page.link',
  }
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      // ...
    })
}

const logout = () => {
  signOut(auth)
}

const CurrentUser = () => {
  const [user, loading, error] = useAuthState(auth)

  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      // {
      //   provider: EmailAuthProvider.PROVIDER_ID,
      //   requireDisplayName: false,
      // },
      {
        provider: EmailAuthProvider.PROVIDER_ID,
        signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        forceSameDevice: false,
        // emailLinkSignIn:
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  }

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    )
  }
  if (user) {
    console.log(user)
    return (
      <div>
        <p>Current User: {user.email}</p>
        <button onClick={logout}>Log out</button>
      </div>
    )
  }
  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={getAuth(firebaseApp)}
      />
      {/* <button onClick={loginGoogle}>Log in (Google)</button>
      <button onClick={loginEmail}>Log in (Email)</button> */}
    </div>
  )
}

export const Page = (): JSX.Element => {
  // const {
  //   uiConfig: firebaseui.auth.Config;
  //   uiCallback?(ui: firebaseui.auth.AuthUI): void;
  //   firebaseAuth: any; // As firebaseui-web
  //   className?: string;
  // }

  return (
    <div>
      <CurrentUser />
      {/* <button
        onClick={async () => {
          const provider = new GoogleAuthProvider()
          await signInWithPopup(getAuth(), provider)
        }}
      >
        Sign in
      </button>
      <button
        onClick={() => {
          signOut(getAuth())
        }}
      >
        Sign out
      </button> */}
    </div>
  )
}

export default Page
