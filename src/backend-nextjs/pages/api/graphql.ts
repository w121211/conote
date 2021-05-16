import util from 'util'
import microCors from 'micro-cors'
import { ApolloServer } from 'apollo-server-micro'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { schema } from '../../apollo/schema'

const apolloServer = new ApolloServer({
  schema,
  playground: true,
  debug: true,
  context(ctx) {
    return ctx
  },
  formatError(error) {
    console.error(util.inspect(error, { showHidden: false, depth: null }))
    return error
  },
})

// type handler = (req: NextApiRequest, res: NextApiResponse) => Promise<handler>
// const cookies = handler => (req, res) => {
//   res.cookie = (name, value, options) => cookie(res, name, value, options)
//   return handler(req, res)
// }
// async function withAuth(handler: handler): Promise<handler> {
//   return async function (req, res) {
//     return handler(req, res)
//     //   //   this.graphqlPath = path || '/graphql';
//     //   //   if (typeof processFileUploads === 'function') {
//     //   //     await this.handleFileUploads(req, res);
//     //   //   }
//     //   //   (await this.handleHealthCheck({
//     //   //     req,
//     //   //     res,
//     //   //     disableHealthCheck,
//     //   //     onHealthCheck,
//     //   //   })) ||
//     //   //     this.handleGraphqlRequestsWithPlayground({ req, res }) ||
//     //   //     (await this.handleGraphqlRequestsWithServer({ req, res })) ||
//     //   //     send(res, 404, null);
//     //   // };
//   }
// }
// const handler = (req: NextApiRequest, res: NextApiResponse) => {
//   // Calling our pure function using the `res` object, it will add the `set-cookie` header
//   // setCookie(res, 'Next.js', 'api-middleware!')
//   // Return the `set-cookie` header so we can display it in the browser and show that it works!
//   res.end(res.getHeader('Set-Cookie'))
// }
// export default cookies(handler)

const apolloHandler = apolloServer.createHandler({ path: '/api/graphql' })

const cors = microCors()
const corsHandler = cors((req, res) => (req.method === 'OPTIONS' ? res.end() : apolloHandler(req, res)))

// export default apolloServer.createHandler({ path: '/api/graphql' })
export default withApiAuthRequired(corsHandler)

// export default withApiAuthRequired(async function (req, res) {
//   // const session = getSession(req, res)
//   // if (session && session.user) {
//   //   res.json({ protected: 'My Secret', id: session.user.sub })
//   // }
//   // res.json({ protected: 'My Secret', id: user.sub })
// })

// See: https://nextjs.org/docs/api-routes/api-middlewares
export const config = {
  api: {
    bodyParser: false,
  },
}
