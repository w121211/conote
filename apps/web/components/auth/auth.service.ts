/**
 * Examples:
 * https://github.com/firebase/quickstart-nodejs/blob/master/auth-sessions/script.js
 * - client-side https://github.com/firebase/quickstart-nodejs/blob/master/auth-sessions/script.js
 * - server-side https://github.com/firebase/quickstart-nodejs/blob/master/auth-sessions/app.js
 * https://github.com/gladly-team/next-firebase-auth/tree/main/example
 *  - require token to place in request header when calling API @see https://github.com/gladly-team/next-firebase-auth/issues/223
 *  - not support firebase v9 yet @see https://github.com/gladly-team/next-firebase-auth/issues/265
 * https://github.com/vercel/next.js/tree/canary/examples/api-routes-apollo-server-and-client-auth
 * - Apollo + next-firebase-auth example
 *
 */

import { ApolloClient } from '@apollo/client'
import { Auth, getAuth, User as FirebaseUser } from '@firebase/auth'
import {
  MeDocument,
  MeQuery,
  MeQueryResult,
  SessionLogoutDocument,
  SessionLogoutMutation,
  SessionLogoutMutationResult,
  UserFragment,
} from '../../apollo/query.graphql'
import { getFirebaseClient } from './firebase-client'

export type LoggedInUser = {
  id: string
  email: string
}

/**
 * @param name The cookie name.
 * @return The corresponding cookie value to lookup.
 */
export function getCookie(name: string): string | null {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? v[2] : null
}

async function getFirebaseUser(
  firebaseAuth: Auth,
): Promise<FirebaseUser | null> {
  return await new Promise<FirebaseUser | null>((resolve, reject) =>
    firebaseAuth.onAuthStateChanged(
      user => resolve(user),
      err => reject(err),
    ),
  )
}

/**
 * Return firebase-user only if both client and server both confirm the user is logged in
 * - server logged-out, client logged-out -> do nothing
 * - server logged-in, client logged-in -> do nothing
 * - server logged-in, client logged-out -> logout from server
 * - server logged-out, client logged-in -> logout from client
 *
 */
export async function getLoggedInUser(
  apolloClient: ApolloClient<object>,
): Promise<LoggedInUser | null> {
  const firebaseClient = getFirebaseClient(),
    firebaseAuth = getAuth(firebaseClient),
    firebaseUser = await getFirebaseUser(firebaseAuth)

  let me: UserFragment | null = null

  try {
    const { data: queryMeData } = await apolloClient.query<
      MeQuery,
      MeQueryResult
    >({
      query: MeDocument,
      fetchPolicy: 'network-only',
    })
    if (queryMeData) me = queryMeData.me
  } catch (err) {
    // console.debug(err)
  }

  if (me && firebaseUser) {
    const { email } = firebaseUser

    if (email === null) throw new Error('[getLoggedInUser] email === null')

    return { id: me.id, email }
  }
  if (me === null && firebaseUser === null) {
    return null
  }
  if (me && firebaseUser === null) {
    await logout(firebaseAuth, apolloClient)
    return null
  }
  if (me === null && firebaseUser) {
    await logout(firebaseAuth, apolloClient)
    return null
  }

  console.debug('Unexpected case')
  // await logout(firebaseAuth, apolloClient)
  return null
}

/**
 * Logout from both firebase and server
 */
export async function logout(
  firebaseAuth: Auth,
  apolloClient: ApolloClient<object>,
) {
  await firebaseAuth.signOut()
  await apolloClient.mutate<SessionLogoutMutation, SessionLogoutMutationResult>(
    {
      mutation: SessionLogoutDocument,
    },
  )
}
