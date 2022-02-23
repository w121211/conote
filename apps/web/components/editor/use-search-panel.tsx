import { ApolloClient } from '@apollo/client'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Editor, Transforms, Range, BasePoint } from 'slate'
import { ReactEditor } from 'slate-react'
import { SearchSymbolDocument, SearchSymbolQuery, SearchSymbolQueryVariables } from '../../apollo/query.graphql'

// type SearchCategory = 'topic' | 'ticker' | 'author' | 'discuss'

type Search = {
  trigger: '@' | '[[' | '$'
  term: string
  range: Range
}

const SUGGESTS = {
  '@': ['@作者', '@me'],
}

const reTriggerNoSpace = /(@|\$)([\p{Letter}\d]*)$/u // first group is the trigger
const reTriggerAllowSpace = /(\[\[)([\p{Letter}\d\s]*)$/u

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

const Portal = ({ children }: { children: React.ReactNode }): JSX.Element | null => {
  return typeof document === 'object' ? createPortal(children, document.body) : null
}

const SearchPanel = ({
  corner,
  hits,
  selectedIdx,
  onChange,
  onSelected,
}: {
  corner?: { top: string; left: string }
  hits: string[] | null
  searchTerm: string
  selectedIdx: number | null
  onChange: (selected: number) => void
  onSelected: (event: React.KeyboardEvent | React.MouseEvent, selectedHit: string) => void
}): JSX.Element => {
  let items: JSX.Element | null
  if (hits === null) {
    // items = <div>loading...</div>
    items = null
  } else if (hits.length === 0) {
    // items = <div>create {searchTerm}</div>
    items = null
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
              // console.log('onMouseEnter')
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

const insertSearchHit = (editor: Editor, search: Search, hit: string): void => {
  if (['$', '@'].includes(search.trigger)) {
    hit = hit + ' ' // add space after the hit to split item
  }
  Transforms.select(editor, search.range) // select current text
  Transforms.insertText(editor, hit) // replace by hit
}

export const useSearchPanel = (
  editor: Editor,
  client: ApolloClient<object>,
): {
  searchPanel: JSX.Element | null
  onValueChange: (editor: Editor) => void
} => {
  const [search, setSearch] = useState<Search | null>(null) // null for deactivate search-panel
  const [hits, setHits] = useState<string[] | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [corner, setCorner] = useState<{ top: string; left: string }>()

  useEffect(() => {
    const searchAsync = async () => {
      const _searchSymbol = async (term: string, type: 'TOPIC' | 'TICKER') => {
        if (term.length === 0) {
          setHits(null)
        } else {
          const { data } = await client.query<SearchSymbolQuery, SearchSymbolQueryVariables>({
            query: SearchSymbolDocument,
            variables: { term, type },
          })
          if (data) {
            setHits(data.searchSymbol.map(e => e.str))
          }
        }
      }

      if (search) {
        const domRange = ReactEditor.toDOMRange(editor, search.range)
        const rect = domRange.getBoundingClientRect()
        setCorner({
          top: `${rect.top + window.pageYOffset + 24}px`,
          left: `${rect.left + window.pageXOffset}px`,
        })
        switch (search.trigger) {
          case '@':
            setHits(SUGGESTS['@'])
            break
          case '$':
            _searchSymbol(search.term, 'TICKER')
            break
          case '[[':
            _searchSymbol(search.term, 'TOPIC')
            break
        }
      }
    }

    searchAsync().catch(console.error)
  }, [search])

  const onSelected = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent, selectedHit: string) => {
      if (search) {
        event.preventDefault()
        insertSearchHit(editor, search, selectedHit)
        setSearch(null)
      } else {
        setSearch(null)
      }
    },
    [search],
  )

  const onValueChange = (editor: Editor) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [cur] = Range.edges(selection)
      // cur.path

      // get text between word block and cursr in current line
      const bedore = Editor.before(editor, cur, { unit: 'block' })
      const beforeRange = bedore && Editor.range(editor, bedore, cur)
      const beforeText = beforeRange && Editor.string(editor, beforeRange)
      const text = beforeText && beforeText.split('\n').pop()

      if (text) {
        let match = text.match(reTriggerNoSpace)
        if (match && match.index !== undefined) {
          const beforePoint: BasePoint = { path: cur.path, offset: match.index }

          if (['$', '@'].includes(match[1])) {
            // const before = Editor.before(editor, cur, {
            //   distance: beforeMatch[0].length,
            //   unit: 'offset',
            // })
            // const searchRange = before && Editor.range(editor, before, cur)
            const searchRange = Editor.range(editor, beforePoint, cur)
            setSearch({
              trigger: match[1] as '$' | '@',
              term: match[2],
              range: searchRange,
            })
          }
          return
        }

        match = text.match(reTriggerAllowSpace)
        if (match && match.index !== undefined) {
          const beforePoint: BasePoint = { path: cur.path, offset: match.index }

          if (match[1] === '[[') {
            const after = Editor.after(editor, cur, { unit: 'block' })
            const afterRange = after && Editor.range(editor, cur, after)
            const afterText = afterRange && Editor.string(editor, afterRange)
            const searchRange =
              afterText && afterText.startsWith(']]')
                ? Editor.range(editor, beforePoint, { path: cur.path, offset: cur.offset + 2 }) // include ']]' as search range
                : Editor.range(editor, beforePoint, cur)
            setSearch({
              trigger: match[1] as '[[',
              term: match[2],
              range: searchRange,
            })
          }
          return
        }
      }

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

      // console.log(beforeMatch)
    }
    setHits(null)
    setSearch(null)
  }

  const searchPanel =
    // search && hits && hits.length > 0 ? (
    search ? (
      <Portal>
        <SearchPanel
          corner={corner}
          hits={hits}
          searchTerm={search.term}
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
  return { searchPanel, onValueChange }
}
