import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  textareaBlur,
  textareaChange,
  textareaClick,
  textareaMouseDown,
  textareaMouseEnter,
  textareaUnmount,
} from '../../handlers/textarea-handlers'
import { nullSearch, textareaKeyDown } from '../../handlers/textarea-keydown'
import type {
  CaretPosition,
  DestructTextareaKeyEvent,
  Search,
} from '../../interfaces'
import { UndoManager } from '../../utils/undo-manager'
import ParseRenderEl from '../inline/parse-render-el'

function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

/**
 * TODO:
 * - [] Ignoring keydown during IME composition
 */
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
  const undoManager = useMemo(() => new UndoManager(defaultStr), [])

  // const [isOnComposition, setIsOnComposition] = useState(false)

  useEffect(() => {
    // Require if defaultStr is changed outside through block ops
    setLocalStr(defaultStr)
  }, [defaultStr])

  useEffect(() => {
    // In cases 'defaultStr' and 'isEditing' changed in the same time (eg block-split-op),
    //  prevent saving the block
    const defaultStrChanged =
      prevDefaultStr !== undefined && prevDefaultStr !== defaultStr

    if (!isEditing || !showEditableDom) setSearch(nullSearch)
    if (localStr !== defaultStr && !defaultStrChanged)
      textareaUnmount(uid, localStr)
  }, [isEditing, showEditableDom])

  // function undo() {
  //   const s = undoManager.undo()
  //   if (s === null) {
  //     console.log('undo stack is empty')
  //     historyUndo()
  //   } else {
  //     setLocalStr(s)
  //   }
  // }

  // function redo() {
  //   const s = undoManager.redo()
  //   if (s === null) {
  //     console.log('redo stack is empty')
  //   } else {
  //     setLocalStr(s)
  //   }
  // }

  // function hotkey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  //   const dKeyDown = destructKeyDown(e),
  //     { key, ctrl, meta, shift } = dKeyDown
  //   if (isShortcutKey(meta, ctrl) && key === 'z') {
  //     e.preventDefault()
  //     if (shift) {
  //       redo()
  //     } else {
  //       undo()
  //     }
  //   }
  // }

  // function handleComposition(event: React.CompositionEvent) {
  //   console.log('handleComposition')
  //   if (event.type === 'compositionstart') {
  //     setIsOnComposition(true)
  //   }
  //   if (event.type === 'compositionend') {
  //     setIsOnComposition(false)
  //   }
  // }

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
            // A trick to avoid IME composing key of full-size hashtag
            // TODO: Use on-key-up to detect?
            if (
              (e.nativeEvent as any).isComposing &&
              e.currentTarget.value === '#＃#'
            ) {
              return
            }

            textareaChange(e, uid, setLocalStr)
            // undoManager.nextValue(localStr)
          }}
          // onPaste={e => textareaPaste(e, lastKeyDown)}
          onKeyDown={e => {
            // console.log('onKeyDown', e)
            // hotkey(e)
            if (e.nativeEvent.isComposing) return
            textareaKeyDown({
              e,
              uid,
              editing: isEditing,
              localStr,
              setLocalStr,
              caret,
              setCaret,
              search,
              setSearch,
              lastKeyDown,
              setLastKeyDown,
              undoManager,
            })
          }}
          onBlur={e => textareaBlur(e, uid)}
          onClick={e => textareaClick(e, uid)}
          onMouseDown={e => textareaMouseDown(e)}
          onMouseEnter={e => textareaMouseEnter(e, uid)}
          // onCompositionStart={handleComposition}
          // onCompositionEnd={handleComposition}
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
