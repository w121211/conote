import React, { useEffect, useState } from 'react'
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
  defaultLocalStr,
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
  defaultLocalStr: string
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
  const [localStr, setLocalStr] = useState(defaultLocalStr)

  useEffect(() => {
    if (localStr !== defaultLocalStr) {
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
