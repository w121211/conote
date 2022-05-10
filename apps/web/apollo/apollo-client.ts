import { NextApiRequest, NextApiResponse } from 'next'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { createCache } from './cache'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

export type ResolverContext = {
  req: NextApiRequest
  res: NextApiResponse
}

function createApolloClient() {
  const client = new ApolloClient({
    cache: createCache(),
    uri: '/api/graphql',
    credentials: 'same-origin',
  })
  return client
}

/**
 * For cases require a standalone apollo-client
 */
export function getApolloClient(): ApolloClient<NormalizedCacheObject> {
  return apolloClient ?? createApolloClient()
}
