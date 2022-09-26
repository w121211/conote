document.addEventListener('selectionchange', () => {
  console.log('selectionchange')
  const selection = window.getSelection()
  if (selection) {
    chrome.runtime.sendMessage({
      request: 'updateContextMenu',
      selection: selection.toString().trim(),
    })
  }
})

export {}
