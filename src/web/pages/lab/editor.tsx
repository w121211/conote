/* eslint-disable no-console */
/**
 * See: https://github.com/ianstormtaylor/slate/blob/main/docs/concepts/12-typescript.md
 *      https://github.com/ianstormtaylor/slate/blob/main/site/pages/examples/%5Bexample%5D.tsx
 */
// import Prism from 'prismjs'
import React, { useState, useCallback, useMemo, CSSProperties, useEffect, KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { createEditor, Descendant, Text, NodeEntry, Range, Editor, Transforms, Node } from 'slate'
import { withHistory } from 'slate-history'
import { Editor as CardEditor, ExtTokenStream, streamToStr } from '../../../packages/editor/src/index'
import { CustomEditor, CustomText } from '../../types/slate-custom-types'
import {
  useSearchAllLazyQuery,
  useCreateWebCardBodyMutation,
  Cocard,
  CocardDocument,
  CocardQuery,
  CocardQueryVariables,
} from '../../apollo/query.graphql'

function Leaf({ attributes, children, leaf }: { attributes: any; children: any; leaf: CustomText }): JSX.Element {
  let style: CSSProperties = {}

  // console.log(leaf)

  switch (leaf.type) {
    case 'sect-symbol': {
      style = { fontWeight: 'bold' }
      break
    }
    case 'multiline-marker':
    case 'inline-marker': {
      style = { color: 'red' }
      break
    }
    case 'inline-value':
    case 'line-value': {
      style = { color: 'blue' }
      break
    }
    case 'line-mark':
    case 'inline-mark': {
      style = { color: 'orange' }
      break
    }
    case 'ticker':
    case 'topic': {
      style = { color: 'brown' }
      break
    }
    case 'stamp': {
      style = { color: 'yellow' }
      break
    }
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  )
}

function withShiftBreak(editor: CustomEditor) {
  /** 原本slate在換行時會創一個新node，改成以`\n`取代 */
  editor.insertBreak = () => {
    Editor.insertText(editor, '\n')
  }
  return editor
}

function insertSuggest(editor: CustomEditor, character: string): void {
  // const mention: MentionElement = {
  //   type: 'mention',
  //   character,
  //   children: [{ text: '' }],
  // }
  // Transforms.insertNodes(editor, mention)
  // Transforms.move(editor)
  Transforms.insertText(editor, character)
  // Transforms.move(editor)
}

// const initialValue: Descendant[] = [
//   {
//     type: 'paragraph',
//     // children: [{ text: '$AAA\n[a]some words with [[BBB]]...' }],
//     children: [{ text: '[[BBB\nCCC]]\n...' }],
//   },
// ]

function Portal({ children }: { children: ReactNode }): JSX.Element | null {
  return typeof document === 'object' ? createPortal(children, document.body) : null
}

const SUGGESTIONS = {
  '@': ['@作者', '@me'],
}

const autoSuggestMatcher = /(@|\[\[|\$)([\p{Letter}\d]*)$/u

function SuggestionPanel({
  corner,
  suggestions,
  selectedIdx,
  setSelectedIdx,
  onSelected,
}: {
  corner?: { top: string; left: string }
  suggestions: string[] | null
  selectedIdx: number | null
  setSelectedIdx: (a: number | null) => void
  onSelected: (event: React.KeyboardEvent | React.MouseEvent, selectedTerm: string) => void
}): JSX.Element | null {
  let items: JSX.Element
  if (suggestions === null) {
    items = <div>loading...</div>
  } else if (suggestions.length === 0) {
    items = <div>not found</div>
  } else {
    items = (
      <>
        {suggestions.map((e, i) => (
          <div
            key={i}
            style={{
              padding: '1px 3px',
              borderRadius: '3px',
              background: i === selectedIdx ? '#B4D5FF' : 'transparent',
            }}
            onMouseEnter={event => {
              event.preventDefault()
              setSelectedIdx(i)
            }}
            onMouseLeave={event => {
              event.preventDefault()
              setSelectedIdx(0)
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

function decorate([node, path]: NodeEntry): Range[] {
  const ranges: Range[] = []

  if (!Text.isText(node)) return ranges

  const cardEditor = new CardEditor(undefined, undefined, 'http://test2.com', 'test-oauther')
  cardEditor.setText(node.text)
  cardEditor.flush()
  const sections = cardEditor.getSections()

  function pushStream(stream: ExtTokenStream, start: number): number {
    let length = 0
    if (typeof stream === 'string') {
      length = stream.length
    } else if (Array.isArray(stream)) {
      for (const e of stream) {
        const l = pushStream(e, start)
        start += l
        length += l
      }
    } else {
      // length = getLength(stream)
      // length = pushStream(stream, start)
      // stream.content
      const content = streamToStr(stream.content)
      length = content.length
      ranges.push({
        type: stream.type,
        anchor: { path, offset: start },
        focus: { path, offset: start + length },
      })
      pushStream(stream.content, start)
    }

    return length
  }

  let start = 0

  for (const sect of sections) {
    if (sect.stream) {
      const length = pushStream(sect.stream, start)
      start += length
    }
  }

  return ranges
}

function EditorWithAutoSuggest({ card, onSubmit }: { card: Cocard; onSubmit: (a: Descendant[]) => void }): JSX.Element {
  // console.log(card)

  const editorContent = JSON.stringify([{ type: 'paragraph', children: [{ text: card.body?.text }] }])
  // localStorage.setItem('editorContent', editorContent)

  const editor = useMemo(() => withShiftBreak(withHistory(withReact(createEditor()))), [])
  const [value, setValue] = useState<Descendant[]>(
    // [
    // { type: 'paragraph', children: [{ text: valueString.replace(/^"(.+)"$/g, '$1') }] },
    // ]
    JSON.parse(editorContent),
  )

  const [search, setSearch] = useState<{ trigger: '@' | '[[' | '$'; term: string; range: Range } | null>(null)
  const [suggestions, setSuggestions] = useState<string[] | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [corner, setCorner] = useState<{ top: string; left: string }>()

  const [searchAll, searchAllResult] = useSearchAllLazyQuery()

  const onSelected = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent, selectedTerm: string) => {
      console.log('onSelected')
      console.log(search)
      if (search) {
        event.preventDefault()
        Transforms.select(editor, search.range)
        if (search.trigger === '[[') {
          // 不需要在尾部加空格
          insertSuggest(editor, `${selectedTerm}`)
        } else {
          // 在尾部加空格，避免與後續文字視為是一體
          insertSuggest(editor, `${selectedTerm} `)
        }
        setSearch(null)
      } else {
        setSearch(null)
      }
    },
    [search],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (search) {
        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault()
            if (selectedIdx !== null) {
              // const prevIndex = selectedIdx >= chars.length - 1 ? 0 : selectedIdx + 1
              setSelectedIdx(selectedIdx + 1)
            } else {
              setSelectedIdx(0)
            }
            break
          }
          case 'ArrowUp': {
            event.preventDefault()
            // const nextIndex =
            //   selectedIdx <= 0 ? chars.length - 1 : selectedIdx - 1
            // setSelectedIdx(nextIndex)
            if (selectedIdx !== null) {
              setSelectedIdx(selectedIdx - 1)
            } else {
              setSelectedIdx(0)
            }
            break
          }
          case 'Tab':
            // case 'Enter':
            event.preventDefault()
            console.log(suggestions, selectedIdx)
            if (suggestions !== null && selectedIdx !== null) {
              onSelected(event, suggestions[selectedIdx])
            }
            // if (searchTerm) {
            //   onSelected(event, searchTerm)
            // }
            // event.preventDefault()
            // Transforms.select(editor, target)
            // insertMention(editor, chars[index])
            // setTarget(null)
            break
          case 'Escape':
            event.preventDefault()
            setSearch(null)
            break
        }
      }
    },
    // [selectedIdx, search, target]
    [suggestions, selectedIdx, search],
  )

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
          setSuggestions(SUGGESTIONS['@'])
          break
        case '$':
        case '[[':
          if (search.term.length === 0) {
            setSuggestions(null)
          } else {
            searchAll({ variables: { term: search.term } })
            searchAll({ variables: { term: search.term } })
          }
          break
      }
    }
  }, [search])

  useEffect(() => {
    if (searchAllResult.data) {
      setSuggestions(searchAllResult.data.searchAll)
    } else {
      setSuggestions(null)
    }
  }, [searchAllResult])
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value)
        console.log('onchange', value)
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
          const [cur] = Range.edges(selection)

          // 從目前輸入點的行頭至輸入點之間，搜尋最後一個trigger符號
          // const wordBefore = Editor.before(editor, start, { unit: 'word' })
          // const before = wordBefore && Editor.before(editor, wordBefore)
          const start = Editor.before(editor, cur, { unit: 'block' })
          const startRange = start && Editor.range(editor, start, cur)
          const startText = startRange && Editor.string(editor, startRange)
          const startMatch = startText && startText.split('\n').pop()?.match(autoSuggestMatcher)
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
            console.log(searchRange)

            if (searchRange) {
              setSearch({
                trigger: startMatch[1] as '$' | '[[' | '@',
                term: startMatch[2],
                range: searchRange,
              })
              setSelectedIdx(0)
            }

            return
          }
        }

        setSearch(null)
        setSuggestions(null)
      }}
    >
      <Editable
        autoCorrect="false"
        decorate={decorate}
        onKeyDown={onKeyDown}
        placeholder="Write some markdown..."
        renderLeaf={props => <Leaf {...props} />}
      />
      {search && (
        <Portal>
          <SuggestionPanel
            corner={corner}
            suggestions={suggestions}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdx}
            onSelected={onSelected}
          />
        </Portal>
      )}
      <button onClick={e => onSubmit(value)}>送出</button>
    </Slate>
  )
}

