import { ApolloError } from '@apollo/client'

/**
 * Client side handler
 * Reference https://www.apollographql.com/docs/react/data/error-handling/#retrying-operations
 *
 * TODO:
 *
 */
function handleApolloError({ graphQLErrors }: ApolloError) {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          break
      }
    }
  }
}
