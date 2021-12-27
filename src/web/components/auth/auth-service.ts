import { ApolloClient } from '@apollo/client'
import { getAuth } from '@firebase/auth'
import {
  SessionLogoutDocument,
  SessionLogoutMutation,
  SessionLogoutMutationVariables,
} from '../../apollo/query.graphql'
import { getFirebaseClient } from './firebase-client'

const auth = getAuth(getFirebaseClient())

export const getCookie = (name: string): string | null => {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? v[2] : null
}

// export const AuthService = {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   logout: async (client: ApolloClient<object>): Promise<void> => {
//     // client.mutate()

//     const { data, errors } = await client.mutate<SessionLogoutMutation, SessionLogoutMutationVariables>({
//       mutation: SessionLogoutDocument,
//       // variables: {},
//     })
//     await client.resetStore()
//     // console.log('session logout!')
//     // router.push('/')
//     // await signOut(auth)
//   },

//   sessionLogin: async (idToken: string): Promise<void> => {
//     console.log('sessionLogin...')

//     // const idToken = await authResult.user.getIdToken()
//     const csrfToken = getCookie('csrfToken')

//     const resp = await fetch('/api/auth/session-login', {
//       method: 'POST',
//       body: JSON.stringify({ idToken, csrfToken }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     if (resp.status === 401) {
//       await AuthService.logout()
//     }
//     // console.log(resp.status)
//   },

//   sessionLogout: async (): Promise<void> => {
//     console.log('sessionLogout...')
//     await AuthService.logout()
//     await fetch('/api/auth/session-logout')
//   },
// }
