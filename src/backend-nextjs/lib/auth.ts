// import { IncomingMessage, ServerResponse } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { sign, verify } from 'jsonwebtoken'
import { setTokenCookie, getTokenCookie } from './auth-cookies'

if (process.env.TOKEN_SECRET === undefined) {
  throw new Error()
}

const TOKEN_SECRET = process.env.TOKEN_SECRET

export interface Session {
  userId: string
}

export function getLoginSession(req: NextApiRequest): Session {
  const token = getTokenCookie(req)
  // if (!token) throw new Error('No token found')
  // try {
  //   return verify(token.replace('Bearer ', ''), TOKEN_SECRET) as Session
  // } catch (error) {
  //   removeTokenCookie(res)
  // }
  return verify(token.replace('Bearer ', ''), TOKEN_SECRET) as Session
}

export function setLoginSession(res: NextApiResponse, session: Session): void {
  const token = sign(session, TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '1d' })
  setTokenCookie(res, token)
}
