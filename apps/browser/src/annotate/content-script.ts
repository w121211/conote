/**
 * Run:
 * # ensure content-script is set properly: browser/public/manifest.json, webpack.config.js
 * $ yarn run dev
 */
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
import { isProbablyReaderable, Readability } from '@mozilla/readability'

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

const getSelection = (): void => {
  const selectedText = window.getSelection()?.toString().trim()
  console.log(selectedText)
  // if (selectedText) {
  //   document.execCommand('Copy')
  // }
}

const main = async (): Promise<void> => {
  console.log('extension main...')

  document.addEventListener('mouseup', getSelection)

  // highlightStoredSelectors()

  // document.addEventListener('mouseup', async () => {
  // const selector = await describeCurrentSelection()
  // if (selector) {
  //   const existingSelectors = JSON.parse(localStorage[document.URL] || '[]')
  //   localStorage[document.URL] = JSON.stringify([...existingSelectors, selector])
  //   await highlightSelectorTarget(selector)
  // }
  // })

  // html to text, @see https://gist.github.com/cojahmetov/b7070c6b4085498caba1
  // if (isProbablyReaderable(document)) {
  const documentClone = document.cloneNode(true)
  const article = new Readability(documentClone as Document).parse()
  console.log(article)
  // }
  // const article = new Readability(document).parse()
  // console.log(article)
}

main().catch(err => {
  console.error(err)
})

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    // for some websites requires page to be ready
    main().catch(err => {
      console.error(err)
    })
  }
}
