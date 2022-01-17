import { ApolloClient, InMemoryCache } from '@apollo/client'
import browser, { Tabs } from 'webextension-polyfill'
// import { cache } from '../popup/cache'
import { LinkDocument, LinkQuery, LinkQueryVariables } from '../../../web/apollo/query.graphql'

const cache = new InMemoryCache()
const client = new ApolloClient({
  cache: cache,
  uri: 'http://localhost:3000/api/graphql',
  credentials: 'omit', // avoid CORS, @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSNotSupportingCredentials
})

async function getLink(url: string): Promise<LinkQuery> {
  const { data } = await client.query<LinkQuery, LinkQueryVariables>({
    query: LinkDocument,
    variables: { url },
  })
  return data
}

/**
 * change icon's badge when url changed, new tab opened
 */
async function onTabActivated(tab: Tabs.Tab): Promise<void> {
  if (tab.url) {
    const link = await getLink(tab.url)
    if (link.link) {
      browser.browserAction.setBadgeText({ text: '1' })
    } else {
      browser.browserAction.setBadgeText({ text: '0' })
    }
  }
  // deactivate icon
}

browser.tabs.onActivated.addListener(async info => {
  console.log('Tab ' + info.tabId + ' was activated')
  // browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
  //   const tab = tabs[0] // Safe to assume there will only be one result
  //   console.log(tab.url)
  //   onTabActivated(tab)
  // }, console.error)
  const tabs = await browser.tabs.query({ currentWindow: true, active: true })
  const tab = tabs[0] // Safe to assume there will only be one result
  await onTabActivated(tab)
})

// browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
//   if (changeInfo.url) {
//     console.log('Tab: ' + tabId + ' URL changed to ' + changeInfo.url)
//   }
// })

/**
 * user click icon: get current tab's url, title and open a new window to navigate to conote's site
 */
browser.browserAction.onClicked.addListener(async tab => {
  console.log(tab)

  const params = new URLSearchParams({
    url: tab.url ?? '',
    title: tab.title ?? '',
  })
  // const tabUrl = encodeURIComponent(tab.url ?? '')

  const window = await browser.windows.create({
    // type: 'popup',
    // url: browser.runtime.getURL('popup.html') + '?' + params.toString(),
    // url: 'http://localhost:3000/card/' + encodeUri,
    url: `${process.env.APP_BASE_URL}/card?${params.toString()}`,
    // url: `${process.env.APP_BASE_URL}/card/${tabUrl}`,
    width: 500,
    height: 900,
    left: 100,
  })

  console.log('The normal window has been created')
})

// console.log(process.env.APP_BASE_URL)

/**
 * 相互溝通 Listen for messages sent from other parts of the extension
 */
// browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
//   // Log statement if request.popupMounted is true
//   // NOTE: this request is sent in `popup/component.tsx`
//   if (request.popupMounted) {
//     console.log('backgroundPage notified that Popup.tsx has mounted.')
//     console.log('hello world')
//   }
// })

// /*
// Create a menu item for each installed search engine.
// The ID and title are both set to the search engine's name.
// */
// function createMenuItem(engines) {
//   for (let engine of engines) {
//     browser.menus.create({
//       id: engine.name,
//       title: engine.name,
//       contexts: ['selection'],
//     })
//   }
// }

// browser.search.get().then(createMenuItem)

// /*
// Search using the search engine whose name matches the
// menu item's ID.
// */
// browser.menus.onClicked.addListener((info, tab) => {
//   // if (info.menuItemId.)

//   browser.search.search({
//     query: info.selectionText ?? '',
//     engine: info.menuItemId,
//   })
// })

browser.menus.create(
  {
    id: 'conote-rate',
    // title: browser.i18n.getMessage('menuItemRemoveMe'),
    title: 'rate',
    contexts: ['selection'], // show only if selection exist
  },
  () => {
    console.log('menu created')
  },
)

/**
 * user click menu, get user's selection
 */
browser.menus.onClicked.addListener(async (info, tab) => {
  console.log(info, tab)
  if (info.menuItemId === 'conote-rate') {
    console.log(info, tab)
    console.log(info.selectionText, info.pageUrl)
  }

  const params = new URLSearchParams({
    url: info.pageUrl ?? '',
    text: info.selectionText ?? '',
  })
  // const tabUrl = encodeURIComponent(tab.url ?? '')

  const window = await browser.windows.create({
    // type: 'popup',
    // url: browser.runtime.getURL('popup.html') + '?' + params.toString(),
    // url: 'http://localhost:3000/card/' + encodeUri,
    url: `${process.env.APP_BASE_URL}/lab/rate?${params.toString()}`,
    // url: `${process.env.APP_BASE_URL}/card/${tabUrl}`,
    width: 500,
    height: 900,
    left: 100,
  })

  // browser.search.search({
  //   query: info.selectionText ?? '',
  //   engine: info.menuItemId,
  // })
})
