import util from 'util'
import dotenv from 'dotenv'
import express from 'express'
import expressJwt from 'express-jwt'
import cookieParser from 'cookie-parser'
import { verify } from 'jsonwebtoken'
import { applyMiddleware } from 'graphql-middleware'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import { makeExecutableSchema } from 'graphql-tools'
import faker from 'faker'
import { PrismaClient } from '@prisma/client'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { permissions } from './auth'

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string
  }
}

interface Token {
  userId: string
}

if (!process.env.BOT_EMAIL || !process.env.APP_SECRET) {
  throw new Error('Required variables missing in .env file')
}

export const APP_SECRET = process.env.APP_SECRET
export const BOT_EMAIL = process.env.BOT_EMAIL

// Initialize prisma client

export const prisma = new PrismaClient({
  // errorFormat: 'pretty',
  // log: ['query', 'info', 'warn'],
})

// Initialize express server

const app = express()

// Session-based auth, require cookie -> CORS problem
// See: https://github.com/maticzav/graphql-shield/blob/master/examples/with-graphql-nexus/src/lib/middlewares/authorization.js
// function authorization(): express.RequestHandler {
//   return function (req, res, next) {
//     const { token } = req.cookies
//     if (!token) return next()
//     try {
//       const verifiedToken = verify(token.replace('Bearer ', ''), APP_SECRET) as Token
//       req.userId = verifiedToken.userId
//       // const verifiedToken = verify(
//       //   token.replace('Bearer ', ''),
//       //   process.env.APP_SECRET || ""
//       // ) as Token
//       // req.userId = verifiedToken && verifiedToken.userId
//     } catch (error) {
//       res.clearCookie('token')
//     }
//     return next()
//   }
// }
// app.use(cookieParser())
// app.use(authorization())

// Token-based auth
// See: https://github.com/mandiwise/apollo-federation-auth-demo
//      https://github.com/auth0/express-jwt
app.use(
  expressJwt({
    secret: APP_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
  }),
)

const mocks = {
  ID: faker.random.uuid,
  Int: faker.random.number,
  Float: () => 22.1,
  // String: faker.lorem.sentence,
  String: () => faker.lorem.sentence(),
  DateTime: () => '2007-12-03T10:15:30Z',
}

// const logError: ApolloServerPlugin = {
//   requestDidStart(requestContext) {
//     return {
//       parsingDidStart() {
//         return (err) => {
//           if (err) console.error(err)
//         }
//       },
//       validationDidStart() {
//         return (err) => {
//           if (err) console.error(err)
//         }
//       },
//       executionDidStart() {
//         return (err) => {
//           if (err) console.error(err)
//         }
//       }
//     }
//   },
// }

const baseSchema = makeExecutableSchema({ typeDefs, resolvers })
const schema = applyMiddleware(baseSchema, permissions)
const server = new ApolloServer({
  // schema: baseSchema,
  schema,
  typeDefs,
  resolvers,
  // context: createContext,
  context: ({ req, res }) => ({ prisma, req, res }),
  // dataSources: {},
  playground: {
    settings: {
      'request.credentials': 'include', // for cookies
    },
  },
  // mocks,
  debug: true,
  // debug: false,
  formatError: err => {
    console.error(util.inspect(err, { showHidden: false, depth: null }))
    return err
  },
  // plugins: [ logError],
})

server.applyMiddleware({
  app,
  path: '/',

  // allow CORS (dev only)
  // cors: {
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // },
  // cors: true,
})

// module.exports = { app };
// export { app }
app.listen(4000, () => console.log(`Listening on http://localhost:4000/`))
