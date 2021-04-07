import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import { browser } from 'webextension-polyfill-ts'
import { typeDefs } from '../graphql/resolvers'
import { cache } from './cache'
import { CardPage } from '../components/card'
// import '../scss/app.scss'
// import * as LaunchDetailTypes from '../pages/__generated__/LaunchDetails';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  // cache: new InMemoryCache(),
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
  // credentials: "same-origin",
  resolvers: {},
  typeDefs,
})

browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
  const tab = tabs[0]
  console.log(tab.url)

  ReactDOM.render(
    // <h1>Hello World</h1>,
    <ApolloProvider client={client}>
      <CardPage />
    </ApolloProvider>,
    document.getElementById('root'),
  )
})
