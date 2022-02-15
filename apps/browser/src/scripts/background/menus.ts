import browser, { Menus, Tabs } from 'webextension-polyfill'

const RateMenu = {
  id: 'conote-menu-rate',

  setup(): void {
    browser.contextMenus.create(
      {
        id: this.id,
        // title: browser.i18n.getMessage('menuItemRemoveMe'),
        title: 'rate',
        contexts: ['selection'], // show only if selection exist
      },
      () => {
        console.log('menu created')
      },
    )

    /**
     * when user click menu, get user's selection
     *
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
  },
}

const SearchMenu = {
  id: 'conote-menu-search',

  setup(): void {
    browser.contextMenus.create(
      {
        id: this.id,
        title: 'Search [[%s]]',
        contexts: ['selection'], // show only if selection exist
      },
      // () => {
      //   console.log('menu created')
      // },
    )

    browser.menus.onClicked.addListener(async (info, tab) => {
      // console.log(info, tab)
      // if (info.menuItemId === this.id) {
      //   console.log(info, tab)
      //   console.log(info.selectionText, info.pageUrl)
      // }

      if (info.menuItemId === this.id && info.selectionText) {
        // const params = new URLSearchParams({
        //   url: info.pageUrl ?? '',
        //   text: info.selectionText ?? '',
        // })
        // const tabUrl = encodeURIComponent(tab.url ?? '')
        const window = await browser.windows.create({
          // type: 'popup',
          // url: `${process.env.APP_BASE_URL}/card/${tabUrl}`,
          url: encodeURIComponent(`${process.env.APP_BASE_URL}/card/[[${info.selectionText}]]`),
          width: 500,
          height: 900,
          left: 100,
        })
      }
    })
  },
}

export const setupMenus = (): void => {
  // Only setup one menu to avoid grouping menus
  SearchMenu.setup()

  console.log('Menus setup completed')
}

// let menuId: number | string | null = null // ID to manage the context menu entry

// const menuClickHandler = (clickData: Menus.OnClickData, tab: Tabs.Tab) => {
//   console.log('Selected ' + clickData.selectionText + ' in ' + tab.url)
// }

// browser.runtime.onMessage.addListener((request: { request: string; selection: string }) => {
//   console.log(request)
//   if (request.request === 'updateContextMenu') {
//     const selection = request.selection
//     if (selection === '') {
//       // Remove the context menu entry
//       if (menuId !== null) {
//         browser.menus.remove(menuId)
//         menuId = null // Invalidate entry now to avoid race conditions
//       } // else: No contextmenu ID, so nothing to remove
//     } else {
//       // Add/update context menu entry
//       const options: Menus.UpdateUpdatePropertiesType = {
//         title: selection,
//         contexts: ['selection'],
//         onclick: menuClickHandler,
//       }
//       if (menuId !== null) {
//         console.log('browser.menus.update(menuId, options)')
//         browser.menus.update(menuId, options)
//       } else {
//         console.log('menuId = browser.menus.create(options)')
//         // Create new menu, and remember the ID
//         menuId = browser.menus.create(options)
//       }
//     }
//   }
// })
