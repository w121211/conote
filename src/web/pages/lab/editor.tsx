/**
 * Note:
 * - inline element不能是最後一個child(slate本身的限制)，會自動在最後加一個text -> 可能對render有問題
 * - inline 在輸入時會自動合併到text
 */
/* eslint-disable no-console */
import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import Modal from 'react-modal'
import { useApolloClient } from '@apollo/client'
import { Editor, Transforms, Range, createEditor, Descendant, Element, Node, Path, Text, NodeEntry, Point } from 'slate'
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
import { editorValue } from '../../apollo/cache'
import { LcElement, LiElement, UlElement } from '../../components/editor/slate-custom-types'
import { BulletInput } from '../../lib/bullet/types'
import {
  isLc,
  isLi,
  isLiArray,
  isUl,
  onKeyDown as onKeyDownWithList,
  withList,
} from '../../components/editor/with-list'
import { withMirror } from '../../components/editor/with-mirror'
import { queryAndParseCard } from './card'
import { toLi } from '../../components/editor/serializer'
// import { useSearch } from './search'
// import { BulletOneElement } from './custom-types'
// import {
//   deserialize,
//   serialize,
// } from '../../../web/lib/bullet/editor/serializer'

const initialValueDemo: LiElement[] = [
  {
    type: 'li',
    children: [{ type: 'lc', freeze: true, children: [{ text: '' }] }],
  },
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        body: '111',
        freeze: true,
        children: [{ text: '111 這是中文 $AAA' }],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              {
                type: 'lc',
                body: '333',
                // freeze: true,
                id: 123,
                warning: 'warning',
                children: [{ text: '333' }],
              },
              {
                type: 'ul',
                children: [
                  {
                    type: 'li',
                    children: [
                      {
                        type: 'lc',
                        body: '444',
                        root: true,
                        children: [{ text: '444' }],
                      },
                    ],
                  },
                  {
                    type: 'li',
                    children: [
                      {
                        type: 'lc',
                        body: '555',
                        children: [{ text: '555' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            type: 'li',
            children: [
              {
                type: 'lc',
                body: '666',
                children: [{ text: '666' }],
              },
              {
                type: 'ul',
                children: [
                  {
                    type: 'li',
                    children: [
                      {
                        type: 'lc',
                        body: '777',
                        children: [{ text: '777' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        root: true,
        // placeholder: 'Type some symbol and press enter',
        children: [{ text: '$BA' }],
        asOauthor: true,
      },
    ],
  },
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        root: true,
        placeholder: 'Type some symbol and press enter',
        warning: 'Here is a warning',
        children: [{ text: '' }],
      },
    ],
  },
]

function useInput(props: { type: string }): [string, JSX.Element] {
  const { type } = props
  const [value, setValue] = useState('')
  const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} />
  return [value, input]
}

// function editBody(editor: Editor, bullet: NodeEntry<Element>): void {
//   const [, bulletPath] = bullet
//   // const [, bulletHeadPath] = bulletHead

//   // 搜尋body是否存在
//   const [body] = Editor.nodes(editor, {
//     at: bulletPath,
//     match: (n, p) =>
//       p.length === bulletPath.length + 1 &&
//       !Editor.isEditor(n) &&
//       Element.isElement(n) &&
//       n.type === 'bullet-body',
//   })

//   // 沒有body -> 創新一個
//   // const insertAt = Path.next(bulletHeadPath)
//   const insertAt = [...bulletPath, 1]
//   if (body === undefined) {
//     Transforms.insertNodes(
//       editor,
//       {
//         type: 'bullet-body',
//         children: [{ text: '' }],
//       },
//       { at: insertAt }
//     )
//   }

//   // 移動指標
//   Transforms.select(editor, insertAt)
//   Transforms.collapse(editor, { edge: 'end' })
// }

// function finishEditBody(editor: Editor, bullet: NodeEntry<Element>): void {
//   const [, bulletPath] = bullet
//   const headPath = [...bulletPath, 0]

//   Transforms.select(editor, headPath)
//   Transforms.collapse(editor, { edge: 'end' })
// }

// const BulletBodyInline = (props: RenderElementProps) => {
//   const { attributes, children, element } = props
//   const focused = useFocused()
//   const selected = useSelected()
//   return (
//     <div {...attributes}>
//       {/* <span style={style}>{children}</span> */}
//       <span style={{ color: 'red' }}>{children}</span>
//     </div>
//   )
// }

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

const CommentModal = (props: { onClose?: (value: { choosed?: string | null; comment: string }) => void }) => {
  const { onClose } = props
  const [comment, commentInput] = useInput({ type: 'text' })
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        @作者 Modal
      </button>
      <Modal
        contentLabel="Comment modal"
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false)
          if (onClose) {
            onClose({ comment })
          }
        }}
      >
        {commentInput}
      </Modal>
    </div>
  )
}

const Ul = (props: RenderElementProps & { element: UlElement }) => {
  const { attributes, children } = props
  return <ul {...attributes}>{children}</ul>
}

const Li = (props: RenderElementProps & { element: LiElement }) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  // { display: 'none', visibility: 'hidden', height: 0 }
  const style: CSSProperties = element.fold ? { display: 'none' } : {}
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <button
          onClick={() => {
            const path = ReactEditor.findPath(editor, element)
            Transforms.deselect(editor)
            Transforms.setNodes<UlElement>(editor, { fold: element.fold ? undefined : true }, { at: path })
          }}
        >
          Fold
        </button>
      </div>
      {/* {!element.fold && <ul>{children}</ul>} */}
      <div contentEditable={element.fold ? false : undefined}>
        <ul style={style}>{children}</ul>
      </div>
    </div>
  )
}

async function queryCard(symbol: string): Promise<string[]> {
  if (symbol.length === 0) {
    throw new Error('')
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(['[+]', '[-]'])
    }, 1000)
  })
}

