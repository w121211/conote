import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { browser } from 'webextension-polyfill-ts'
import { typeDefs } from '../graphql/resolvers'
import { cache } from './cache'
// import { CardPage } from '../components/card'
// import '../scss/app.scss'
// import * as LaunchDetailTypes from '../pages/__generated__/LaunchDetails';

function Resolved({ data }: { data: { id: number } }): JSX.Element {
  return <h1>id: {data.id}</h1>
}

function Query({ data }: { data?: { id: number } }): JSX.Element | null {
  if (data === undefined) {
    browser.runtime.sendMessage({ msg: 'hello~' })
    return null
  }
  return <Resolved data={data} />
}

/**
 * 因為這是要用於content-script，因為CORS，無法直接使用apollo-client，要透過background-page呼叫graphql
 * 流程：content-page.send-message(...) -> background-page -> graphql -> content-page.on-message(...)
 * CORS ref:
 * https://www.chromium.org/Home/chromium-security/extension-content-script-fetches#TOC-2.-Avoid-Cross-Origin-Fetches-in-Content-Scripts
 */
export function SiderApp(): JSX.Element {
  browser.runtime.onMessage.addListener(function (m) {
    console.log('In content script, received message from background script: ')
    console.log(m.greeting)
  })
  return <Query />
}
