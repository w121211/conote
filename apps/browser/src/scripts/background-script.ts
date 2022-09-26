/**
 * TODO: webextension-polyfill is no longer need, since firefox support 'chrome' namespace.
 *       See https://github.com/mozilla/webextension-polyfill/issues/329#issuecomment-1188822881
 */
// import browser from 'webextension-polyfill'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
// // import {
// //   LinkDocument,
// //   LinkQuery,
// //   LinkQueryVariables,
// // } from '../../../web/apollo/query.graphql'
// // import apolloClient from '../apollo-client'

// // const RateMenu = {
// //   id: 'conote-menu-rate',

// //   setup(): void {
// //     browser.contextMenus.create(
// //       {
// //         id: this.id,
// //         // title: browser.i18n.getMessage('menuItemRemoveMe'),
// //         title: 'rate',
// //         contexts: ['selection'], // show only if selection exist
// //       },
// //       () => {
// //         console.log('menu created')
// //       },
// //     )

// //     /**
// //      * when user click menu, get user's selection
// //      *
// //      */
// //     browser.contextMenus.onClicked.addListener(async (info, tab) => {
// //       console.log(info, tab)
// //       if (info.menuItemId === 'conote-rate') {
// //         console.log(info, tab)
// //         console.log(info.selectionText, info.pageUrl)
// //       }

// //       const params = new URLSearchParams({
// //         url: info.pageUrl ?? '',
// //         text: info.selectionText ?? '',
// //       })
// //       // const tabUrl = encodeURIComponent(tab.url ?? '')

// //       const window = await browser.windows.create({
// //         // type: 'popup',
// //         // url: browser.runtime.getURL('popup.html') + '?' + params.toString(),
// //         // url: 'http://localhost:3000/card/' + encodeUri,
// //         url: `${process.env.APP_BASE_URL}/lab/rate?${params.toString()}`,
// //         // url: `${process.env.APP_BASE_URL}/card/${tabUrl}`,
// //         width: 500,
// //         height: 900,
// //         left: 100,
// //       })

// //       // browser.search.search({
// //       //   query: info.selectionText ?? '',
// //       //   engine: info.menuItemId,
// //       // })
// //     })
// //   },
// // }

// // const SearchMenu = {
// //   id: 'conote-menu-search',

// //   setup(): void {
// //     browser.contextMenus.create(
// //       {
// //         id: this.id,
// //         title: 'Search [[%s]]',
// //         contexts: ['selection'], // show only if selection exist
// //       },
// //       // () => {
// //       //   console.log('menu created')
// //       // },
// //     )

// //     browser.contextMenus.onClicked.addListener(async (info, tab) => {
// //       // console.log(info, tab)
// //       // if (info.menuItemId === this.id) {
// //       //   console.log(info, tab)
// //       //   console.log(info.selectionText, info.pageUrl)
// //       // }

// //       if (info.menuItemId === this.id && info.selectionText) {
// //         // const params = new URLSearchParams({
// //         //   url: info.pageUrl ?? '',
// //         //   text: info.selectionText ?? '',
// //         // })
// //         // const tabUrl = encodeURIComponent(tab.url ?? '')
// //         const window = await browser.windows.create({
// //           // type: 'popup',
// //           // url: `${process.env.APP_BASE_URL}/card/${tabUrl}`,
// //           url: encodeURIComponent(
// //             `${process.env.APP_BASE_URL}/card/[[${info.selectionText}]]`,
// //           ),
// //           width: 500,
// //           height: 900,
// //           left: 100,
// //         })
// //       }
// //     })
// //   },
// // }

// // // let menuId: number | string | null = null // ID to manage the context menu entry

// // // const menuClickHandler = (clickData: Menus.OnClickData, tab: Tabs.Tab) => {
// // //   console.log('Selected ' + clickData.selectionText + ' in ' + tab.url)
// // // }