const AuthorSwitch = (props: { oauthorName?: string }) => {
  const { oauthorName } = props
  // const [author, setAuthor] = useState(element.asOauthor ?? '@self')
  const [author, setAuthor] = useState(oauthorName ?? '@self')

  if (oauthorName) {
    return (
      <button
        onClick={() => {
          if (author === '@self') {
            setAuthor(oauthorName)
          } else {
            setAuthor('@self')
          }
        }}
      >
        {author}
      </button>
    )
  } else {
    return <span>{author}</span>
  }
}

const Lc = (props: RenderElementProps & { element: LcElement }) => {
  const { attributes, children, element } = props
  const client = useApolloClient()
  const editor = useSlateStatic()
  // const focused = useFocused()
  // const selected = useSelected()
  const [loading, setLoading] = useState(false)
  const [placeholder, setPlaceholder] = useState<string | undefined>()
  // const [body, bodyInput] = useInput({ type: 'text' })

  useEffect(() => {
    async function _queryAndTransform() {
      if (element.root && element.symbol && element.rootBullet === undefined) {
        const lcPath = ReactEditor.findPath(editor, element)
        const liEntry = Editor.above<LiElement>(editor, { at: lcPath, match: n => isLi(n) })

        if (liEntry === undefined) {
          console.error('找不到li')
          return
        }

        setLoading(true)
        const { root, error } = await queryAndParseCard({ client, symbol: element.symbol, mirror: true })
        console.debug('queryAndParseCard')

        if (error) {
          Transforms.setNodes<LcElement>(editor, { warning: 'server異常' }, { at: lcPath })
          setLoading(false)
          return
        }
        if (root) {
          const newLi = toLi(root)
          const [lc, ...rest] = newLi.children
          const newLc: LcElement = { ...lc, rootBullet: root, mirror: true }

          Editor.withoutNormalizing(editor, () => {
            // 移除原本的li，插入新的
            Transforms.removeNodes(editor, { at: liEntry[1] })
            Transforms.insertNodes<LiElement>(
              editor,
              {
                ...newLi,
                children: [newLc, ...rest],
              },
              { at: liEntry[1] },
            )
          })
        } else {
          // 找不到card，視為創新card
          Transforms.setNodes<LcElement>(editor, { createCard: true }, { at: lcPath })
        }
        setLoading(false)
      }
    }

    _queryAndTransform()
    setPlaceholder(element.placeholder)
  }, [element])

  return (
    <div {...attributes}>
      <li>
        <span>{children}</span>
      </li>

      {/* <div contentEditable={false}>
        <span style={{ color: 'brown' }} onClick={() => {
          // test
        }}>Here is a body text...</span>
        {bodyInput}
      </div> */}

      <div contentEditable={false} style={{ color: 'green' }}>
        {placeholder && Node.string(element).length === 0 && <span style={{ color: 'grey' }}>{placeholder}</span>}
        {/* <AuthorSwitch oauthorName={element.oauthorName} /> */}
        {element.id}
        {element.warning}
        {element.freeze && 'freeze'}
      </div>

      {element.symbol && (
        <div contentEditable={false}>
          {loading && <span>loading...</span>}
          {/* <span>{author}</span> */}
          <span>{element.symbol}</span>
          <span>{element.warning}</span>
          <span>{element.comment?.oauthorComment}</span>
          <CommentModal
            onClose={({ comment }) => {
              const path = ReactEditor.findPath(editor, element)
              Transforms.setNodes<LiElement>(
                editor,
                {
                  comment: {
                    boardCode: 'BUYSELL',
                    oauthorComment: comment,
                    oauthorVote: -1,
                  },
                },
                { at: path },
              )
            }}
          />
        </div>
      )}
      {/* {element.body && (
        <div contentEditable={false}>
          <span style={{ color: 'grey' }}>{element.body}</span>
        </div>
      )}
      <div contentEditable={false}>
        <input />
      </div> */}
    </div>
  )
}

const CustomElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props
  if (isLc(element)) {
    return <Lc {...{ attributes, children, element }} />
  }
  if (isLi(element)) {
    return <Li {...{ attributes, children, element }} />
  }
  if (isUl(element)) {
    return <Ul {...{ attributes, children, element }} />
  }
  return <span {...attributes}>{children}</span>
}

// function decorate([node, path]: NodeEntry): Range[] {
//   const ranges: Range[] = []

//   if (!Text.isText(node)) {
//     return ranges
//   }

//   function getLength(token: string | Token): number {
//     if (typeof token === 'string') {
//       return token.length
//     } else if (typeof token.content === 'string') {
//       return token.content.length
//     } else if (Array.isArray(token.content)) {
//       return token.content.reduce((l, t) => l + getLength(t), 0)
//     } else {
//       return 0
//     }
//   }

//   const tokens = tokenize(node.text, LINE_VALUE_GRAMMAR)
//   let start = 0

//   for (const token of tokens) {
//     const length = getLength(token)
//     const end = start + length

//     if (typeof token !== 'string') {
//       ranges.push({
//         // [token.type]: true,
//         type: token.type,
//         anchor: { path, offset: start },
//         focus: { path, offset: end },
//       })
//     }
//     start = end
//   }

//   return ranges
// }

export const BulletEditor = (props: {
  initialValue?: LiElement[]
  oauthorName?: string
  srcUrl?: string
}): JSX.Element => {
  const { initialValue = initialValueDemo, oauthorName, srcUrl } = props

  const [value, setValue] = useState<LiElement[]>(initialValue)
  const editor = useMemo(
    // () => withAutoComplete(withBullet(withHistory(withReact(createEditor())))),
    // () => withList(withHistory(withReact(createEditor()))),
    () => withMirror(withList(withHistory(withReact(createEditor())))),
    [],
  )
  const renderElement = useCallback((props: RenderElementProps) => <CustomElement {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

  const _onKeyDownWithList = useCallback((event: React.KeyboardEvent) => {
    onKeyDownWithList(event, editor)
  }, [])

  // const [searchPanel, onValueChange] = useSearch(editor)

  // useEffect(() => {
  //   if (searchAllResult.data) {
  //     setSuggestions(searchAllResult.data.searchAll)
  //   } else {
  //     setSuggestions(null)
  //   }
  // }, [searchAllResult])

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        onChange={value => {
          if (isLiArray(value)) {
            setValue(value)
            editorValue(value) // 將最新值存入cache
          } else {
            throw new Error('value需為ul array')
          }
        }}
      >
        <Editable
          autoCorrect="false"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          // decorate={decorate}
          onKeyDown={event => {
            _onKeyDownWithList(event)
            // if (search) {
            //   onKeyDownForSuggest(event)
            // } else {
            //   onKeyDownForBullet(event)
            // }
          }}
        />
        {/* {searchPanel} */}
        {/* {search && (
          <Portal>
            <SuggestionPanel
              corner={corner}
              suggestions={suggestions}
              selectedIdx={selectedIdx}
              setSelectedIdx={setSelectedIdx}
              onSelected={onSelected}
            />
          </Portal>
        )} */}
        {/* <CommentPanel /> */}
      </Slate>
    </div>
  )
}

const bodyRootDemo: BulletInput = {
  head: 'root',
  children: [
    {
      head: '1 $ABC [[123]]',
      hashtags: [
        {
          userId: 'string',
          boardId: 123,
          boardStatus: 'ACTIVE',
          text: '#string',
        },
      ],
      oauthorName: 'Hello',
    },
    { head: '2', body: '222 222' },
    {
      head: '3',
      children: [
        {
          head: '1',
          hashtags: [
            {
              userId: 'string',
              boardId: 123,
              boardStatus: 'ACTIVE',
              text: '#string',
            },
          ],
          oauthorName: 'Hello',
        },
        { head: '2', body: '222 222' },
        { head: '3' },
      ],
    },
  ],
}

const TestPage = (): JSX.Element => {
  const [showEditor, setShowEditor] = useState(true)
  const [editorInitialValue, setEditorInitialValue] = useState(initialValueDemo)

  return (
    <div>
      <button
        onClick={() => {
          const value = editorValue()
          setEditorInitialValue(value)
          setShowEditor(false)
        }}
      >
        Close
      </button>
      <button
        onClick={() => {
          setShowEditor(true)
        }}
      >
        Open
      </button>
      {showEditor && <BulletEditor initialValue={editorInitialValue} />}
    </div>
  )
}

export default TestPage
