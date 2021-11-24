/**
 * @see
 * https://github.com/vardhanapoorv/epl-nextjs-app
 * https://www.apollographql.com/blog/building-a-next-js-app-with-apollo-client-slash-graphql/
 * https://github.com/apollographql/apollo-cache-persist/blob/master/examples/web/src/index.tsx
 */
import { useMemo } from 'react'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { createCache } from './cache'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

export type ResolverContext = {
  // req?: IncomingMessage
  // res?: ServerResponse
  req: NextApiRequest
  res: NextApiResponse
}

function createIsomorphLink(context?: ResolverContext) {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SchemaLink } = require('@apollo/client/link/schema')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { schema } = require('./schema')
    return new SchemaLink({ schema, context })
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { HttpLink } = require('@apollo/client')
    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    })
  }
}

function createApolloClient(context?: ResolverContext) {
  return new ApolloClient<NormalizedCacheObject>({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(context),
    cache: createCache(),
  })
}

export function initializeApollo(
  initialState: any = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
  context?: ResolverContext,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(context)

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
    // _apolloClient.cache.restore(initialState)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function useApollo(initialState: any): ApolloClient<NormalizedCacheObject> {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
