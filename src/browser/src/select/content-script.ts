import 'regenerator-runtime/runtime'
import 'core-js/stable'
// import { SiderApp } from '../sider/sider'

import {
  makeCreateRangeSelectorMatcher,
  createTextQuoteSelectorMatcher,
  describeTextQuote,
  createTextPositionSelectorMatcher,
  describeTextPosition,
  highlightText,
} from '@apache-annotator/dom'
import { TextQuoteSelector } from '@apache-annotator/selector'

const describeCurrentSelection = async () => {
  const userSelection = window.getSelection()?.getRangeAt(0)
  if (userSelection === undefined || userSelection.collapsed) {
    return
  }
  return describeTextQuote(userSelection)
}

const highlightSelectorTarget = async (textQuoteSelector: TextQuoteSelector) => {
  const matches = createTextQuoteSelectorMatcher(textQuoteSelector)(document.body)

  // Modifying the DOM while searching can mess up; see issue #112.
  // Therefore, we first collect all matches before highlighting them.
  const matchList = []
  for await (const match of matches) matchList.push(match)
  for (const match of matchList) highlightText(match)
}

// Highlight the last selection that was stored, if any.
const highlightStoredSelectors = async () => {
  console.log('highlightStoredSelectors...')

  if (localStorage[document.URL]) {
    const selectors = JSON.parse(localStorage[document.URL])
    for (const selector of selectors) {
      await highlightSelectorTarget(selector)
    }
  }
}

const copySelection = (): void => {
  const selectedText = window.getSelection()?.toString().trim()
  console.log(selectedText)
  // if (selectedText) {
  //   document.execCommand('Copy')
  // }
}

const main = async (): Promise<void> => {
  // injectExtensionMarker()
  // browser.runtime.onMessage.addListener(injectExtensionMarker)
  // document.addEventListener('mouseup', copySelection)
  console.log('extension main...')

  highlightStoredSelectors()

  document.addEventListener('mouseup', async () => {
    const selector = await describeCurrentSelection()
    if (selector) {
      const existingSelectors = JSON.parse(localStorage[document.URL] || '[]')
      localStorage[document.URL] = JSON.stringify([...existingSelectors, selector])

      await highlightSelectorTarget(selector)
    }
  })
}

// main().catch(console.error.bind(console))
main().catch(err => {
  console.error(err)
})

console.log(document.readyState)

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    main().catch(err => {
      console.error(err)
    })
  }
}
