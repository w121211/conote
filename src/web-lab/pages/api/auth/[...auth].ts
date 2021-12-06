/**
 * @see
 * https://github.com/firebase/quickstart-nodejs/blob/master/auth-sessions/app.js
 * https://github.com/vercel/next.js/tree/canary/examples/api-routes-apollo-server-and-client-auth
 * https://dev.to/theranbrig/server-side-authentication-with-nextjs-and-firebase-354m
 *
 * CSRF token
 * https://github.com/vercel/next.js/discussions/13234
 */
import { serialize, parse } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from 'firebase-admin'
import { getFirebaseAdmin } from '../../../lib/firebase-admin'

const TOKEN_NAME = 'session'

getFirebaseAdmin()

const isAuthenticated = async (req: NextApiRequest): Promise<void> => {
  try {
    // const session = await getLoginSession(req)
    // if (session) {
    //   return findUser({ email: session.email })
    // }
    const sessionCookie = req.cookies[TOKEN_NAME] || ''
    console.log(req.cookies)
    console.log('sessionCookie', sessionCookie)
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true)
    console.log(decodedClaims)
    // return decodedClaims
  } catch (error) {
    console.error(error)
    // throw new AuthenticationError(
    //   'Authentication token is invalid, please log in'
    // )
    throw 'AuthenticationError'
  }
}

const sessionLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get ID token and CSRF token.
  const idToken = req.body.idToken.toString()
  // const csrfToken = req.body.csrfToken.toString()

  console.log('idToken', idToken)

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

  console.log(decodedClaims)

  if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
    const sessionToken = await auth().createSessionCookie(idToken, {
      expiresIn: expiresIn,
    })
    console.log(sessionToken)
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
    res.end(JSON.stringify({ status: 'success' }))
    return
  }
  res.status(401).send('UNAUTHORIZED REQUEST!')
}

const sessionLogout = async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionCookie = req.cookies.session || ''

  if (sessionCookie.length > 0) {
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true)
    auth().revokeRefreshTokens(decodedClaims.sub) // revoke token
  }

  // Clear cookie
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })
  res.setHeader('Set-Cookie', cookie)

  return true
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { auth: authPath } = req.query

  // console.log(authPath)

  if (authPath[0] === 'session-login' && req.method === 'POST') {
    console.log('api sessionLogin...')
    await sessionLogin(req, res)
    res.status(200)
    return
  }
  if (authPath[0] === 'profile') {
    console.log('api profile...')
    isAuthenticated(req)
    // res.end(JSON.stringify({ status: 'profile' }))
    res.status(200).json({ name: 'John Doe' })
    return
  }
  if (authPath[0] === 'session-logout') {
    return await sessionLogout(req, res)
  }
  if (authPath[0] === 'is-loggedin') {
    await isAuthenticated(req)
    res.status(200).json(true)
  }

  // try {
  //   console.log(req.body)
  //   const claims = await isAuthenticated(req)
  //   console.log('Logged in!', claims)
  // } catch (err) {
  //   console.error(err)
  //   throw 'Authentication error'
  // }

  // res.status(200).json({ name: 'John Doe' })
  throw 'Authentication error'
}

export default handler
