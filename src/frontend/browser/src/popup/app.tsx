import { browser, Storage } from 'webextension-polyfill-ts'
import React, { useCallback, useEffect, useState } from 'react'
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import { CachePersistor, PersistentStorage, LocalStorageWrapper } from 'apollo3-cache-persist'
import { typeDefs } from '../graphql/resolvers'
import { cache } from './cache'
import { FetchCard } from './card-page'
import { AutoLogin } from './login'
import './app.css'

class BrowserStorageWrapper implements PersistentStorage {
  // See: https://github.com/apollographql/apollo-cache-persist/blob/master/src/storageWrappers/LocalStorageWrapper.ts
  private storage

  constructor(storage: Storage.LocalStorageArea) {
    this.storage = storage
  }

  async getItem(key: string): Promise<string | null> {
    const item = await this.storage.get(key)
    return item[key]
  }

  removeItem(key: string): void | Promise<void> {
    return this.storage.remove(key)
  }

  setItem(key: string, value: string): void | Promise<void> {
    return this.storage.set({ key: value })
  }
}

export function App(): JSX.Element {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()
  const [persistor, setPersistor] = useState<CachePersistor<NormalizedCacheObject>>()

  useEffect(() => {
    async function init() {
      // const cache = new InMemoryCache();
      const newPersistor = new CachePersistor({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
        // storage: new BrowserStorageWrapper(browser.storage.local),
        debug: true,
        trigger: 'write',
      })
      await newPersistor.restore()

      const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
        cache,
        uri: 'http://localhost:4000/graphql',
        headers: {
          // authorization: localStorage.getItem('token') || '',
          'client-name': 'Conote[Extension]',
          'client-version': '0.1.0',
        },
        // TODO: 需設為'include'，否則cookies不會被儲存（不確定正式時是否需要）
        // Ref:
        // - https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
        // - https://github.com/apollographql/apollo-client/issues/4190
        credentials: 'include',
        // credentials: 'same-origin',
        resolvers: {},
        typeDefs,
      })

      setPersistor(newPersistor)
      setClient(client)
    }

    init().catch(console.error)
    browser.runtime.sendMessage({ popupMounted: true })
  }, [])

  const clearCache = useCallback(() => {
    if (!persistor) return
    persistor.purge()
  }, [persistor])

  const reload = useCallback(() => {
    window.location.reload()
  }, [])

  console.log(window.location.href)

  if (!client) {
    return <h2>Initializing app...</h2>
  }

  const params = new URLSearchParams(new URL(window.location.href).search)
  const url = params.get('u')
  if (url === null) {
    return <h2>Require a url</h2>
  }

  return (
    <ApolloProvider client={client}>
      <AutoLogin />
      <FetchCard url={url} />
      {/* <button onClick={clearCache}>Clear cache</button>
      <button onClick={reload}>Reload page</button> */}
    </ApolloProvider>
  )
}
