import browser, { Storage } from 'webextension-polyfill'
import React, { useCallback, useEffect, useState } from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, NormalizedCacheObject } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
// import { CachePersistor, PersistentStorage, LocalStorageWrapper } from 'apollo3-cache-persist'
// import { AppState, useAuth0 } from '@auth0/auth0-react'
import { cache } from './cache'
import { useMeQuery, MeQuery } from '../../../web/apollo/query.graphql'
import { NotePage } from './note-page'
// import '../../../web/style/global.scss'
// import './app.css'

// class BrowserStorageWrapper implements PersistentStorage {
//   // See: https://github.com/apollographql/apollo-cache-persist/blob/master/src/storageWrappers/LocalStorageWrapper.ts
//   private storage

//   constructor(storage: Storage.LocalStorageArea) {
//     this.storage = storage
//   }

//   async getItem(key: string): Promise<string | null> {
//     const item = await this.storage.get(key)
//     return item[key]
//   }

//   removeItem(key: string): void | Promise<void> {
//     return this.storage.remove(key)
//   }

//   setItem(key: string, value: string): void | Promise<void> {
//     return this.storage.set({ key: value })
//   }
// }

// const onRedirectCallback = (appState: AppState) => {
//   // If using a Hash Router, you need to use window.history.replaceState to
//   // remove the `code` and `state` query parameters from the callback url.
//   window.history.replaceState({}, document.title, window.location.pathname)
//   // history.replace((appState && appState.returnTo) || window.location.pathname)
// }

const Protected = ({ children }: { children: React.ReactNode }): JSX.Element | null => {
  const { data, refetch } = useMeQuery({ fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' })

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault()
    browser.tabs.create({
      url: 'http://localhost:3000/api/auth/login',
    })
    // refetch()
  }
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    const onUpdate = (tab: any) => {
      browser.tabs.goBack()
    }
    browser.tabs.update({
      url: 'http://localhost:3000/api/auth/logout',
    })

    // refetch()
  }

  if (data?.me) {
    console.log(data.me)
    // return (
    //   <span
    //     onClick={e => {
    //       handleLogout(e)
    //     }}
    //   >
    //     Logout
    //   </span>
    // )
    return <>{children}</>
  }
  return (
    <div>
      <span
        onClick={e => {
          handleLogin(e)
        }}
      >
        Login
      </span>{' '}
      Required
    </div>
  )
}

export const App = (): JSX.Element => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()
  // const [persistor, setPersistor] = useState<CachePersistor<NormalizedCacheObject>>()

  // console.log('test')
  useEffect(() => {
    async function init() {
      // const newPersistor = new CachePersistor({
      //   cache,
      //   storage: new LocalStorageWrapper(localStorage),
      //   // storage: new LocalStorageWrapper(window.localStorage),
      //   // storage: new BrowserStorageWrapper(browser.storage.local),
      //   debug: true,
      //   trigger: 'write',
      // })
      // await newPersistor.restore()

      const httpLink = createHttpLink({
        uri: 'http://localhost:3000/api/graphql',
      })

      const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('token')
        // return the headers to the context so httpLink can read them
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        }
      })

      const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
        cache,
        link: authLink.concat(httpLink),
        // uri: 'http://localhost:3000/api/graphql',
        // headers: {
        //   authorization: localStorage.getItem('token') || '', // token-based auth
        //   'client-name': 'Conote[Extension]',
        //   'client-version': '0.1.0',
        // },
        // TODO: 需設為'include'，否則cookies不會被儲存 -> 但這會有Cross-origin問題
        // Ref:
        // - https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        // - https://github.com/apollographql/apollo-client/issues/4190
        // credentials: 'include',
        // credentials: 'same-origin',
        // resolvers: {},
        // typeDefs,
      })

      // setPersistor(newPersistor)
      setClient(client)
    }

    init().catch(console.error)
    browser.runtime.sendMessage({ popupMounted: true })
  }, [])

  // const clearCache = useCallback(() => {
  //   if (!persistor) return
  //   persistor.purge()
  // }, [persistor])

  const reload = useCallback(() => {
    window.location.reload()
  }, [])

  if (!client) {
    return <h2>Initializing app...</h2>
  }
  // console.log('test')
  return (
    <ApolloProvider client={client}>
      {/* <Protected> */}
      <NotePage />
      {/* </Protected> */}
    </ApolloProvider>
  )
  // <Auth0Provider
  //   domain={process.env.REACT_APP_DOMAIN as string}
  //   clientId={process.env.REACT_APP_CLIENT_ID as string}
  //   // redirectUri={window.location.origin}
  //   redirectUri="chrome-extension://cidlgggnhfkmlodkoneabjiiddokpecm/popup.html"
  //   // audience={process.env.REACT_APP_AUDIENCE}
  //   // scope="read:users"
  //   // onRedirectCallback={onRedirectCallback}
  // >
  // <SignIn />
  // <button onClick={clearCache}>Clear cache</button>
  // <button onClick={reload}>Reload page</button>
  // </Auth0Provider>
}

// function SignIn(): JSX.Element {
//   const { isLoading, isAuthenticated, user, loginWithRedirect, logout, getAccessTokenSilently } =
//     useAuth0<{
//       name: string
//       email: string
//     }>()

//   // getAccessTokenSilently().then(e => {
//   //   console.log(e)
//   // })

//   if (isLoading) {
//     return <div>Loading</div>
//   }
//   return (
//     <div>
//       {isAuthenticated ? (
//         <div>
//           <span id="hello">Hello, {user?.email}!</span>{' '}
//           <button
//             onClick={() => logout({ returnTo: 'chrome-extension://cidlgggnhfkmlodkoneabjiiddokpecm/popup.html' })}
//           >
//             logout
//           </button>
//         </div>
//       ) : (
//         <button id="login" onClick={() => loginWithRedirect()}>
//           login
//         </button>
//       )}
//     </div>
//   )
// }
