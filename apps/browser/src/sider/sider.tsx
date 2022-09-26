import * as React from 'react'
// import { cache } from './cache'
// import { CardPage } from '../components/card'
// import '../scss/app.scss'
// import * as LaunchDetailTypes from '../pages/__generated__/LaunchDetails';

function Resolved({ data }: { data: { id: number } }): JSX.Element {
  return <h1>id: {data.id}</h1>
}

function Query({ data }: { data?: { id: number } }): JSX.Element | null {
  if (data === undefined) {
    chrome.runtime.sendMessage({ msg: 'hello~' })
    return null
  }
  return <Resolved data={data} />
}

/**
 * For content-script. CORS restricts the use of apollo-client to directly call API, therefore need to call graphql through background-page
 * - Flow: content-page.send-message(...) -> background-page -> graphql -> content-page.on-message(...)
 * - Reference https://www.chromium.org/Home/chromium-security/extension-content-script-fetches#TOC-2.-Avoid-Cross-Origin-Fetches-in-Content-Scripts
 */
export function SiderApp(): JSX.Element {
  chrome.runtime.onMessage.addListener(function (m) {
    console.log('In content script, received message from background script: ')
    console.log(m.greeting)
  })
  return <Query />
}
