import React, { useEffect, useRef, useState } from 'react'
import {
  textareaBlur,
  textareaChange,
  textareaClick,
  textareaMouseDown,
  textareaMouseEnter,
  textareaUnmount,
} from '../../handlers/textarea-handlers'
import { textareaKeyDown } from '../../handlers/textarea-keydown'
import type {
  CaretPosition,
  DestructTextareaKeyEvent,
  Search,
} from '../../interfaces'
import ParseRenderEl from '../inline/parse-render-el'

function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const BlockContent = ({
  // rawContent,
  // renderedContent,
  // isLocked,
  // isEditable,
  // handleContentChange,
  // contentProps,
  // textareaProps,
  uid,
  isEditing,
  defaultStr,
  showEditableDom,
  caret,
  setCaret,
  search,
  setSearch,
  lastKeyDown,
  setLastKeyDown,
}: {
  uid: string
  isEditing: boolean
  defaultStr: string
  showEditableDom: boolean
  caret: CaretPosition
  setCaret: React.Dispatch<React.SetStateAction<CaretPosition>>
  search: Search
  setSearch: React.Dispatch<React.SetStateAction<Search>>
  lastKeyDown: DestructTextareaKeyEvent | null
  setLastKeyDown: React.Dispatch<
    React.SetStateAction<DestructTextareaKeyEvent | null>
  >
}): JSX.Element => {
  const [localStr, setLocalStr] = useState(defaultStr)

  const prevDefaultStr = usePrevious(defaultStr)

  useEffect(() => {
    // Require if defaultStr is changed outside through block ops
    setLocalStr(defaultStr)
  }, [defaultStr])

  useEffect(() => {
    // In cases 'defaultStr' and 'isEditing' changed in the same time (eg block-split-op),
    //  prevent saving the block
    const defaultStrChanged =
      prevDefaultStr !== undefined && prevDefaultStr !== defaultStr

    if (localStr !== defaultStr && !defaultStrChanged) {
      textareaUnmount(uid, localStr)
    }
  }, [isEditing, showEditableDom])

  return (
    <div
      className={`[grid-area:content]
        grid [grid-template-areas:'main']
        place-items-stretch place-content-stretch
        relative z-[2]
        overflow-visible
        flex-grow
        [word-break:break-word]
        text-gray-700`}
    >
      {(isEditing || showEditableDom) && (
        <textarea
          id={'editable-uid-' + uid}
          data-testid="block-content-textarea"
          className={`
            [grid-area:main]
            relative
            block
            [transform:translate3d(0,0,0)]
            min-h-full
            p-0
            m-0
            border-none
            outline-none
            bg-transparent
            appearance-none
            resize-none
            text-inherit
            font-[inherit]
            cursor-text
            ${
              isEditing
                ? 'opacity-100 z-[3] leading-[inherit]'
                : showEditableDom
                ? 'opacity-0 leading-[inherit] hover:leading-[inherit]'
                : 'opacity-0 hover:leading-[inherit]'
            }
            `}
          rows={1}
          value={localStr}
          onChange={e => {
            textareaChange(e, uid, setLocalStr)
          }}
          // onPaste={e => textareaPaste(e, lastKeyDown)}
          onKeyDown={e => {
            textareaKeyDown({
              e,
              uid,
              editing: isEditing,
              localStr,
              caret,
              setCaret,
              search,
              setSearch,
              lastKeyDown,
              setLastKeyDown,
            })
          }}
          onBlur={e => textareaBlur(e, uid)}
          onClick={e => textareaClick(e, uid)}
          onMouseDown={e => textareaMouseDown(e)}
          onMouseEnter={e => textareaMouseEnter(e, uid)}
        />
      )}

      {/* <div
        className="
        [grid-area:main]
        text-inherit
        font-[inherit]
        cursor-text"
        style={{ color: 'red' }}
      >
        {localStr}
      </div> */}

      <ParseRenderEl
        className={`[grid-area:main]
          text-inherit
          font-[inherit]
          cursor-text 
          whitespace-pre-wrap [word-break:break-word]
          ${isEditing ? 'opacity-0' : ''}`}
        blockUid={uid}
        str={localStr}
      />
    </div>
  )
}
