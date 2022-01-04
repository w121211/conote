import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Editor, Transforms, Range, createEditor, Descendant, Element, Node, Path, Text, NodeEntry, Point } from 'slate'
import { ReactEditor, useSlateStatic } from 'slate-react'

export type Search = { trigger: '@' | '[[' | '$'; term: string; range: Range }

const SUGGESTIONS = {
  '@': ['@作者', '@me'],
}

// function useSelect(): [
//   number | undefined,
//   (event: React.KeyboardEvent) => void
// ] {
//   // const { type } = props
//   const [selectedIdx, setSelectedIdx] = useState<number | undefined>()
//   // const input = (
//   //   <input
//   //     value={value}
//   //     onChange={(e) => setValue(e.target.value)}
//   //     type={type}
//   //   />
//   // )
//   const onKeyDown = (event: React.KeyboardEvent) => {
//     switch (event.key) {
//       // case 'ArrowDown':
//       //   event.preventDefault()
//       //   if (selectedIdx === undefined) {
//       //     setSelectedIdx(0)
//       //     // const prevIndex = selectedIdx >= chars.length - 1 ? 0 : selectedIdx + 1
//       //   } else {
//       //     setSelectedIdx(selectedIdx + 1)
//       //   }
//       case 'ArrowDown':
//         event.preventDefault()
//         if (selectedIdx !== null) {
//           // const prevIndex = selectedIdx >= chars.length - 1 ? 0 : selectedIdx + 1
//           setSelectedIdx(selectedIdx + 1)
//         } else {
//           setSelectedIdx(0)
//         }
//         break
//       case 'ArrowUp':
//         event.preventDefault()
//         // const nextIndex =
//         //   selectedIdx <= 0 ? chars.length - 1 : selectedIdx - 1
//         // setSelectedIdx(nextIndex)
//         if (selectedIdx !== null) {
//           setSelectedIdx(selectedIdx - 1)
//         } else {
//           setSelectedIdx(0)
//         }
//         break
//       case 'Tab':
//         event.preventDefault()
//         if (suggestions !== null && selectedIdx !== null) {
//           onSelected(event, suggestions[selectedIdx])
//         }
//         break
//       case 'Escape':
//         event.preventDefault()
//         setSearch(null)
//         break
//     }
//   }

//   return [selectedIdx, onKeyDown]
// }

const Portal = (props: { children: React.ReactNode }): JSX.Element | null => {
  const { children } = props
  return typeof document === 'object' ? createPortal(children, document.body) : null
}

const SearchPanel = (props: {
  corner?: { top: string; left: string }
  hits?: string[]
  selectedIdx: number | null
  onChange: (selected: number) => void
  onSelected: (event: React.KeyboardEvent | React.MouseEvent, selectedTerm: string) => void
}): JSX.Element => {
  const { corner, hits, selectedIdx, onChange, onSelected } = props

  let items: JSX.Element
  if (hits === undefined) {
    items = <div>loading...</div>
  } else if (hits.length === 0) {
    items = <div>not found</div>
  } else {
    items = (
      <>
        {hits.map((e, i) => (
          <div
            key={i}
            style={{
              padding: '1px 3px',
              borderRadius: '3px',
              background: i === selectedIdx ? '#B4D5FF' : 'transparent',
            }}
            onMouseEnter={event => {
              event.preventDefault()
              console.log('onMouseEnter')
              onChange(i)
            }}
            onMouseLeave={event => {
              event.preventDefault()
              onChange(0)
            }}
            onMouseDown={event => {
              event.preventDefault()
            }}
            onMouseUp={event => {
              onSelected(event, e)
            }}
          >
            {e}
          </div>
        ))}
      </>
    )
  }

  return (
    <div
      style={{
        top: corner?.top ?? '-9999px',
        left: corner?.left ?? '-9999px',
        position: 'absolute',
        zIndex: 1,
        padding: '3px',
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
      }}
    >
      {items}
    </div>
  )
}

