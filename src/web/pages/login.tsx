/**
 * @see
 * https://github.com/firebase/quickstart-nodejs/blob/master/auth-sessions/script.js
 * - 官方範例，主要參考這個
 *
 * https://github.com/gladly-team/next-firebase-auth/tree/main/example
 * - 目前 call API 時需將 token 放在 request header @see https://github.com/gladly-team/next-firebase-auth/issues/223
 * - 還未支援 firebase v9 @see https://github.com/gladly-team/next-firebase-auth/issues/265
 *
 * https://github.com/vercel/next.js/tree/canary/examples/api-routes-apollo-server-and-client-auth
 */
import { useApolloClient } from '@apollo/client'
import { EmailAuthProvider, getAuth, GoogleAuthProvider, UserCredential } from '@firebase/auth'
import firebaseui from 'firebaseui'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { useSessionLoginMutation, useSessionLogoutMutation } from '../apollo/query.graphql'
import { useFirebaseClient } from '../components/auth/firebase-client'

const LoginPanel = (): JSX.Element | null => {
  const router = useRouter()
  const apolloClient = useApolloClient()
  const firebaseClient = useFirebaseClient()
  const [user, loadingFirebaseUser, queryFirebaseUserError] = useAuthState(getAuth(firebaseClient))
  // const { data, loading: loadingMe, error: queryMeError } = useMeQuery()

  const [sessionLogin, { loading: loadingSessionLogin }] = useSessionLoginMutation()
  const [sessionLogout, { loading: loadingSessionLogout }] = useSessionLogoutMutation()

  const firebaseAuth = getAuth(firebaseClient)

  const handleLogin = async (idToken: string) => {
    try {
      await apolloClient.resetStore()
      const { data } = await sessionLogin({
        variables: { idToken },
      })
      if (data?.sessionLogin) {
        // console.log('session logined!')
        router.back()
      } else {
        console.error('session login fail')
      }
    } catch (error) {
      // setErrorMsg(getErrorMessage(error))
      console.error('session login fail', error)
      // signOut(firebaseAuth)
    }
  }

  const handleLogout = async () => {
    // console.log('session logout!')
    router.push('/')
  }

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
      signInSuccessWithAuthResult: (authResult: UserCredential, redirectUrl?: string) => {
        // callback not working for email link sign in, @see
        // console.log('signInSuccessWithAuthResult callback')
        // const idToken = await authResult.user.getIdToken()
        authResult.user.getIdToken().then(idToken => {
          // AuthService.sessionLogin(idToken)
          return handleLogin(idToken)
        })
        return false
      },
    },
  }
  if (loadingFirebaseUser || loadingSessionLogin) {
    return null
  }
  if (queryFirebaseUserError) {
    console.error(queryFirebaseUserError)
    return (
      <div>
        <p>Error: {queryFirebaseUserError}</p>
      </div>
    )
  }
  // if (queryMeError) {
  // if (queryMeError.graphQLErrors.filter(e => e.extensions.code === 'UNAUTHENTICATED')) {
  // } else {
  //   return (
  //     <div>
  //       <p>Error: {queryMeError.message}</p>
  //     </div>
  //   )
  // }
  // console.log(queryMeError.graphQLErrors[0].extensions.code === 'UNAUTHENTICATED')
  // sessionLogout()
  // }
  if (user) {
    // console.log(user)
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
            // AuthService.sessionLogout()
            router.back()
          }}
        >
          Return
        </button>
        <button
          onClick={() => {
            sessionLogout()
          }}
        >
          Logout
        </button>
        {/* <button
          onClick={() => {
            // AuthService.sessionLogout()
            router.push('/')
          }}
        >
          Home
        </button> */}
      </div>
    )
  }
  return (
    <div className="flex justify-center w-screen h-screen bg-gray-100">
      <div className="h-fit mt-[20vh] p-10  rounded bg-white shadow-2xl">
        <h1 className="mb-4">免費登入</h1>
        <div className="mb-10 text-gray-600">馬上登入開始在Conote上寫筆記吧!</div>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
      </div>
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
