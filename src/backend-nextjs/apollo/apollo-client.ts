// See: https://github.com/vardhanapoorv/epl-nextjs-app
//      https://www.apollographql.com/blog/building-a-next-js-app-with-apollo-client-slash-graphql/
// import { IncomingMessage, ServerResponse } from 'http'
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

// import React from 'react';
// import { render } from 'react-dom';
// import { ApolloProvider } from 'react-apollo';
// import { ApolloClient } from 'apollo-client';
// import { ApolloLink } from 'apollo-link';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
// import { setContext } from 'apollo-link-context';
// import { CachePersistor } from 'apollo-cache-persist';
// import createAuth0Client from '@auth0/auth0-spa-js';

// /* Make sure auth0 client is available before AuthProvider gets assigned */
// createAuth0Client({
//   domain: /* YOUR DOMAIN */,
//   client_id:  /* YOUR CLIENT ID */,
//   audience: /* YOUR AUDIENCE */,
//   redirect_uri: /* YOUR CALLBACK URL */,
// }).then((auth0) => {
//   const auth0Client = auth0;

//   /* Set URI for all Apollo GraphQL requests (backend api) */
//   const httpLink = new HttpLink({
//     uri: /* BACKEND API URL */
//     fetchOptions: { credentials: 'same-origin' },
//   });

//   /* Set in-memory token to reduce async requests */
//   let token;

//   /* Create Apollo Link to supply token with either
//    * in-memory ref or auth0 req'ed token or redirect (built into
//    * getTokenSilently
//   */
//   const withTokenLink = setContext(async () => {
//     // return token if there
//     if (token) return { auth0Token: token };
//     // else check if valid token exists with client already and set if so
//     const newToken = await auth0Client.getTokenSilently();
//     token = newToken;
//     return { auth0Token: newToken };
//   });

//   /* Create Apollo Link to supply token in auth header with every gql request */
//   const authLink = setContext((_, { headers, auth0Token }) => ({
//     headers: {
//       ...headers,
//       ...(auth0Token ? { authorization: `Bearer ${auth0Token}` } : {}),
//     },
//   }));

//   /* Create Apollo Link array to pass to Apollo Client */
//   const link = ApolloLink.from([withTokenLink, authLink, httpLink]);

//   /* Set up local cache */
//   const cache = new InMemoryCache({ fragmentMatcher });

//   /* Create Apollo Client */
//   const client = new ApolloClient({
//     link,
//     cache,
//   });

//   /* Create persistor to handle persisting data from local storage on refresh, etc */
//   const persistor = new CachePersistor({ cache, storage: window.localStorage });

//   /* Create root render function */
//   const renderApp = (Component) => {
//     render(
//         <ApolloProvider client={client}>
//           <AuthenticationProvider
//             domain="YOUR DOMAIN"
//             clientId="YOUR CLIENT ID"
//             audience="YOUR AUDIENCE"
//             redirectUri="YOUR REDIRECT URI"
//             auth0Client="AUTH 0 CLIENT CREATED ABOVE"
//           >
//             <Component />
//           </AuthenticationProvider>
//         </ApolloProvider>,
//       document.getElementById('root'),
//     );
//   };

//   /* Render React App after hydrating from local storage */
//   persistor.restore().then(() => {
//     renderApp(App);
//   });
// });
