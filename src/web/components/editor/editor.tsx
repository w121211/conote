import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import Modal from 'react-modal'
import { useApolloClient } from '@apollo/client'
import { Editor, Transforms, createEditor, Node } from 'slate'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlateStatic,
  withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'
import { editorValue } from '../../apollo/cache'
import { RootBullet } from '../../lib/bullet/types'
import { createAndParseCard, queryAndParseCard } from '../card'
import { LcElement, LiElement, UlElement } from './slate-custom-types'
import { Serializer } from './serializer'
import { isLc, isLi, isLiArray, isUl, onKeyDown as withListOnKeyDown, ulPath, withList } from './with-list'
import { withMirror } from './with-mirror'
import { useInput } from './use-input'
import { withOp } from './with-op'
import BulletSvg from '../bullet-svg/bullet-svg'
import classes from './editor.module.scss'
import HeaderForm from '../header-form/header-form'
import Popover from '../popover/popover'

const initialValueDemo: LiElement[] = [
  {
    type: 'li',
    children: [{ type: 'lc', body: '11', error: 'warning', placeholder: 'placeholder', children: [{ text: '11' }] }],
  },
  {
    type: 'li',
    children: [
      { type: 'lc', body: '22', placeholder: 'placeholder', children: [{ text: '22' }] },
      {
        type: 'ul',
        children: [
          { type: 'li', children: [{ type: 'lc', body: '22-11', children: [{ text: '22-11' }] }] },
          {
            type: 'li',
            children: [
              { type: 'lc', children: [{ text: '' }] },
              {
                type: 'ul',
                children: [
                  { type: 'li', children: [{ type: 'lc', body: '22-11', children: [{ text: '22-11' }] }] },
                  { type: 'li', children: [{ type: 'lc', children: [{ text: '' }] }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       body: '111',
  //       freeze: true,
  //       children: [{ text: '111 這是中文 $AAA' }],
  //     },
  //     {
  //       type: 'ul',
  //       children: [
  //         {
  //           type: 'li',
  //           children: [
  //             {
  //               type: 'lc',
  //               body: '333',
  //               // freeze: true,
  //               id: 123,
  //               warning: 'warning',
  //               children: [{ text: '333' }],
  //             },
  //             {
  //               type: 'ul',
  //               children: [
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '444',
  //                       root: true,
  //                       children: [{ text: '444' }],
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '555',
  //                       children: [{ text: '555' }],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           type: 'li',
  //           children: [
  //             {
  //               type: 'lc',
  //               body: '666',
  //               children: [{ text: '666' }],
  //             },
  //             {
  //               type: 'ul',
  //               children: [
  //                 {
  //                   type: 'li',
  //                   children: [
  //                     {
  //                       type: 'lc',
  //                       body: '777',
  //                       children: [{ text: '777' }],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       root: true,
  //       // placeholder: 'Type some symbol and press enter',
  //       children: [{ text: '$BA' }],
  //       asOauthor: true,
  //     },
  //   ],
  // },
  // {
  //   type: 'li',
  //   children: [
  //     {
  //       type: 'lc',
  //       root: true,
  //       placeholder: 'Type some symbol and press enter',
  //       warning: 'Here is a warning',
  //       children: [{ text: '' }],
  //     },
  //   ],
  // },
]

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

const CommentModal = (props: {
  onClose?: (value: { choosed?: string | null; comment: string }) => void
  pollId: string
  boardId: string
  oauthorName: string
}) => {
  const { onClose, pollId, boardId, oauthorName } = props
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
      <Popover
        visible={isOpen}
        hideBoard={() => {
          setIsOpen(false)
        }}
      >
        <HeaderForm
          initialValue={{ authorChoice: '', authorLines: '' }}
          pollId={pollId}
          boardId={boardId}
          oauthorName={oauthorName}
        />
      </Popover>
    </div>
  )
}

const useAuthorSwitcher = (props: { oauthorName?: string }): [string, JSX.Element] => {
  const { oauthorName } = props
  const [author, setAuthor] = useState<string>(oauthorName ?? '@self')
  const switcher = oauthorName ? (
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
  ) : (
    <span>{author}</span>
  )
  return [author, switcher]
}

const LcMirror = (
  props: RenderElementProps & {
    element: LcElement
    oauthorName?: string
    sourceUrl?: string
    pollId: string
    boardId: string
  },
) => {
  const { attributes, children, element, oauthorName, sourceUrl, pollId, boardId } = props

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

        let newSymbol: true | undefined
        let root: RootBullet | undefined

        const data = await queryAndParseCard({ client, symbol: element.symbol, mirror: true })
        if (data.error) {
          Transforms.setNodes<LcElement>(editor, { error: 'server異常' }, { at: lcPath })
        } else if (data.root === undefined) {
          const _data = await createAndParseCard({ client, symbol: element.symbol, mirror: true })
          if (_data.root) {
            root = _data.root
            newSymbol = true
          }
        } else {
          root = data.root
        }

        if (root) {
          const newLi = Serializer.toRootLi(root, { mirror: true, newSymbol })
          // 移除原本的li，插入新的
          Editor.withoutNormalizing(editor, () => {
            Transforms.removeNodes(editor, { at: liEntry[1] })
            Transforms.insertNodes<LiElement>(editor, newLi, { at: liEntry[1] })
          })
        } else {
          Transforms.setNodes<LcElement>(editor, { error: 'server異常' }, { at: lcPath })
        }

        setLoading(false)
      }
    }

    _queryAndTransform()
    setPlaceholder(element.placeholder)
  }, [element])

  const style: CSSProperties = element.root ? { fontSize: '1em' } : {}

  return (
    <div {...attributes}>
      <li>
        <span style={style}>{children}</span>
      </li>

      {/* <div contentEditable={false} style={{ color: 'green' }}>
        {placeholder && Node.string(element).length === 0 && <span style={{ color: 'grey' }}>{placeholder}</span>}
        {sourceUrl}
        {element.id}
        {element.error}
        {element.freeze && 'freeze'}
      </div> */}
      {console.log(element)}
      {oauthorName && element.symbol && (
        <div contentEditable={false}>
          {loading && <span>loading...</span>}
          {element.createCard && <span>#new</span>}
          {/* <span>{element.symbol}</span>
          <span>{element.error}</span>
          <span>{element.comment?.oauthorComment}</span> */}
          <CommentModal
            oauthorName={oauthorName}
            pollId={pollId}
            boardId={boardId}
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
    </div>
  )
}

const Lc = (props: RenderElementProps & { element: LcElement; oauthorName?: string; sourceUrl?: string }) => {
  const { attributes, children, element, oauthorName, sourceUrl } = props
  const editor = useSlateStatic()
  const [placeholder, setPlaceholder] = useState<string | undefined>()
  const [author, authorSwitcher] = useAuthorSwitcher({ oauthorName })

  useEffect(() => {
    setPlaceholder(element.placeholder)
  }, [element])

  useEffect(() => {
    if (oauthorName && element.op === 'CREATE') {
      const lcPath = ReactEditor.findPath(editor, element)
      if (author === '@self') {
        Transforms.setNodes<LcElement>(editor, { oauthorName: undefined }, { at: lcPath })
      } else {
        Transforms.setNodes<LcElement>(editor, { oauthorName }, { at: lcPath })
      }
    }
  }, [author, element])

  return (
    <div {...attributes}>
      <li>
        <span>{children}</span>
      </li>

      {/* <div contentEditable={false} style={{ color: 'green' }}>
        {placeholder && Node.string(element).length === 0 && <span style={{ color: 'grey' }}>{placeholder}</span>}
        {element.op === 'CREATE' && authorSwitcher}
        {sourceUrl}
        {element.id}
        {element.error}
        {element.freeze && 'freeze'}
      </div> */}
    </div>
  )
}

const Li = (props: RenderElementProps & { element: LiElement }) => {
  const { attributes, children, element } = props

  const [hasUl, setHasUl] = useState(false)
  const [ulFolded, setUlFolded] = useState<true | undefined>()
  const editor = useSlateStatic()

  useEffect(() => {
    const path = ReactEditor.findPath(editor, element)
    try {
      const ul = Editor.node(editor, ulPath(path))
      if (isUl(ul[0])) {
        setHasUl(true)
        setUlFolded(ul[0].folded)
      }
    } catch (err) {
      // 找不到ul
      setHasUl(false)
      setUlFolded(undefined)
    }
  }, [editor, element])

  return (
    <div {...attributes} className={classes.bulletLi}>
      <div contentEditable={false}>
        {hasUl ? (
          <span
            onClick={event => {
              event.preventDefault()
              const path = ReactEditor.findPath(editor, element)
              try {
                const ul = Editor.node(editor, ulPath(path))
                if (isUl(ul[0])) {
                  Transforms.deselect(editor)
                  Transforms.setNodes<UlElement>(editor, { folded: ul[0].folded ? undefined : true }, { at: ul[1] })
                }
              } catch (err) {
                // 不用處理
              }
            }}
          >
            <BulletSvg />
            {/* Fold */}
          </span>
        ) : (
          <BulletSvg />
        )}
      </div>

      <div>{children}</div>
    </div>
  )
}

const Ul = (props: RenderElementProps & { element: UlElement }) => {
  const { attributes, children, element } = props
  // { display: 'none', visibility: 'hidden', height: 0 }
  const style: CSSProperties = element.folded ? { display: 'none' } : {}
  return (
    <div {...attributes}>
      <ul className={classes.bulletUl} style={style}>
        {children}
      </ul>
    </div>
  )
}

const CustomElement = (
  props: RenderElementProps & {
    oauthorName?: string
    sourceUrl?: string
    withMirror: boolean
    pollId: string
    boardId: string
  },
) => {
  const { attributes, children, element, oauthorName, sourceUrl, withMirror, pollId, boardId } = props
  if (isLc(element)) {
    if (element.root && withMirror) {
      return <LcMirror {...{ attributes, children, element, oauthorName, sourceUrl, pollId, boardId }} />
    }
    return <Lc {...{ attributes, children, element, oauthorName, sourceUrl }} />
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
  sourceUrl?: string
  withMirror?: boolean
  pollId: string
  boardId: string
}): JSX.Element => {
  const {
    initialValue = initialValueDemo,
    oauthorName,
    sourceUrl,
    withMirror: withMirrorFlag = false,
    pollId,
    boardId,
  } = props

  const [value, setValue] = useState<LiElement[]>(initialValue)
  // const editor = useMemo(
  //   // () => withAutoComplete(withBullet(withHistory(withReact(createEditor())))),
  //   // () => withList(withHistory(withReact(createEditor()))),
  //   // () => withMirror(withList(withHistory(withReact(createEditor())))),
  //   () => withMirror(withOp(withList(withHistory(withReact(createEditor()))))),
  //   [],
  // )
  const editor = withMirrorFlag
    ? useMemo(() => withMirror(withOp(withList(withHistory(withReact(createEditor()))))), [])
    : useMemo(() => withOp(withList(withHistory(withReact(createEditor())))), [])
  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <CustomElement {...{ ...props, oauthorName, sourceUrl, withMirror: withMirrorFlag, pollId, boardId }} />
    ),
    [],
  )
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])
  const _withListOnKeyDown = useCallback((event: React.KeyboardEvent) => {
    withListOnKeyDown(event, editor)
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
            _withListOnKeyDown(event)
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
