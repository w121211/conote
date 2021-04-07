import React from 'react'
import { Hello } from '../components/hello'
import { browser } from 'webextension-polyfill-ts'
import { Scroller } from '../components/scroller'
import './styles.scss'
// import { PlainWebpageForm } from '../../../web/src/pages/webpagePage';

export function Popup(): JSX.Element {
  // Sends the `popupMounted` event
  React.useEffect(() => {
    browser.runtime.sendMessage({ popupMounted: true })
  }, [])

  // Renders the component tree
  return (
    <div className="popup-container">
      {/* <PlainWebpageForm /> */}
      <div className="container mx-4 my-4">
        <Hello />
        <hr />
        <Scroller />
      </div>
    </div>
  )
}
