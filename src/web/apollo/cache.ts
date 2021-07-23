import { InMemoryCache, Reference, makeVar } from '@apollo/client'
import { LiElement } from '../lib/bullet/editor/slate-custom-types'

export function createCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // editorValue: {
          //   // value:
          // },
          // isLoggedIn: {
          //   read() {
          //     return isLoggedInVar()
          //   },
          // },
          latestCards: {
            keyArgs: false,
            merge(existing: Reference[] = [], incoming: Reference[]) {
              const filtered = existing.filter(e => {
                return incoming.find(f => e.__ref === f.__ref) === undefined
              })
              return [...filtered, ...incoming]
              // return [...existing, ...incoming]
            },
          },
        },
      },
    },
  })
}

export const editorValue = makeVar<LiElement[] | undefined>(undefined)

export const testValue = makeVar<string>('this is a test')

// SSR時沒有localStorage
// export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem('token'))
