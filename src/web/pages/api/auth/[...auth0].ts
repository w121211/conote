/**
 * @see https://github.com/auth0/nextjs-auth0
 *
 * Auth0 url:
 * /api/auth/login
 * /api/auth/callback
 * /api/auth/logout
 * /api/auth/me
 */
import { handleAuth, handleCallback, AfterCallback } from '@auth0/nextjs-auth0'
import { getOrCreateUser } from '../../../lib/models/user'

/**
 * @see
 * https://github.com/auth0/nextjs-auth0/issues/45
 * https://auth0.github.io/nextjs-auth0/modules/handlers_callback.html#modify-the-session-after-login
 */
const afterCallback: AfterCallback = async function (req, res, session, _state) {
  // 加入app自己的user-id至session，未來就能直接透過session直接取得appUserId
  const user = await getOrCreateUser(session.user.email)
  session.user.appUserId = user.id
  return session
}

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (err: any) {
      res.status(err.status || 500).end(err.message)
    }
  },
})
