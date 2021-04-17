import 'regenerator-runtime/runtime'
import 'core-js/stable'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app'

async function main(): Promise<void> {
  // Make sure DOM is fully loaded, see: https://github.com/sourcegraph/sourcegraph/blob/main/client/browser/src/browser-extension/scripts/contentPage.main.ts#L29
  if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
    await new Promise<Event>(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
  }
  ReactDOM.render(<App />, document.getElementById('root'))
}

main().catch(console.error.bind(console))