const suggestTriggerMatcher = /(@|\[\[|\$)([\p{Letter}\d]*)$/u

function insertSuggestion(editor: Editor, suggest: string): void {
  // const mention: MentionElement = {
  //   type: 'mention',
  //   character,
  //   children: [{ text: '' }],
  // }
  // Transforms.insertNodes(editor, mention)
  // Transforms.move(editor)
  Transforms.insertText(editor, suggest)
  // Transforms.move(editor)
}

export function useSearch(editor: Editor): [JSX.Element | null, (editor: Editor) => void] {
  const [search, setSearch] = useState<Search | undefined>()
  const [hits, setHits] = useState<string[] | undefined>()
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [corner, setCorner] = useState<{ top: string; left: string }>()

  useEffect(() => {
    if (search) {
      const domRange = ReactEditor.toDOMRange(editor, search.range)
      const rect = domRange.getBoundingClientRect()
      setCorner({
        top: `${rect.top + window.pageYOffset + 24}px`,
        left: `${rect.left + window.pageXOffset}px`,
      })
      switch (search.trigger) {
        case '@':
          setHits(SUGGESTIONS['@'])
          break
        case '$':
        case '[[':
          if (search.term.length === 0) {
            setHits(undefined)
          } else {
            // searchAll({ variables: { term: search.term } })
            // searchAll({ variables: { term: search.term } })
            setHits(['111', '222', '333'])
          }
          break
      }
    }
  }, [search])

  const onSelected = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent, selectedTerm: string) => {
      if (search) {
        event.preventDefault()
        Transforms.select(editor, search.range)
        insertSuggestion(
          editor,
          search.trigger === '[[' ? selectedTerm : `${selectedTerm} `, // 判斷是否需在尾部加空格，避免與後續文字視為是一體
        )
        setSearch(undefined)
      } else {
        setSearch(undefined)
      }
    },
    [search],
  )

  // const onSearchChange = (editor: Editor) => {
  //   if (search) {
  //     const domRange = ReactEditor.toDOMRange(editor, search.range)
  //     const rect = domRange.getBoundingClientRect()
  //     setCorner({
  //       top: `${rect.top + window.pageYOffset + 24}px`,
  //       left: `${rect.left + window.pageXOffset}px`,
  //     })
  //     switch (search.trigger) {
  //       case '@':
  //         setHits(SUGGESTIONS['@'])
  //         break
  //       case '$':
  //       case '[[':
  //         if (search.term.length === 0) {
  //           setHits(undefined)
  //         } else {
  //           // searchAll({ variables: { term: search.term } })
  //           // searchAll({ variables: { term: search.term } })
  //           setHits(['111', '222', '333'])
  //         }
  //         break
  //     }
  //   }
  // }

  const onValueChange = (editor: Editor) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [cur] = Range.edges(selection)

      // 從目前指標的行頭至指標之間，搜尋最後一個trigger符號
      // const wordBefore = Editor.before(editor, start, { unit: 'word' })
      // const before = wordBefore && Editor.before(editor, wordBefore)
      const start = Editor.before(editor, cur, { unit: 'block' })
      const startRange = start && Editor.range(editor, start, cur)
      const startText = startRange && Editor.string(editor, startRange)
      const startMatch = startText && startText.split('\n').pop()?.match(suggestTriggerMatcher)
      // const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)

      // 若是在句中插入的情況，需要找break-point
      // const after = Editor.after(editor, start)
      // const afterRange = Editor.range(editor, start, after)
      // const afterText = Editor.string(editor, afterRange)
      // const afterMatch = afterText.match(/^(\s|$)/)

      // console.log('-------')
      // console.log(before, beforeRange, beforeText, beforeMatch)
      // console.log(after, afterRange, afterText)
      // console.log(beforeMatch, afterMatch)

      if (startMatch && ['$', '[[', '@'].includes(startMatch[1])) {
        const searchStart = Editor.before(editor, cur, {
          distance: startMatch[0].length,
          unit: 'offset',
        })
        const searchRange = searchStart && Editor.range(editor, searchStart, cur)
        // console.log(searchRange)

        if (searchRange) {
          setSearch({
            trigger: startMatch[1] as '$' | '[[' | '@',
            term: startMatch[2],
            range: searchRange,
          })
          // setSelectedIdx(0)

          // const domRange = ReactEditor.toDOMRange(editor, searchRange)
          // const rect = domRange.getBoundingClientRect()
          // setCorner({
          //   top: `${rect.top + window.pageYOffset + 24}px`,
          //   left: `${rect.left + window.pageXOffset}px`,
          // })
        }

        return
      }
    }

    setSearch(undefined)
    setHits(undefined)
  }

  const searchPanel = search ? (
    <Portal>
      <SearchPanel
        corner={corner}
        hits={hits}
        selectedIdx={selectedIdx}
        onChange={i => {
          setSelectedIdx(i)
        }}
        // setSelectedIdx={setSelectedIdx}
        onSelected={onSelected}
      />
    </Portal>
  ) : null

  // return [search, selectedIdx, searchPanel, onValueChange, onSearchChange]
  return [searchPanel, onValueChange]
}