export function SlateEditorPage({ card, onFinish }: { card: Cocard; onFinish: () => void }): JSX.Element {
  // useEffect(() => {
  //   if (card.body) {

  //     const editorContent = JSON.stringify([{ type: 'paragraph', children: [{ text: card.body.text }] }])
  //     localStorage.setItem('editorContent', editorContent)
  //     // setValue(JSON.parse(editorContent))
  //   }
  //   return () => {
  //     localStorage.removeItem('editorContent')
  //   }
  // }, [card])
  useEffect(() => {
    if (card.body) {
      const value = card.body.text
      const valueString = JSON.stringify(value)
      const editorContent = JSON.stringify([{ type: 'paragraph', children: [{ text: value }] }])
      localStorage.setItem('editorContent', editorContent)
      // setValue(JSON.parse(editorContent))
    }
    return () => {
      // localStorage.removeItem('editorContent')
    }
  }, [])
  const [createWebCardBody] = useCreateWebCardBodyMutation({
    update(cache, { data }) {
      const res = cache.readQuery<CocardQuery, CocardQueryVariables>({
        query: CocardDocument,
        variables: { url: card.link.url },
      })
      if (data?.createWebCardBody && res?.cocard) {
        cache.writeQuery<CocardQuery, CocardQueryVariables>({
          query: CocardDocument,
          variables: { url: card.link.url },
          data: { cocard: { ...res.cocard, body: data.createWebCardBody } },
        })
      }
    },
  })

  async function onSubmit(editorValue: Descendant[]) {
    const text = editorValue.map(e => Node.string(e))

    await createWebCardBody({
      variables: { cardId: card.id, data: { text: text[0] } },
    })
    onFinish()
  }
  return (
    <div>
      <EditorWithAutoSuggest card={card} onSubmit={onSubmit} />
    </div>
  )
}

export default SlateEditorPage
