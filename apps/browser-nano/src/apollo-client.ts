import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'

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
