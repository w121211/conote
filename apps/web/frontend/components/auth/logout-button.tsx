import { useApolloClient } from '@apollo/client'
import { getAuth } from '@firebase/auth'
import { logout } from './auth.service'
import { getFirebaseClient } from './firebase-client'

const LogoutButton = ({ className }: { className?: string }) => {
  const firebaseClient = getFirebaseClient(),
    firebaseAuth = getAuth(firebaseClient),
    apolloClient = useApolloClient()

  const className_ = className ?? 'btn-normal-lg font-medium '

  return (
    <button
      type="button"
      className={className_}
      onClick={async () => {
        await logout(firebaseAuth, apolloClient)
        location.reload()
      }}
    >
      Logout
    </button>
  )
}

export default LogoutButton
