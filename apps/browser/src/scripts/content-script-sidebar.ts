import 'regenerator-runtime/runtime'
import 'core-js/stable'
import * as React from 'react'
import { render } from 'react-dom'
import browser from 'webextension-polyfill'
// import { SiderApp } from '../sider/sider'
import { App } from '../popup/app'

const injectExtensionMarker = (): void => {
  const el = document.createElement('div')
  el.id = 'conote-extension-root'
  // const extensionMarker = document.createElement('div')
  //   extensionMarker.id = EXTENSION_MARKER_ID
  //   extensionMarker.dataset.platform = getPlatformName()
  // extensionMarker.style.display = 'none'
  el.style.position = 'fixed'
  el.style.top = '0em'
  el.style.right = '0em'
  el.style.height = '100%'
  el.style.width = '200px'
  el.style.backgroundColor = 'red'
  document.body.append(el)
  // render(React.createElement(SiderApp, null, null), el)

  // 若用cookie的話會有CORS error
  render(React.createElement(App, null, null), el)
}

const main = async (): Promise<void> => {
  injectExtensionMarker()
  browser.runtime.onMessage.addListener(injectExtensionMarker)
}

// main().catch(console.error.bind(console))
main().catch(err => {
  console.error(err)
})
