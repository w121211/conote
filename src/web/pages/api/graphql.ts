import util from 'util'
import microCors from 'micro-cors'
import { ApolloServer } from 'apollo-server-micro'
// import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { schema } from '../../apollo/schema'

const apolloServer = new ApolloServer({
  schema,
  // playground: true, // access: http://localhost:3000/api/graphql
  playground: {
    settings: { 'request.credentials': 'include' },
  },
  debug: true,
  context(ctx) {
    return ctx
  },
  formatError(error) {
    console.error(util.inspect(error, { showHidden: false, depth: null }))
    return error
  },
})

const apolloHandler = apolloServer.createHandler({ path: '/api/graphql' })
const cors = microCors()
const corsHandler = cors((req, res) => (req.method === 'OPTIONS' ? res.end() : apolloHandler(req, res)))

export default corsHandler
// export default withApiAuthRequired(corsHandler)

// See: https://nextjs.org/docs/api-routes/api-middlewares
export const config = {
  api: {
    bodyParser: false,
  },
}
