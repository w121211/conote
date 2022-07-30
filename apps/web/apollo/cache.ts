import { InMemoryCache, Reference } from '@apollo/client'

export function createCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // isLoggedIn: {
          //   read() {
          //     return isLoggedInVar()
          //   },
          // },
          latestCardDigests: {
            keyArgs: false,
            merge(existing: Reference[] = [], incoming: Reference[]) {
              // const filtered = existing.filter(e => {
              //   return incoming.find(f => e.__ref === f.__ref) === undefined
              // })
              // return [...filtered, ...incoming]
              return [...existing, ...incoming]
            },
          },
        },
      },
    },
  })
}
