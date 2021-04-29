import { browser } from 'webextension-polyfill-ts'

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
  // Log statement if request.popupMounted is true
  // NOTE: this request is sent in `popup/component.tsx`
  if (request.popupMounted) {
    console.log('backgroundPage notified that Popup.tsx has mounted.')
    console.log('hello world')
  }
})

browser.browserAction.onClicked.addListener(function (tab) {
  browser.tabs.query({ active: true, lastFocusedWindow: true }).then(tabs => {
    const tab = tabs[0] // Safe to assume there will only be one result
    console.log(tab.url)
  }, console.error)

  const params = new URLSearchParams({ u: tab.url ?? '' })

  // browser.windows.create({
  //   // type: 'popup',
  //   url: browser.runtime.getURL('popup.html') + '?' + params.toString(),
  //   width: 500,
  //   height: 500,
  //   left: 100,
  // })
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
