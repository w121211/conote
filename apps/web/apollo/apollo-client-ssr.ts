import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { SchemaLink } from '@apollo/client/link/schema'
import { createCache } from './cache'
import { schema } from './schema'
import { ResolverContext } from './resolvers'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

/**
 * Only use for server-side rendering and should not call by client-side
 *
 * @see
 * https://github.com/vardhanapoorv/epl-nextjs-app
 * https://www.apollographql.com/blog/building-a-next-js-app-with-apollo-client-slash-graphql/
 * https://github.com/apollographql/apollo-cache-persist/blob/master/examples/web/src/index.tsx
 *
 */
export function getApolloClientSSR(
  initialState: any = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
  context?: ResolverContext,
): ApolloClient<NormalizedCacheObject> {
  if (typeof window !== 'undefined')
    throw new Error(
      'getApolloClientSSR() only use for server-side rendering and should not call by client-side',
    )

  const _apolloClient =
    apolloClient ??
    new ApolloClient<NormalizedCacheObject>({
      ssrMode: true,
      link: new SchemaLink({ schema, context }),
      cache: createCache(),
    })

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
