import util from 'util'
import { ApolloServer } from 'apollo-server-micro'
// import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { schema } from '../../apollo/schema'
import { IncomingMessage, ServerResponse } from 'http'

/**
 * @see https://github.com/vercel/next.js/blob/canary/examples/api-routes-graphql/pages/api/graphql.js
 */
const apolloServer = new ApolloServer({
  schema,
  debug: true,
  context(ctx) {
    return ctx
  },
  formatError(error) {
    console.error(util.inspect(error, { showHidden: false, depth: null }))
    return error
  },
})

const startServer = apolloServer.start()

const handler = async (req: IncomingMessage, res: ServerResponse): Promise<void | false> => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  // res.setHeader('Access-Control-Allow-Origin', 'https://studio.apollographql.com')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export default handler

// @see https://nextjs.org/docs/api-routes/api-middlewares
export const config = {
  api: {
    bodyParser: false,
  },
}
