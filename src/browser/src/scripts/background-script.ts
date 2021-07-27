import { browser, Tabs } from 'webextension-polyfill-ts'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { WebpageCardQuery, WebpageCardQueryVariables, WebpageCardDocument } from '../../../web/apollo/query.graphql'

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

async function getWebpage(url: string): Promise<WebpageCardQuery> {
  const { data } = await client.query<WebpageCardQuery, WebpageCardQueryVariables>({
    query: WebpageCardDocument,
    variables: { url },
  })
  return data
}

// 網頁變動、開新tab時，依照該頁面的url調整icon的badge

async function onTabActivated(tab: Tabs.Tab): Promise<void> {
  if (tab.url) {
    const link = await getWebpage(tab.url)
    if (link.webpageCard.link) {
      browser.browserAction.setBadgeText({ text: '1' })
    } else {
      browser.browserAction.setBadgeText({ text: '0' })
    }
  }
  // deactivate icon
}

browser.tabs.onActivated.addListener(async info => {
  console.log('Tab ' + info.tabId + ' was activated')
  // console.log('Tab ' + info.tabId + ' was activated')
  // browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
  //   const tab = tabs[0] // Safe to assume there will only be one result
  //   console.log(tab.url)
  //   onTabActivated(tab)
  // }, console.error)
  const tabs = await browser.tabs.query({ currentWindow: true, active: true })
  const tab = tabs[0] // Safe to assume there will only be one result
  await onTabActivated(tab)
})

browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  if (changeInfo.url) {
    console.log('Tab: ' + tabId + ' URL changed to ' + changeInfo.url)
  }
})

// --- 點擊icon後，開啟一個新視窗，並載入對應的卡片

browser.browserAction.onClicked.addListener(async tab => {
  browser.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
    const tab = tabs[0] // Safe to assume there will only be one result
    console.log(tab.url)
  }, console.error)

  const params = new URLSearchParams({ u: tab.url ?? '' })

  const window = await browser.windows.create({
    // type: 'popup',
    url: browser.runtime.getURL('popup.html') + '?' + params.toString(),
    width: 500,
    height: 500,
    left: 100,
  })

  console.log('The normal window has been created')
})

// --- 相互溝通

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
  // Log statement if request.popupMounted is true
  // NOTE: this request is sent in `popup/component.tsx`
  if (request.popupMounted) {
    console.log('backgroundPage notified that Popup.tsx has mounted.')
    console.log('hello world')
  }
})
