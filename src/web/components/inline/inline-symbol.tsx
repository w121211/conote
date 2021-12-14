import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import { RenderElementProps } from 'slate-react'
import Popup from '../popup/popup'
import classes from '../editor/editor.module.scss'
import { InlineSymbolElement } from '../editor/slate-custom-types'

const InlineSymbol = ({
  attributes,
  children,
  element,
}: RenderElementProps & {
  element: InlineSymbolElement
}): JSX.Element => {
  const [showPopover, setShowPopover] = useState(false)
  const router = useRouter()
  // const selected = useSelected()
  // console.log(element)
  return (
    <span {...attributes} className={classes.symbolContainer}>
      {/* <span contentEditable={false}> */}
      {/* <Link href={`/card/${encodeURI(element.symbol)}`}> */}
      {/* <a
            className="inline"
            onClick={e => {
              e.preventDefault()
              setShowPopover(true)
            }}
          >
            {children}
          </a> */}
      <button
        className="noStyle"
        onClick={e => {
          // e.preventDefault()
          // e.stopPropagation()
          // router.push(`/card/${encodeURIComponent(element.symbol)}`)
          setShowPopover(true)
        }}
      >
        {children}
      </button>
      {/* </Link> */}
      {showPopover && (
        <span contentEditable={false}>
          {router.query.symbol !== element.symbol && router.query.m !== '::' + element.symbol ? (
            <Popup
              visible={showPopover}
              hideBoard={() => {
                setShowPopover(false)
              }}
              buttons={
                <>
                  <button
                    className="secondary"
                    onClick={e => {
                      // e.preventDefault()
                      // e.stopPropagation()
                      setShowPopover(false)
                      router.push(`/card/${encodeURI(element.symbol)}`)
                    }}
                  >
                    確定
                  </button>
                  <button
                    className="primary"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowPopover(false)
                    }}
                  >
                    取消
                  </button>
                </>
              }
              mask={false}
            >
              尚有未儲存內容，確定要離開本頁嗎？
            </Popup>
          ) : (
            <Popup
              visible={showPopover}
              hideBoard={() => {
                setShowPopover(false)
              }}
              buttons={
                <button
                  className="primary"
                  onClick={() => {
                    setShowPopover(false)
                  }}
                >
                  確定
                </button>
              }
              mask={false}
            >
              你就在這頁了!
            </Popup>
          )}
        </span>
      )}
      {/* </span> */}
    </span>
  )
}

export default InlineSymbol
