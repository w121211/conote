// import { IncomingMessage, ServerResponse } from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize, parse } from 'cookie'

const TOKEN_NAME = 'token'

export const MAX_AGE = 60 * 60 * 8 // 8 hours

export function setTokenCookie(res: NextApiResponse, token: string): void {
  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',  // needs https, @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    path: '/',
    sameSite: 'lax',
  })

  res.setHeader('Set-Cookie', cookie)
}

export function removeTokenCookie(res: NextApiResponse): void {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

// function parseCookies(req: NextApiRequest): Record<string, string> {
//   // For API Routes we don't need to parse the cookies.
//   if (req.cookies !== undefined) return req.cookies

//   // For pages we do need to parse the cookies.
//   const cookie = req.headers?.cookie
//   return parse(cookie || '')
// }

// export function getTokenCookie(req: NextApiRequest): string {
//   const cookies = parseCookies(req)
//   return cookies[TOKEN_NAME]
// }
