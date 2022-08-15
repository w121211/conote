import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

// const prismaClientPropertyName = `__prevent-name-collision__prisma`

// type GlobalThisWithPrismaClient = typeof globalThis & {
//   [prismaClientPropertyName]: PrismaClient
// }

// const getPrismaClient = (): PrismaClient => {
//   if (process.env.NODE_ENV === 'production') {
//     return new PrismaClient()
//   } else {
//     const newGlobalThis = globalThis as GlobalThisWithPrismaClient
//     if (!newGlobalThis[prismaClientPropertyName]) {
//       console.log('Creating global prisma client')
//       newGlobalThis[prismaClientPropertyName] = new PrismaClient()
//     }
//     return newGlobalThis[prismaClientPropertyName]
//   }
// }

/**
 * Important! To avoid CORS errors, server side needs to set 'Access-Control-Allow-Origin *'
 *
 */
const getApolloClient = (): ApolloClient<NormalizedCacheObject> => {
  const cache = new InMemoryCache()
  const client = new ApolloClient({
    cache: cache,
    uri: `${process.env.APP_BASE_URL}/api/graphql`,

    // Avoid CORS. See https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials
    credentials: 'omit',
  })

  return client
}

const apollo = getApolloClient()

export default apollo
