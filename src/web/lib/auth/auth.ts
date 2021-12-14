import { NextApiRequest, NextApiResponse } from 'next'
// import { sign, verify } from 'jsonwebtoken'
// import { setTokenCookie, getTokenCookie } from './auth-cookies'
import { AuthenticationError } from 'apollo-server-micro'
import { serialize } from 'cookie'
import { auth } from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/auth'
import { getFirebaseAdmin } from './firebase-admin'

// if (process.env.APP_TOKEN_SECRET === undefined) {
//   throw new Error('TOKEN_SECRET not found')
// }

// const TOKEN_SECRET = process.env.APP_TOKEN_SECRET

// interface Session {
//   userId: string
// }

// function getLoginSession(req: NextApiRequest): Session {
//   const token = getTokenCookie(req)
//   // if (!token) throw new Error('No token found')
//   // try {
//   //   return verify(token.replace('Bearer ', ''), TOKEN_SECRET) as Session
//   // } catch (error) {
//   //   removeTokenCookie(res)
//   // }
//   return verify(token.replace('Bearer ', ''), TOKEN_SECRET) as Session
// }

// function setLoginSession(res: NextApiResponse, session: Session): void {
//   const token = sign(session, TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '1d' })
//   setTokenCookie(res, token)
// }

const TOKEN_NAME = 'session'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const firebaseAdmin = getFirebaseAdmin() // init firebase admin

export const isAuthenticated = async (req: NextApiRequest): Promise<{ userId: string; email: string }> => {
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

export const sessionLogin = async (
  req: NextApiRequest,
  res: NextApiResponse,
  idToken: string,
): Promise<DecodedIdToken> => {
  // Get ID token and CSRF token.
  // const idToken = req.body.idToken.toString()
  // const csrfToken = req.body.csrfToken.toString()
  // console.log('idToken', idToken)

  // Guard against CSRF attacks.
  // if (!req.cookies || csrfToken !== req.cookies.csrfToken) {
  //   res.status(401).send('UNAUTHORIZED REQUEST!')
  //   return
  // }

  // setLoginSession()

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // We could also choose to enforce that the ID token auth_time is recent.
  const decodedClaims = await auth().verifyIdToken(idToken)

  // In this case, we are enforcing that the user signed in in the last 5 minutes.
  if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
    const sessionToken = await auth().createSessionCookie(idToken, { expiresIn })
    // console.log(sessionToken)
    // res.setHeader('Set-Cookie', sessionCookie)
    // res.end(JSON.stringify({ status: 'success' }))

    const cookie = serialize(TOKEN_NAME, sessionToken, {
      expires: new Date(Date.now() + expiresIn),
      httpOnly: true,
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    res.setHeader('Set-Cookie', cookie)

    return decodedClaims
  }
  throw new AuthenticationError('Not authenticated')
}

export const sessionLogout = async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionCookie = req.cookies[TOKEN_NAME] || ''

  if (sessionCookie.length > 0) {
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true)
    auth().revokeRefreshTokens(decodedClaims.sub) // revoke token
  }

  // Clear cookie
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
    sameSite: 'lax',
  })
  res.setHeader('Set-Cookie', cookie)
}
