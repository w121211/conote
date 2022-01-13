/**
 * @see
 * https://github.com/firebase/quickstart-nodejs/blob/master/auth-sessions/script.js
 * - 官方範例，主要參考這個
 * https://github.com/gladly-team/next-firebase-auth/tree/main/example
 * - 目前 call API 時需將 token 放在 request header @see https://github.com/gladly-team/next-firebase-auth/issues/223
 * - 還未支援 firebase v9 @see https://github.com/gladly-team/next-firebase-auth/issues/265
 */
import {
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  UserCredential,
} from '@firebase/auth'
import firebaseui from 'firebaseui'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { getFirebaseClient, useFirebaseClient } from '../../lib/firebase-client'
import { AuthService, getCookie } from './auth-service'

const LoginPanel = (): JSX.Element | null => {
  const router = useRouter()
  const firebaseClient = useFirebaseClient()
  const [user, loading, error] = useAuthState(getAuth(firebaseClient))

  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      {
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
      // {
      //   provider: EmailAuthProvider.PROVIDER_ID,
      //   signInMethod: EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      //   forceSameDevice: false,
      //   // emailLinkSignIn: () => {
      //   //   return {
      //   //     // Additional state showPromo=1234 can be retrieved from URL on
      //   //     // sign-in completion in signInSuccess callback by checking
      //   //     // window.location.href.
      //   //     // If you are using a fragment in the URL, additional FirebaseUI
      //   //     // parameters will be appended to the query string component instead
      //   //     // of the fragment.
      //   //     // So for a url: https://www.example.com/#/signin
      //   //     // The completion URL will take the form:
      //   //     // https://www.example.com/?uid_sid=xyz&ui_sd=0#/signin
      //   //     // This should be taken into account when using frameworks with "hash
      //   //     // routing".
      //   //     url: 'http://localhost:3000/auth/complete-sign-in',
      //   //     // Custom FDL domain.
      //   //     // dynamicLinkDomain: 'example.page.link',
      //   //     // Always true for email link sign-in.
      //   //     handleCodeInApp: true,
      //   //     // Whether to handle link in iOS app if installed.
      //   //     // iOS: {
      //   //     //   bundleId: 'com.example.ios',
      //   //     // },
      //   //     // Whether to handle link in Android app if opened in an Android
      //   //     // device.
      //   //     // android: {
      //   //     //   packageName: 'com.example.android',
      //   //     //   installApp: true,
      //   //     //   minimumVersion: '12',
      //   //     // },
      //   //   }
      //   // },
      // },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (
        authResult: UserCredential,
        redirectUrl?: string
      ) => {
        // callback not working for email link sign in, @see
        console.log('signInSuccessWithAuthResult callback')
        // const idToken = await authResult.user.getIdToken()
        authResult.user.getIdToken().then((idToken) => {
          AuthService.sessionLogin(idToken)
        })
        return false
      },
    },
  }
  if (loading) {
    return null
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
    // console.log(router.query)
    // if (router.query.mode === 'signIn') {
    //   if (getCookie('session') === null) {
    //     user
    //       .getIdToken()
    //       .then((idToken) => {
    //         console.log(idToken)
    //         return AuthService.sessionLogin(idToken)
    //       })
    //       .then(() => {
    //         console.log('session logined')
    //         // router.back()
    //       })
    //   }
    // }
    // if (router.query.ui_sid) {
    //   console.log(router.query.ui_sid)
    // }
    // if (getCookie('session') === null) {
    //   user
    //     .getIdToken()
    //     .then((idToken) => {
    //       console.log(idToken)
    //       return sessionLogin(idToken)
    //     })
    //     .then(() => {
    //       // router.back()
    //     })
    // } else {
    //   router.back()
    // }
    return (
      <div>
        Login successfully!
        <button
          onClick={() => {
            AuthService.sessionLogout()
          }}
        >
          logout
        </button>
      </div>
    )
  }
  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={getAuth(firebaseClient)}
      />
      {/* <button onClick={loginGoogle}>Log in (Google)</button>
      <button onClick={loginEmail}>Log in (Email)</button> */}
    </div>
  )
}

export const Page = (): JSX.Element => {
  return (
    <div>
      <LoginPanel />
    </div>
  )
}

export default Page
