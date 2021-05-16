import { handleAuth } from '@auth0/nextjs-auth0'

console.log(process.env.AUTH0_BASE_URL)

export default handleAuth()
// export default function handler(req, res) {
//   const { auth0 } = req.query
//   res.end(`Post: ${auth0}`)
// }
