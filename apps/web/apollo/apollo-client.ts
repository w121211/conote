import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { createCache } from './cache'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

function createApolloClient() {
  if (
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    (window as any).IS_STORYBOOK
  ) {
    return new ApolloClient({
      cache: createCache(),
      uri: 'http://localhost:3000/api/graphql',
    })
  }

  // Default behavior
  return new ApolloClient({
    cache: createCache(),
    uri: '/api/graphql',
    credentials: 'same-origin',
  })
}

/**
 * For cases require a standalone apollo-client
 */
export function getApolloClient(): ApolloClient<NormalizedCacheObject> {
  return apolloClient ?? createApolloClient()
}
