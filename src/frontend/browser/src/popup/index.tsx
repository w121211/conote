/**
 * 點擊extension-icon時彈出目前active-tab頁面所對應的note
 * 1. 取得active-tab url
 * 2. query note by url
 * 3. show note
 * 4. edit note / save
 * 5. highlight <-> note
 *
 * Try:
 * 1. 直接在這裡用Apollo client，試著call-server
 * 2. 嘗試用web的component，試著call-server
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, NormalizedCacheObject, gql, InMemoryCache, useQuery } from '@apollo/client';
import { browser } from 'webextension-polyfill-ts';
import { Popup } from './component';
import '../scss/app.scss';
// import * as LaunchDetailTypes from '../pages/__generated__/LaunchDetails';

const ANCHOR_FRAGMENT = gql`
  fragment anchorFragment on Anchor {
    __typename
    id
    userId
    cocardId
    ocardId
    selfcardId
  }
`;

const ANCHOR = gql`
  query anchor($id: ID!) {
    anchor(id: $id) {
      ...anchorFragment
    }
  }
  ${ANCHOR_FRAGMENT}
`;

// async function fetcher(graphQLParameters: _graphiqlModule.GraphQLParams): Promise<string> {
//   const response = await fetch('/.api/graphql', {
//       method: 'POST',
//       body: JSON.stringify(graphQLParameters),
//       credentials: 'include',
//       headers: new Headers({ 'x-requested-with': 'Sourcegraph GraphQL Explorer' }),
//   })
//   const responseBody = await response.text()
//   try {
//       return JSON.parse(responseBody)
//   } catch {
//       return responseBody
//   }
// }

function Query() {
  const { error, data } = useQuery<{ anchor: { id: string } }, { id: string }>(ANCHOR, {
    variables: { id: '123' },
  });
  if (error) {
    console.log(error);
  } else if (data) {
    console.log(data);
  }
  return null;
}

const cache: InMemoryCache = new InMemoryCache();

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
  // credentials: "same-origin",
  // resolvers: {},
  // resolvers,
  // typeDefs,
});

browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
  const tab = tabs[0];
  console.log(tab.url);
  // ReactDOM.render(<Popup />, document.getElementById('popup'));

  ReactDOM.render(
    // <TextEditor />
    <ApolloProvider client={client}>
      <Query />
    </ApolloProvider>,
    document.getElementById('root'),
  );
});

console.log('this is a test');
