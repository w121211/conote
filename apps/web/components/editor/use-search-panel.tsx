import { ApolloClient } from '@apollo/client'
import { Grammar, Token, tokenize as prismTokenize } from 'prismjs'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Editor, Transforms, Range, BasePoint } from 'slate'
import { ReactEditor } from 'slate-react'
import {
  SearchDiscussDocument,
  SearchDiscussQuery,
  SearchDiscussQueryVariables,
  SearchSymbolDocument,
  SearchSymbolQuery,
  SearchSymbolQueryVariables,
} from '../../apollo/query.graphql'
import { TokenHelper } from '../../common/token-helper'
import { reAuthor, reFiltertag, reTopic } from '../bullet/bullet-parser'
// import { LcElement } from './slate-custom-types'
// import { wrapToInlines } from './with-inline'
// import { isLc } from './with-list'

type Search = {
  target: 'topic' | 'ticker' | 'author' | 'discuss'
  term: string // search term without trigger
  range: Range // include trigger & closer, eg '[[search term]]'
}

const searchTargets = ['author', 'discuss', 'ticker', 'topic']

const SUGGESTS = {
  '@': ['@作者', '@me'],
}

const reTicker = /\$[\w-=]+/ // allow lower case to be searchable

const grammar: Grammar = {
  discuss: { pattern: /(?<=\s|^)#[\d\s\p{Letter}\p{Terminal_Punctuation}-]+#(?=\s|$)/u },
  topic: { pattern: reTopic },
  ticker: { pattern: reTicker },
  filtertag: { pattern: reFiltertag },
  author: { pattern: reAuthor },
}

// const decorateGrammar: Grammar = {
//   // order matters, mirror -> ticker
//   'mirror-ticker': {
//     pattern: reMirrorTicker,
//     inside: {
//       'mirror-head': /^:{2}/,
//     },
//   },
//   'mirror-topic': {
//     pattern: reMirrorTopic,
//     inside: {
//       'mirror-topic-bracket-head': /^:{2}\[\[/,
//       'topic-bracket-tail': /]]$/,
//     },
//   },
//   // poll: { pattern: rePoll },
//   // 'new-poll': { pattern: reNewPoll },

//   // rate: { pattern: reRate },
//   // 'new-rate': { pattern: reNewRate },

//   // ticker: { pattern: reTicker },
//   // topic: {
//   //   pattern: reTopic,
//   //   inside: {
//   //     'topic-bracket-head': /^\[\[/,
//   //     'topic-bracket-tail': /]]$/,
//   //   },
//   // },

//   // filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()\u4E00-\u9FFF]+#(?=\s|$)/ },

//   // url: { pattern: reURL },

//   // author: { pattern: reAuthor },
// }

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
            className={`rounded ${i === selectedIdx ? 'bg-gray-100' : 'bg-transparent'}`}
            style={{
              padding: '1px 3px',
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
      className="absolute min-w-[150px] p-1 border border-gray-100 bg-white rounded shadow-xl shadow-gray-300 z-[1] text-gray-600"
      style={{
        top: corner?.top ?? '-9999px',
        left: corner?.left ?? '-9999px',
      }}
    >
      {items}
    </div>
  )
}

const matchSearch = (editor: Editor): Search | null => {
  const { selection } = editor

  if (selection && Range.isCollapsed(selection)) {
    const [cursor] = Range.edges(selection)
    const text = Editor.string(editor, cursor.path)
    const tokens = prismTokenize(text, grammar)

    let token // the token which cursor currently sitting in
    let tokenStart = 0
    for (const e of tokens) {
      const tokenEnd = tokenStart + e.length
      if (tokenStart < cursor.offset && cursor.offset <= tokenEnd) {
        token = e
        break
      }
      tokenStart = tokenEnd
    }

    if (token && typeof token !== 'string' && searchTargets.includes(token.type)) {
      const tokenStartPoint: BasePoint = { path: cursor.path, offset: tokenStart }
      const tokenEndPoint: BasePoint = { path: cursor.path, offset: tokenStart + token.length }
      const tokenRange = Editor.range(editor, tokenStartPoint, tokenEndPoint)
      const tokenStr = TokenHelper.toString(token.content)
      const tokenStartToCursorStr = tokenStr.substring(0, cursor.offset - tokenStart)

      let search: Search | null = null
      switch (token.type) {
        case 'author':
        case 'discuss':
        case 'ticker':
          search = {
            target: token.type,
            term: tokenStartToCursorStr.substring(1), // remove trigger
            range: tokenRange,
          }
          break
        case 'topic':
          search = {
            target: token.type,
            term: tokenStartToCursorStr.substring(2),
            range: tokenRange,
          }
          break
      }
      return search
    }
  }
  return null
}

const insertSearchHit = (editor: Editor, search: Search, hit: string): void => {
  if (search.target === 'author' || search.target === 'ticker') {
    hit = hit + ' ' // add space after the hit to split
  }
  Transforms.select(editor, search.range) // select current text
  Transforms.insertText(editor, hit) // replace by hit
}

export const useSearchPanel = (
  editor: Editor,
  client: ApolloClient<object>,
): {
  searchPanel: JSX.Element | null
  onKeyUp: (event: React.KeyboardEvent, editor: Editor) => void
} => {
  const [search, setSearch] = useState<Search | null>(null) // null for deactivate search-panel
  const [hits, setHits] = useState<string[] | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [corner, setCorner] = useState<{ top: string; left: string }>()

  useEffect(() => {
    window.addEventListener(
      'scroll',
      e => {
        // console.log(corner)

        if (!search) {
          // const domRange = ReactEditor.toDOMRange(editor, search.range)
          // const rect = domRange.getBoundingClientRect()
          // setCorner({
          //   top: `${rect.top + window.pageYOffset + 24}px`,
          //   left: `${rect.left + window.pageXOffset}px`,
          // })
        }
      },
      true,
    )
    // return () =>
    //   window.removeEventListener('scroll', () => {
    //     if (search) {
    //       const domRange = ReactEditor.toDOMRange(editor, search.range)
    //       const rect = domRange.getBoundingClientRect()
    //       setCorner({
    //         top: `${rect.top + window.pageYOffset + 24}px`,
    //         left: `${rect.left + window.pageXOffset}px`,
    //       })
    //     }
    //   })
  }, [])

  useEffect(() => {
    const searchAsync = async () => {
      if (search) {
        const domRange = ReactEditor.toDOMRange(editor, search.range)
        const rect = domRange.getBoundingClientRect()
        setCorner({
          top: `${rect.top + window.pageYOffset + 24}px`,
          left: `${rect.left + window.pageXOffset}px`,
        })

        if (search.term.length === 0) {
          setHits(null)
          return
        }

        switch (search.target) {
          case 'author': {
            setHits(SUGGESTS['@'])
            break
          }
          case 'ticker':
          case 'topic': {
            const _map: { [k: string]: 'TICKER' | 'TOPIC' } = {
              ticker: 'TICKER',
              topic: 'TOPIC',
            }
            const { data } = await client.query<SearchSymbolQuery, SearchSymbolQueryVariables>({
              query: SearchSymbolDocument,
              variables: { term: search.term, type: _map[search.target] },
            })
            if (data) {
              setHits(data.searchSymbol.map(e => e.str))
            }
            break
          }
          case 'discuss': {
            const { data } = await client.query<SearchDiscussQuery, SearchDiscussQueryVariables>({
              query: SearchDiscussDocument,
              variables: { term: search.term },
            })
            if (data) {
              setHits(data.searchDiscuss.map(e => e.str))
            }
            break
          }
        }

        // const { data } = await client.query<SearchSymbolQuery, SearchSymbolQueryVariables>({
        //   query: SearchSymbolDocument,
        //   variables: { term, type },
        // })
        // if (data) {
        //   setHits(data.searchSymbol.map(e => e.str))
        // }
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

  const onKeyUp = (event: React.KeyboardEvent, editor: Editor) => {
    // console.log(event.key)
    if (event.key.length === 1 || event.key === 'Enter' || event.key === 'Backspace') {
      const search = matchSearch(editor)
      // console.log(search)
      if (search === null) {
        setHits(null)
        setSearch(null)
        return
      }
      setSearch(search)
      return
    }
    if (event.key === 'Escape') {
      setHits(null)
      setSearch(null)
    }
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
  return { searchPanel, onKeyUp }
}
