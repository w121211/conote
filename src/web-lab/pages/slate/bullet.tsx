/* eslint-disable no-console */
import assert from 'assert'
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Editor,
  Transforms,
  Range,
  createEditor,
  Descendant,
  Element,
  Node,
  Path,
  Text,
  NodeEntry,
} from 'slate'
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  useReadOnly,
  ReactEditor,
  RenderElementProps,
  useFocused,
  useSelected,
  RenderLeafProps,
} from 'slate-react'
import { withHistory } from 'slate-history'
import {
  tokenize,
  LINE_VALUE_GRAMMAR,
  Token,
} from '../../../packages/editor/src/parser'
import { createPortal } from 'react-dom'
import { Key } from 'slate-react/dist/utils/key'

const SUGGESTIONS = {
  '@': ['@作者', '@me'],
}

const suggestTriggerMatcher = /(@|\[\[|\$)([\p{Letter}\d]*)$/u

const initiaLBulletHeadValue = {
  type: 'bullet-head',
  children: [{ text: '' }],
}

const initialValue: Descendant[] = [
  {
    type: 'bullet',
    children: [
      {
        type: 'bullet-head',
        children: [{ text: '111 這是中文 $AAA' }],
      },
      {
        type: 'bullet-body',
        children: [
          {
            text: '111 222 333 444 555 666 777 888',
          },
        ],
      },
      {
        type: 'bullet',
        children: [
          {
            type: 'bullet-head',
            children: [{ text: '222' }],
          },
          {
            type: 'bullet-body',
            children: [{ text: '222 333 444 555 666' }],
          },
          {
            type: 'bullet',
            children: [
              {
                type: 'bullet-head',
                children: [{ text: '333' }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'bullet',
    children: [
      {
        type: 'bullet-head',
        children: [{ text: 'bbb' }],
      },
    ],
  },
]

// Operations

function indent(editor: Editor, bullet: NodeEntry<Element>): void {
  const [, curPath] = bullet

  const prev = Editor.previous<Element>(editor, { at: curPath })
  if (prev === undefined || prev[0].type !== 'bullet') {
    console.warn('階層中的第一個bullet無法indent')
    return
  }
  const [prevNode, prevPath] = prev

  Transforms.moveNodes(editor, {
    at: curPath,
    to: [...prevPath, prevNode.children.length],
  })
}

function unindent(editor: Editor, bullet: NodeEntry<Element>): void {
  const [, curPath] = bullet
  const [parent, parentPath] = Editor.parent(editor, curPath)

  if (!(Element.isElement(parent) && parent.type === 'bullet')) {
    console.warn('沒有parent-bullet，無法unindent')
    return
  }

  Transforms.moveNodes(editor, { at: curPath, to: Path.next(parentPath) })
}

function editBody(editor: Editor, bullet: NodeEntry<Element>): void {
  const [, bulletPath] = bullet
  // const [, bulletHeadPath] = bulletHead

  // 搜尋body是否存在
  const [body] = Editor.nodes(editor, {
    at: bulletPath,
    match: (n, p) =>
      p.length === bulletPath.length + 1 &&
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      n.type === 'bullet-body',
  })

  // 沒有body -> 創新一個
  // const insertAt = Path.next(bulletHeadPath)
  const insertAt = [...bulletPath, 1]
  if (body === undefined) {
    Transforms.insertNodes(
      editor,
      {
        type: 'bullet-body',
        children: [{ text: '' }],
      },
      { at: insertAt }
    )
  }

  // 移動指標
  Transforms.select(editor, insertAt)
  Transforms.collapse(editor, { edge: 'end' })
}

function finishEditBody(editor: Editor, bullet: NodeEntry<Element>): void {
  const [, bulletPath] = bullet
  const headPath = [...bulletPath, 0]

  Transforms.select(editor, headPath)
  Transforms.collapse(editor, { edge: 'end' })
}

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

// Components

const BulletBody = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element => {
  const focused = useFocused()
  const selected = useSelected()

  // Ref: https://stackoverflow.com/questions/7612125/how-to-hide-too-long-texts-in-div-elements
  const style =
    selected && focused
      ? {
          // display: 'inline-block',
          color: 'red',
        }
      : {
          '-webkit-line-clamp': 1,
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          // display: 'inline-block',
          width: '100px',
          whiteSpace: 'nowrap', // react的type會抗議這個，但需要 -> 移到css#class
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: 'grey',
        }

  return (
    <div {...attributes}>
      <span style={style}>{children}</span>
    </div>
  )
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let style: React.CSSProperties = {}
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
    case 'mark':
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

const CustomElement = (props: RenderElementProps): JSX.Element => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'bullet':
      return <ul {...attributes}>{children}</ul>
    case 'bullet-head':
      return <li {...attributes}>{children}</li>
    case 'bullet-body':
      return <BulletBody {...props} />
    // return (
    //   <div {...attributes}>
    //     <span style={{ color: 'red' }}>{children}</span>
    //     {/* <span contentEditable={true}>
    //       <span style={{ color: 'red' }}>hello</span>
    //     </span> */}
    //   </div>
    // )
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Portal = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element | null => {
  return typeof document === 'object'
    ? createPortal(children, document.body)
    : null
}

const SuggestionPanel = ({
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
  onSelected: (
    event: React.KeyboardEvent | React.MouseEvent,
    selectedTerm: string
  ) => void
}): JSX.Element => {
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
            onMouseEnter={(event) => {
              event.preventDefault()
              setSelectedIdx(i)
            }}
            onMouseLeave={(event) => {
              event.preventDefault()
              setSelectedIdx(0)
            }}
            onMouseDown={(event) => {
              event.preventDefault()
            }}
            onMouseUp={(event) => {
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

// Editor's functions

function withAutoComplete(editor: Editor): Editor {
  const { insertText } = editor

  editor.insertText = (text: string) => {
    if (text === '[') {
      Transforms.insertText(editor, '[]')
      Transforms.move(editor, { reverse: true })
      return
    }

    insertText(text)
  }

  return editor
}

function withBullet(editor: Editor): Editor {
  const { deleteBackward, insertBreak, normalizeNode } = editor

  // editor.isInline = (element) => {
  //   return element.type === 'list-item-body' ? true : isInline(element)
  // }

  // editor.isVoid = (element) => {
  //   return element.type === 'bullet-body' ? true : isVoid(element)
  // }

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      // if (editor.children.length < 1) {
      //   const title: TitleElement = {
      //     type: 'title',
      //     children: [{ text: 'Untitled' }],
      //   }
      //   Transforms.insertNodes(editor, title, { at: path.concat(0) })
      // }
      // if (editor.children.length < 2) {
      //   const paragraph: ParagraphElement = {
      //     type: 'paragraph',
      //     children: [{ text: '' }],
      //   }
      //   Transforms.insertNodes(editor, paragraph, { at: path.concat(1) })
      // }
      // for (const [child, childPath] of Node.children(editor, path)) {
      //   const type = childPath[0] === 0 ? 'title' : 'paragraph'
      //   if (Element.isElement(child) && child.type !== type) {
      //     const newProperties: Partial<Element> = { type }
      //     Transforms.setNodes(editor, newProperties, { at: childPath })
      //   }
      // }
    }

    // 檢查bullet
    if (Element.isElement(node) && node.type === 'bullet') {
      // 至少要有1個child, ie bullet-head
      assert(node.children.length > 0)

      // 有children -> 確認children為[head, body, bullet, ...]
      for (const [child, childPath] of Node.children(editor, path)) {
        const i = childPath[childPath.length - 1]
        assert(Element.isElement(child))
        if (i === 0) {
          assert(child.type === 'bullet-head')
        }
        if (i === 1) {
          assert(['bullet-body', 'bullet'].includes(child.type ?? ''))
        }
        if (i > 1) {
          assert(child.type === 'bullet')
        }
      }
    }

    normalizeNode([node, path])
  }

  editor.insertBreak = () => {
    const { selection } = editor

    if (selection) {
      // 當前的指標在bulletHead裡面?
      const [bulletHead] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'bullet-head',
      })
      if (bulletHead) {
        const [, nodePath] = bulletHead
        const parentPath = Path.parent(nodePath)
        const [firstIndentBullet] = Editor.nodes(editor, {
          at: parentPath,
          match: (n, p) =>
            p.length === parentPath.length + 1 &&
            Element.isElement(n) &&
            n.type === 'bullet',
        })
        const point = Editor.point(editor, selection)

        Editor.withoutNormalizing(editor, () => {
          // 當在句首時 -> split-node
          if (Editor.isStart(editor, point, nodePath)) {
            Transforms.splitNodes(editor, {
              always: true,
              match: (n) => Element.isElement(n) && n.type === 'bullet',
            })
            return
          }

          // 當在句尾&有子條目時 -> 新增一個子條目
          if (Editor.isEnd(editor, point, nodePath) && firstIndentBullet) {
            Transforms.insertNodes(
              editor,
              {
                type: 'bullet',
                children: [
                  {
                    type: 'bullet-head',
                    children: [{ text: '' }],
                  },
                ],
              },
              { at: firstIndentBullet[1] }
            )
            Transforms.select(editor, firstIndentBullet[1])
            return
          }

          // 當在句中 or (句尾&沒有子條目)時 -> split-node & 將body接回原條目
          Transforms.splitNodes(editor, {
            always: true,
            match: (n) => Element.isElement(n) && n.type === 'bullet',
          })
          Transforms.moveNodes(editor, {
            at: Path.next(parentPath),
            to: [...parentPath, 1],
            match: (n, p) =>
              p.length === parentPath.length + 1 &&
              Element.isElement(n) &&
              ['bullet-body'].includes(n.type),
          })
        })
        return
      }

      // 當前的指標在bulletBody裡面?
      const [bulletBody] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'bullet-body',
      })
      if (bulletBody) {
        Editor.insertText(editor, '\n')
        // Transforms.move(editor)
        return
      }
    }

    insertBreak()
  }

  editor.deleteBackward = (unit: 'character' | 'word' | 'line' | 'block') => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const point = Editor.point(editor, selection)

      // 指標在bullet-head裡面?
      const [bulletHead] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'bullet-head',
      })
      if (bulletHead) {
        const [, bulletHeadPath] = bulletHead
        const parentPath = Path.parent(bulletHeadPath)

        // 指標在條目的最前方，嘗試刪除該條目
        if (Editor.isStart(editor, point, bulletHeadPath)) {
          // 在條目裡還有文字時 -> 無法刪除
          if (Editor.string(editor, bulletHeadPath).length > 0) {
            return
          }

          // 刪除條目的body（若有的話）
          Transforms.removeNodes(editor, {
            at: parentPath,
            match: (n, p) =>
              p.length === parentPath.length + 1 &&
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              n.type === 'bullet-body',
          })
          Transforms.delete(editor, { unit, reverse: true })

          // 確認指摽是否在bullet-body -> 若在的話移動至bullet
          const [body] = Editor.nodes(editor, {
            match: (n) =>
              !Editor.isEditor(n) &&
              Element.isElement(n) &&
              n.type === 'bullet-body',
          })
          if (body) {
            Transforms.select(editor, Path.previous(body[1]))
            Transforms.collapse(editor, { edge: 'end' })
          }

          return
        }
      }

      // 指標在bullet-body裡面?
      const [bulletBody] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'bullet-body',
      })
      if (bulletBody) {
        if (Editor.isStart(editor, point, bulletBody[1])) {
          return
        }
      }
    }

    deleteBackward(unit)
  }

  return editor
}

function decorate([node, path]: NodeEntry): Range[] {
  const ranges: Range[] = []

  if (!Text.isText(node)) {
    return ranges
  }

  function getLength(token: string | Token): number {
    if (typeof token === 'string') {
      return token.length
    } else if (typeof token.content === 'string') {
      return token.content.length
    } else if (Array.isArray(token.content)) {
      return token.content.reduce((l, t) => l + getLength(t), 0)
    } else {
      return 0
    }
  }

  const tokens = tokenize(node.text, LINE_VALUE_GRAMMAR)
  let start = 0

  for (const token of tokens) {
    const length = getLength(token)
    const end = start + length

    if (typeof token !== 'string') {
      ranges.push({
        // [token.type]: true,
        type: token.type,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      })
    }
    start = end
  }

  return ranges
}

// Main editor

const BulletEditor = (): JSX.Element => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...props} />,
    []
  )
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )
  const editor = useMemo(
    () => withAutoComplete(withBullet(withHistory(withReact(createEditor())))),
    []
  )

  // auto suggest
  const [search, setSearch] =
    useState<{ trigger: '@' | '[[' | '$'; term: string; range: Range } | null>(
      null
    )
  const [suggestions, setSuggestions] = useState<string[] | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [corner, setCorner] = useState<{ top: string; left: string }>()

  const onSelected = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent, selectedTerm: string) => {
      if (search) {
        event.preventDefault()
        Transforms.select(editor, search.range)
        insertSuggestion(
          editor,
          search.trigger === '[[' ? selectedTerm : `${selectedTerm} ` // 判斷是否需在尾部加空格，避免與後續文字視為是一體
        )
        setSearch(null)
      } else {
        setSearch(null)
      }
    },
    [search]
  )

  const onKeyDownForSuggest = useCallback(
    (event: React.KeyboardEvent) => {
      if (search) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            if (selectedIdx !== null) {
              // const prevIndex = selectedIdx >= chars.length - 1 ? 0 : selectedIdx + 1
              setSelectedIdx(selectedIdx + 1)
            } else {
              setSelectedIdx(0)
            }
            break
          case 'ArrowUp':
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
          case 'Tab':
            event.preventDefault()
            if (suggestions !== null && selectedIdx !== null) {
              onSelected(event, suggestions[selectedIdx])
            }
            break
          case 'Escape':
            event.preventDefault()
            setSearch(null)
            break
        }
      }
    },
    // [selectedIdx, search, target]
    [suggestions, selectedIdx, search]
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
            // searchAll({ variables: { term: search.term } })
            // searchAll({ variables: { term: search.term } })
            setSuggestions(['111', '222', '333'])
          }
          break
      }
    }
  }, [search])

  // useEffect(() => {
  //   if (searchAllResult.data) {
  //     setSuggestions(searchAllResult.data.searchAll)
  //   } else {
  //     setSuggestions(null)
  //   }
  // }, [searchAllResult])

  function onKeyDownForBullet(event: React.KeyboardEvent) {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      if (!['Tab', 'Enter'].includes(event.key)) {
        return
      }

      // 確認目前是否在bullet-head裡
      const [bulletHead] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'bullet-head',
      })
      if (bulletHead) {
        const [, headPath] = bulletHead
        const [bullet, bulletPath] = Editor.parent(editor, headPath)
        if (!Element.isElement(bullet) || bullet.type !== 'bullet') return

        if (event.shiftKey && event.key === 'Tab') {
          event.preventDefault()
          unindent(editor, [bullet, bulletPath])
          return
        }
        if (event.key === 'Tab') {
          event.preventDefault()
          indent(editor, [bullet, bulletPath])
          return
        }
        if (event.shiftKey && event.key === 'Enter') {
          event.preventDefault()
          editBody(editor, [bullet, bulletPath])
          return
        }
        if (
          event.key === 'Enter' &&
          Editor.string(editor, headPath).length === 0
        ) {
          const [parent] = Editor.parent(editor, bulletPath)
          if (Element.isElement(parent) && parent.type === 'bullet') {
            event.preventDefault()
            unindent(editor, [bullet, bulletPath])
            return
          }
        }
      }

      // 目前在bulletBody裡
      const [bulletBody] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === 'bullet-body',
      })
      if (bulletBody) {
        const [, bodyPath] = bulletBody
        const [bullet, bulletPath] = Editor.parent(editor, bodyPath)

        if (!Element.isElement(bullet) || bullet.type !== 'bullet') return

        if (event.shiftKey && event.key === 'Enter') {
          event.preventDefault()
          finishEditBody(editor, [bullet, bulletPath])
          return
        }
      }
    }
  }

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(value) => {
        setValue(value)
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
          const [cur] = Range.edges(selection)

          // 從目前指標的行頭至指標之間，搜尋最後一個trigger符號
          // const wordBefore = Editor.before(editor, start, { unit: 'word' })
          // const before = wordBefore && Editor.before(editor, wordBefore)
          const start = Editor.before(editor, cur, { unit: 'block' })
          const startRange = start && Editor.range(editor, start, cur)
          const startText = startRange && Editor.string(editor, startRange)
          const startMatch =
            startText &&
            startText.split('\n').pop()?.match(suggestTriggerMatcher)
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
            const searchRange =
              searchStart && Editor.range(editor, searchStart, cur)
            // console.log(searchRange)

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
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        decorate={decorate}
        onKeyDown={(event) => {
          if (search) {
            onKeyDownForSuggest(event)
          } else {
            onKeyDownForBullet(event)
          }
        }}
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
    </Slate>
  )
}

export default BulletEditor

const TestPage = () => {
  return (
    <div>
      <div contentEditable={'true'}>aaa</div>
      <div contentEditable={'true'}>bbb</div>
      <div>ccc</div>
    </div>
  )
}

// export default TestPage