// // // browser.runtime.onMessage.addListener((request: { request: string; selection: string }) => {
// // //   console.log(request)
// // //   if (request.request === 'updateContextMenu') {
// // //     const selection = request.selection
// // //     if (selection === '') {
// // //       // Remove the context menu entry
// // //       if (menuId !== null) {
// // //         browser.menus.remove(menuId)
// // //         menuId = null // Invalidate entry now to avoid race conditions
// // //       } // else: No contextmenu ID, so nothing to remove
// // //     } else {
// // //       // Add/update context menu entry
// // //       const options: Menus.UpdateUpdatePropertiesType = {
// // //         title: selection,
// // //         contexts: ['selection'],
// // //         onclick: menuClickHandler,
// // //       }
// // //       if (menuId !== null) {
// // //         console.log('browser.menus.update(menuId, options)')
// // //         browser.menus.update(menuId, options)
// // //       } else {
// // //         console.log('menuId = browser.menus.create(options)')
// // //         // Create new menu, and remember the ID
// // //         menuId = browser.menus.create(options)
// // //       }
// // //     }
// // //   }
// // // })

// // /**
// //  * When tab's url changed or new tab opened, query conote server and get url specified note, then change extension badge
// //  *
// //  */
// // function setupBadge(client: ApolloClient<NormalizedCacheObject>) {
// //   // browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
// //   //   if (changeInfo.url) {
// //   //     console.log('Tab: ' + tabId + ' URL changed to ' + changeInfo.url)
// //   //   }
// //   // })

// //   browser.tabs.onActivated.addListener(async info => {
// //     // console.log('Tab ' + info.tabId + ' was activated')
// //     // browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
// //     //   const tab = tabs[0] // Safe to assume there will only be one result
// //     //   console.log(tab.url)
// //     //   onTabActivated(tab)
// //     // }, console.error)

// //     const tabs = await browser.tabs.query({ currentWindow: true, active: true })
// //     const tab = tabs[0] // Safe to assume there will only be one result
// //     // await onTabActivated(tab)

// //     if (tab.url) {
// //       // const link = await queryLink(client, tab.url)
// //       const { data } = await client.query<LinkQuery, LinkQueryVariables>({
// //         query: LinkDocument,
// //         variables: { url: tab.url },
// //       })

// //       if (data.link) {
// //         browser.action.setBadgeText({ text: '1' })
// //       } else {
// //         browser.action.setBadgeText({ text: '0' })
// //       }
// //     }
// //     // else {
// //     //   browser.browserAction.disable()
// //     // }
// //   })
// // }

// /**
//  * When user click extension-icon, get current tab's url, title and open a new window to navigate to conote's site
//  *
//  */
// function setupBrowserActions() {
//   // browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
//   //   if (changeInfo.url) {
//   //     console.log('Tab: ' + tabId + ' URL changed to ' + changeInfo.url)
//   //   }
//   // })

//   browser.browserAction.onClicked.addListener(async tab => {
//     if (tab.url) {
//       const params = new URLSearchParams({
//         s: `[[${tab.url}]]`,
//         ext: '1',
//       })
//       // const tabUrl = encodeURIComponent(tab.url ?? '')

//       const window = await browser.windows.create({
//         // type: 'popup',
//         // url: browser.runtime.getURL('popup.html') + '?' + params.toString(),
//         url: `${process.env.APP_BASE_URL}/draft?${params.toString()}`,
//         width: 500,
//         height: 900,
//         left: 100,
//       })
//     } else {
//       console.debug('tab.url is undefined')
//     }
//   })
// }

// /**
//  * Listen for messages sent from other parts of the extension
//  */
// // browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
// //   // Log statement if request.popupMounted is true
// //   // NOTE: this request is sent in `popup/component.tsx`
// //   if (request.popupMounted) {
// //     console.log('backgroundPage notified that Popup.tsx has mounted.')
// //     console.log('hello world')
// //   }
// // })

// /**
//  * Main entry
//  *
//  */
// function main() {
//   // setupBadge(apolloClient)
//   setupBrowserActions()
//   // SearchMenu.setup()
// }

// main()
