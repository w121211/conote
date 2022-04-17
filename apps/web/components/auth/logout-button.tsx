import { useApolloClient } from '@apollo/client'
import { getAuth } from '@firebase/auth'
import { logout } from './auth.service'
import { getFirebaseClient } from './firebase-client'

const LogoutButton = () => {
  const firebaseClient = getFirebaseClient(),
    firebaseAuth = getAuth(firebaseClient),
    apolloClient = useApolloClient()

  return (
    <button
      onClick={async () => {
        await logout(firebaseAuth, apolloClient)
        location.reload()
      }}
    >
      logout
    </button>
  )
}

export default LogoutButton
