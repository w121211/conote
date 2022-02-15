import browser from 'webextension-polyfill'

document.addEventListener('selectionchange', () => {
  console.log('selectionchange')
  const selection = window.getSelection()
  if (selection) {
    browser.runtime.sendMessage({
      request: 'updateContextMenu',
      selection: selection.toString().trim(),
    })
  }
})
