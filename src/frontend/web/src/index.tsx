import dotenv from 'dotenv'
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, ApolloProvider, NormalizedCacheObject, InMemoryCache } from '@apollo/client'
import { typeDefs } from './graphql/resolvers'
import { cache } from './cache'
import { Pages } from './pages'
// import { DemoPages } from './demo'
// import './index.less'

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  // uri: process.env.REACT_APP_API_URL,
  uri: 'http://localhost:4000/graphql',
  // uri: '/api',
  headers: {
    // authorization: localStorage.getItem('token') || '',
    'client-name': 'conote[web]',
    'client-version': '0.1.0',
  },
  // TODO: 需設為'include'，否則cookies不會被儲存（不確定正式時是否需要）
  // Ref:
  // - https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
  // - https://github.com/apollographql/apollo-client/issues/4190
  credentials: 'include',
  // credentials: "same-origin",
  resolvers: {},
  // resolvers,
  typeDefs,
})

ReactDOM.render(
  // <TextEditor />
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>,
  document.getElementById('root'),
)
