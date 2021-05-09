import { browser } from 'webextension-polyfill-ts'
import { ApolloClient, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache()

const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  uri: 'http://localhost:4000/',

  // Provide some optional constructor fields
  name: 'react-web-client',
  version: '1.3',
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

function getLink() {}

function getCard() {}

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
  // Log statement if request.popupMounted is true
  // NOTE: this request is sent in `popup/component.tsx`
  if (request.popupMounted) {
    console.log('backgroundPage notified that Popup.tsx has mounted.')
    console.log('hello world')
  }
})

browser.browserAction.setBadgeText({
  text: '1',
})

browser.browserAction.onClicked.addListener(function (tab) {
  browser.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
    const tab = tabs[0] // Safe to assume there will only be one result
    console.log(tab.url)
  }, console.error)

  const params = new URLSearchParams({ u: tab.url ?? '' })

  browser.windows.create({
    // type: 'popup',
    url: browser.runtime.getURL('popup.html') + '?' + params.toString(),
    width: 500,
    height: 500,
    left: 100,
  })
})

// const creating = browser.windows.create({
//   type: 'popup',
//   url: browser.runtime.getURL('popup.html'),
//   width: 500,
//   height: 500,
// })

// creating.then(() => {
//   console.log('The normal window has been created')
// })

browser.tabs.onActivated.addListener(info => {
  console.log('Tab ' + info.tabId + ' was activated')
  // console.log('Tab ' + info.tabId + ' was activated')
  browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
    const tab = tabs[0] // Safe to assume there will only be one result
    console.log(tab.url)
  }, console.error)
})

browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  if (changeInfo.url) {
    console.log('Tab: ' + tabId + ' URL changed to ' + changeInfo.url)
  }
})
