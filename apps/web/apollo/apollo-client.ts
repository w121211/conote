import { useMemo } from 'react'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { createCache } from './cache'

// let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

// function createApolloClient() {
//   if (
//     process.env.NODE_ENV === 'development' &&
//     typeof window !== 'undefined' &&
//     (window as any).IS_STORYBOOK
//   ) {
//     // On development && is testing on storybook
//     return new ApolloClient({
//       cache: createCache(),
//       uri: 'http://localhost:3000/api/graphql',
//     })
//   }
//   if (typeof window === 'undefined') {
//     const { schema } = require('./schema')
//     const { SchemaLink } = require('@apollo/client/link/schema')

//     // On server side (SSR), requires the absolute URL
//     return new ApolloClient({
//       ssrMode: true,
//       cache: createCache(),
//       // uri: 'http://localhost:3000/api/graphql',
//       link: new SchemaLink({ schema }),
//     })
//   }

//   // Default behavior
//   return new ApolloClient({
//     cache: createCache(),
//     uri: '/api/graphql',
//     credentials: 'same-origin',
//   })
// }

// /**
//  * For cases require a standalone apollo-client
//  */
// export function getApolloClient(): ApolloClient<NormalizedCacheObject> {
//   return apolloClient ?? createApolloClient()
// }

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

export type ResolverContext = {
  req: NextApiRequest
  res: NextApiResponse
}

// /**
//  * BUG: Seems
//  * - https://github.com/apollographql/apollo-client/issues/6621
//  */
// function createIsomorphLink(context?: ResolverContext) {
//   if (typeof window === 'undefined') {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const { SchemaLink } = require('@apollo/client/link/schema')
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const schema = require('./schema')

//     return new SchemaLink({ schema, context })
//   } else {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const { HttpLink } = require('@apollo/client')

//     return new HttpLink({
//       uri: '/api/graphql',
//       credentials: 'same-origin',
//     })
//   }
// }

function createApolloClient() {
  return new ApolloClient<NormalizedCacheObject>({
    cache: createCache(),
    uri: '/api/graphql',
    credentials: 'same-origin',
  })
}

export function getApolloClient(
  initialState: any = null,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  if (apolloClient === undefined) apolloClient = _apolloClient

  return _apolloClient
}

/**
 * Memo the initialState
 */
export function useApolloClientInitial(
  initialState: any,
): ApolloClient<NormalizedCacheObject> {
  const store = useMemo(() => getApolloClient(initialState), [initialState])
  return store
}
