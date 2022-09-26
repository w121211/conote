import { NextApiRequest, NextApiResponse } from 'next'
import { ApolloError, AuthenticationError } from 'apollo-server-micro'
import { serialize } from 'cookie'
import { auth, firestore } from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/auth'
import { getFirebaseAdmin } from './firebase-admin'
import { mockUsers } from '../../test/__mocks__/user.mock'

class InvitationError extends ApolloError {
  constructor(message: string) {
    super(message, 'NOT_INVITED')
    Object.defineProperty(this, 'name', { value: 'InvitationError' })
  }
}

const TOKEN_NAME = 'session'

/**
 * Init firebase admin
 */
getFirebaseAdmin()

/**
 * If DEV_WITH_STORYBOOK is set 'true', use mock-user as a pretended logged-in user
 *
 */
export async function isAuthenticated(
  req: NextApiRequest,
): Promise<{ userId: string; email: string }> {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.DEV_WITH_STORYBOOK === 'true'
  ) {
    // Mock an authenticated user
    return {
      email: mockUsers[0].email,
      userId: mockUsers[0].id,
    }
  }

  try {
    const sessionCookie = req.cookies[TOKEN_NAME] || ''
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true)

    if (decodedClaims.email === undefined) {
      throw new AuthenticationError('Require email')
    }
    return {
      email: decodedClaims.email,
      userId: decodedClaims.uid,
    }
  } catch (error) {
    throw new AuthenticationError('Not authenticated')
  }
}

/**
 *
 * References:
 * - Firestore API https://googleapis.dev/nodejs/firestore/latest/
 * - Example code https://github.com/firebase/snippets-node/blob/master/firestore/main/index.js
 */
async function isUserInvited(email: string) {
  const docRef = firestore().doc(`invitedEmails/${email}`)
  const doc = await docRef.get()
  console.log(doc)

  return doc.exists
}

/**
 *
 */
export async function sessionLogin(
  req: NextApiRequest,
  res: NextApiResponse,
  idToken: string,
  csrfToken?: string,
): Promise<DecodedIdToken> {
  // Get ID token and CSRF token.
  // const csrfToken = req.body.csrfToken.toString()
  // console.log('idToken', idToken)

  // Guard against CSRF attacks.
  // if (!req.cookies || csrfToken !== req.cookies.csrfToken) {
  //   console.debug(req.cookies)
  //   throw new AuthenticationError('Not authenticated')
  // }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000

  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // We could also choose to enforce that the ID token auth_time is recent.
  const decodedClaims = await auth().verifyIdToken(idToken)

  // Check is user invited, if not return error
  if (decodedClaims.email && (await isUserInvited(decodedClaims.email))) {
    // Do nothing, proceed
  } else {
    throw new InvitationError('Not invited')
  }

  // In this case, we are enforcing that the user signed in in the last 5 minutes.
  if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
    const sessionToken = await auth().createSessionCookie(idToken, {
      expiresIn,
    })
    // console.log(sessionToken)
    // res.setHeader('Set-Cookie', sessionCookie)
    // res.end(JSON.stringify({ status: 'success' }))

    const cookie = serialize(TOKEN_NAME, sessionToken, {
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'lax',

      // Require https to work
      // @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
      secure: process.env.NODE_ENV === 'production',
    })

    res.setHeader('Set-Cookie', cookie)
    return decodedClaims
  }

  throw new AuthenticationError('Not authenticated')
}

/**
 *
 */
export async function sessionLogout(req: NextApiRequest, res: NextApiResponse) {
  // console.log('API sessionLogout')
  const sessionCookie = req.cookies[TOKEN_NAME] || ''

  if (sessionCookie.length > 0) {
    try {
      const decodedClaims = await auth().verifySessionCookie(
        sessionCookie,
        true,
      )

      // Revoke firebase token
      auth().revokeRefreshTokens(decodedClaims.sub)
    } catch (err) {
      console.error(err)
    }
  }

  // Clear cookie
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
    sameSite: 'lax',
  })
  res.setHeader('Set-Cookie', cookie)
}
