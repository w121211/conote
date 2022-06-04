import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import {
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  UserCredential,
} from '@firebase/auth'
import firebaseui from 'firebaseui'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { useSessionLoginMutation } from '../../apollo/query.graphql'
import { useFirebaseClient } from './firebase-client'

/**
 * Known issues
 * - callback not working for email link sign in
 */
const makeUIConfig = (
  handleSignedInUser: (authResult: UserCredential) => void,
): firebaseui.auth.Config => ({
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
      redirectUrl?: string,
    ) => {
      // console.log('signInSuccessWithAuthResult callback')
      handleSignedInUser(authResult)

      // Do not automatically redirect.
      return false
    },
  },
})

const LoginPanel = (): JSX.Element | null => {
  const firebaseClient = useFirebaseClient(),
    firebaseAuth = getAuth(firebaseClient),
    apolloClient = useApolloClient(),
    [sessionLogin] = useSessionLoginMutation(),
    [error, setError] = useState<string | null>(null)

  async function handleSignedInUser(authResult: UserCredential) {
    // Session login endpoint is queried and the session cookie is set.
    // CSRF token should be sent along with request.
    // const csrfToken = getCookie('csrfToken'),

    const idToken = await authResult.user.getIdToken()

    try {
      await apolloClient.resetStore()
      const { data } = await sessionLogin({ variables: { idToken } })
      if (data?.sessionLogin) {
        location.reload()
      } else {
        // console.error('session login fail')
        setError('Login fail')
      }
    } catch (err) {
      console.debug(err)
      setError('Login fail')
    }
  }

  if (error) {
    return <div>{error}</div>
  }
  return (
    <div className="flex justify-center w-screen h-screen bg-gray-100">
      <div className="h-fit mt-[20vh] p-10  rounded bg-white shadow-2xl">
        <h1 className="mb-4">免費登入</h1>
        <div className="mb-10 text-gray-600">
          馬上登入開始在Konote上寫筆記吧!
        </div>
        <StyledFirebaseAuth
          uiConfig={makeUIConfig(handleSignedInUser)}
          firebaseAuth={firebaseAuth}
        />
      </div>
    </div>
  )
}

export default LoginPanel
