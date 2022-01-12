import { InMemoryCache, Reference, makeVar } from '@apollo/client'
import { LiElement } from '../components/editor/slate-custom-types'

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

// export const editorValue = makeVar<LiElement[] | undefined>(undefined)

export const editorRootDict = makeVar<Record<string, LiElement> | undefined>(undefined)

export const editorCurrentSymbol = makeVar<string | undefined>(undefined)

export const testValue = makeVar<string>('this is a test')

// SSR 時沒有 localStorage
// export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem('token'))
