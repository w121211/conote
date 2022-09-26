import { openSiteByCurrentTabUrl } from '../listeners'

/**
 * when user click extension-icon, get current tab's url, title and open a new window to navigate to conote's site
 *
 */
function initBrowserActions() {
  // browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  //   if (changeInfo.url) {
  //     console.log('Tab: ' + tabId + ' URL changed to ' + changeInfo.url)
  //   }
  // })

  const action = process.env.MANIFEST_V3 ? chrome.action : chrome.browserAction

  action.onClicked.addListener(openSiteByCurrentTabUrl)
}

/**
 * Main entry
 */
function main(): void {
  // setupBadge(apolloClient)
  // SearchMenu.setup()

  initBrowserActions()
}

main()
