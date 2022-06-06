import { useApolloClient } from '@apollo/client'
import { getAuth } from '@firebase/auth'
import { logout } from './auth.service'
import { getFirebaseClient } from './firebase-client'

const LogoutButton = ({ className }: { className?: string }) => {
  const firebaseClient = getFirebaseClient(),
    firebaseAuth = getAuth(firebaseClient),
    apolloClient = useApolloClient()

  const className_ =
    className ??
    'py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'

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
