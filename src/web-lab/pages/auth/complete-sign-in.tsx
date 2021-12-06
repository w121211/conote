import { getAuth } from '@firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { firebaseApp } from '../../lib/firebase'
import { AuthService } from './auth-service'

export const Page = (): JSX.Element | null => {
  const [user, loading, error] = useAuthState(getAuth(firebaseApp))
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
    user
      .getIdToken()
      .then((idToken) => {
        console.log('complete sign in...', idToken)
        return AuthService.sessionLogin(idToken)
      })
      .then(() => {
        // router.back()
      })

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
            AuthService.logout()
          }}
        >
          logout
        </button>
      </div>
    )
  }
  return <div>Trying to complete sign in, not login yet...</div>
}

export default Page
