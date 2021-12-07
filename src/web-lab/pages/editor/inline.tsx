import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  CSSProperties,
  useRef,
} from 'react'
import { Grammar, Token, tokenize as prismTokenize, TokenStream } from 'prismjs'
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
  Point,
} from 'slate'
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  ReactEditor,
  RenderElementProps,
  useFocused,
  useReadOnly,
  useSelected,
  RenderLeafProps,
} from 'slate-react'
import { withHistory } from 'slate-history'
import {
  LabelInlineElement,
  LcBodyElement,
  LcElement,
  LcHeadElement,
  LiElement,
  MirrorInlineElement,
  UlElement,
} from './slate-custom-types'
import { CustomText } from '../../../web/components/editor/slate-custom-types'
import { nanoid } from 'nanoid'
// import { useSearch } from './search'

const initialValueDemo: LiElement[] = [
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        id: nanoid(),
        children: [
          {
            type: 'mirror',
            children: [{ text: '::$AA' }],
          },
          { text: ' Hello world' },
        ],
      },
    ],
  },
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        id: nanoid(),
        children: [
          { text: '::[[A mirror]] ' },
          { type: 'label', children: [{ text: '#label' }] },
        ],
      },
    ],
  },
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        id: nanoid(),
        children: [{ text: '::$TICKER' }],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              {
                type: 'lc',
                id: nanoid(),

                children: [{ text: '33' }],
              },
            ],
          },
          {
            type: 'li',
            children: [
              {
                type: 'lc',
                id: nanoid(),
                children: [{ text: '44' }],
              },
            ],
          },
        ],
      },
    ],
  },
]

const decorate = ([node, path]: NodeEntry): Range[] => {
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

  const tokens = tokenize(node.text)

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

function isLi(node: Node): node is LiElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'li'
}

function isLiArray(nodes: Node[]): nodes is LiElement[] {
  for (const e of nodes) {
    if (!isLi(e)) {
      return false
    }
  }
  return true
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let style: React.CSSProperties = {}

  switch (leaf.type) {
    case 'url':
    case 'ticker':
    case 'topic':
    case 'mirror-ticker':
    case 'mirror-topic':
    case 'hashtag':
    case 'user': {
      style = { color: 'brown' }
      break
    }
  }
  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  )
}

const Li = (props: RenderElementProps & { element: LiElement }) => {
  const { attributes, children } = props
  return <div {...attributes}>{children}</div>
}

const Ul = (props: RenderElementProps & { element: UlElement }) => {
  const { attributes, children, element } = props
  // { display: 'none', visibility: 'hidden', height: 0 }
  const style: CSSProperties = element.fold ? { display: 'none' } : {}
  const editor = useSlateStatic()
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <button
          onClick={() => {
            const path = ReactEditor.findPath(editor, element)
            Transforms.deselect(editor)
            Transforms.setNodes<UlElement>(
              editor,
              { fold: element.fold ? undefined : true },
              { at: path }
            )
          }}
        >
          Fold
        </button>
      </div>
      <ul style={style}>{children}</ul>
    </div>
  )
}

const streamToString = (
  stream: TokenStream,
  ignoreTokenType?: string
): string => {
  let t = ''

  if (typeof stream === 'string') {
    return stream
  } else if (Array.isArray(stream)) {
    for (const e of stream) {
      t += streamToString(e, ignoreTokenType)
    }
  } else if (ignoreTokenType === undefined || ignoreTokenType !== stream.type) {
    t += streamToString(stream.content, ignoreTokenType)
  }
  return t
}

const grammar: Grammar = {
  'mirror-ticker': { pattern: /^::\$[A-Z-=]+\b/ },
  'mirror-topic': { pattern: /^::\[\[[^\]\n]+\]\]\B/u },
  ticker: { pattern: /\$[A-Z-=]+/ },
  topic: { pattern: /\[\[[^\]\n]+\]\]/u },
  url: {
    pattern:
      /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/,
  },
  hashtag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },
  user: { pattern: /(?<=\s|^)@(?:[a-zA-Z0-9]+|\(author\))(?=\s|$)/ },
}

const tokenize = (text: string): (string | Token)[] => {
  return prismTokenize(text, grammar)
}

const parseLc = (editor: Editor, lcEntry: NodeEntry<LcElement>): void => {
  const [node, path] = lcEntry

  const tokens = tokenize(Node.string(node))

  // TODO: validate

  const _toInlineElement = (
    token: string | Token
  ): CustomText | LabelInlineElement | MirrorInlineElement => {
    if (typeof token === 'string') {
      return { text: token }
    }
    switch (token.type) {
      case 'mirror-ticker':
      case 'mirror-topic': {
        const mirrorSymbol = streamToString(token.content)
        return {
          type: 'mirror',
          children: [{ text: mirrorSymbol }],
        }
      }
      case 'url':
      case 'ticker':
      case 'topic':
      case 'hashtag':
      case 'user': {
        return {
          type: 'label',
          children: [{ text: streamToString(token.content) }],
        }
      }
    }
    throw new Error()
  }

  const inlines = tokens.map((e) => _toInlineElement(e))
  // const inlines: (CustomText | LabelInlineElement | MirrorInlineElement)[] = [
  //   { text: '11 22 33 44 55 66 77 88' },
  //   { type: 'label', children: [{ text: '22' }] },
  //   { type: 'label', children: [{ text: '33' }] },
  // ]
  Transforms.removeNodes(editor, {
    at: path,
    match: (n, p) => Path.isChild(p, path),
  })
  // Transforms.insertFragment(editor, inlines, { at: [...path, 0] })
  Transforms.insertNodes(editor, inlines, { at: [...path, 0] })
}

const Label = ({ attributes, children, element }: RenderElementProps) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <span
      {...attributes}
      // contentEditable={false}
      // data-cy={`mention-${element.character.replace(' ', '-')}`}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'baseline',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#eee',
        fontSize: '0.9em',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      {children}
    </span>
  )
}

const _Label = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: LabelInlineElement }) => {
  const readonly = useReadOnly()
  const selected = useSelected()

  // useEffect(() => {
  //   // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
  //   if (selected) {
  //     const path = ReactEditor.findPath(editor, element)
  //     // parseLcHead(editor, [element, path])
  //     Transforms.unwrapNodes(editor, { at: path })
  //   }
  // }, [selected])

  // useEffect(() => {
  //   // console.log(readonly, focused, selected)
  // }, [readonly, focused, selected])

  if (readonly) {
    return <button {...attributes}>{children}</button>
  }
  return (
    <span {...attributes} style={{ color: 'red' }}>
      <button
        onClick={(event) => {
          event.preventDefault()
          console.log('clicked label')
        }}
      >
        {children}
      </button>
    </span>
  )
}

const Mirror = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: MirrorInlineElement }) => {
  const editor = useSlateStatic()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）
  const readonly = useReadOnly()

  useEffect(() => {
    if ((focused && !selected) || readonly) {
      // cursor 離開 element
      // const path = ReactEditor.findPath(editor, element)
      console.log('cursor leaves mirror')
    }
    if (selected) {
      // const path = ReactEditor.findPath(editor, element)
      // Transforms.unwrapNodes(editor, {
      //   at: path,
      //   match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
      // })
      console.log('cursor enters mirror')
    }
  }, [focused, readonly, selected])

  return (
    <button
      {...attributes}
      onClick={(event) => {
        event.preventDefault()
        console.log('clicked label')
      }}
    >
      {children}
    </button>
  )
}

// const BulletComponent = ({ bullet }: { bullet: BulletDraft }) => {
//   return (
//     <>
//       <li>{bullet.head}</li>
//       {bullet.children.length > 0 && (
//         <ul>
//           {bullet.children.map((e, i) => (
//             <BulletComponent key={i} bullet={e} />
//           ))}
//         </ul>
//       )}
//     </>
//   )
// }

const Lc = ({
  attributes,
  children,
  element,
  sourceUrl,
}: RenderElementProps & {
  element: LcElement
  sourceUrl?: string
}): JSX.Element => {
  const editor = useSlateStatic()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）
  const readonly = useReadOnly()

  useEffect(() => {
    if (!focused || !selected || readonly) {
      // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
      console.log('cursor leaves lc, parse lc')
      const path = ReactEditor.findPath(editor, element)
      parseLc(editor, [element, path])
    }
    if (selected) {
      const path = ReactEditor.findPath(editor, element)
      const { selection } = editor
      console.log(selection)

      if (selection?.anchor.offset === 0) {
        // 用 deselect & select 讓 cursor 不會在碰到 inline-element 時跳回到前一個 lc
        Transforms.deselect(editor)
        Transforms.unwrapNodes(editor, {
          at: path,
          match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
        })

        // TODO: offset 需預先知道最大值，暫時設為0
        Transforms.select(editor, { path, offset: 0 })
      } else {
        Transforms.unwrapNodes(editor, {
          at: path,
          match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
        })
      }
    }
  }, [focused, readonly, selected])

  // 若有 mirror，增加 filter block
  // let mirrorBlock: JSX.Element | null = null
  // const mirrors = element.children.filter(
  //   (e): e is MirrorInlineElement => e.type === 'mirror'
  // )
  // if (mirrors.length === 1) {
  //   const mirror = mirrors[0]
  //   // if (mirror.root) {
  //   //   const filtered = BulletNode.filter({
  //   //     node: mirror.root,
  //   //     matcher: (e) => e.sourceUrl === 'http://hello.world',
  //   //   })
  //   //   if (filtered) {
  //   //     mirrorBlock = (
  //   //       <ul>
  //   //         {filtered.children.map((e, i) => (
  //   //           <BulletComponent key={i} bullet={e} />
  //   //         ))}
  //   //       </ul>
  //   //     )
  //   //   }
  //   // } else {
  //   //   mirrorBlock = <div>Click to edit</div>
  //   // }
  // } else if (mirrors.length > 1) {
  //   mirrorBlock = <div>一行只允許一個 mirror</div>
  // }

  return (
    <div {...attributes}>
      <li>
        <span>{children}</span>
      </li>
      {!selected && (
        <div contentEditable={false} style={{ backgroundColor: 'gray' }}>
          {/* {mirrorBlock} */}
          {/* <span style={{ color: 'red' }}>hello world</span> */}
          {/* {placeholder && Node.string(element).length === 0 && <span style={{ color: 'grey' }}>{placeholder}</span>} */}
          {/* {element.op === 'CREATE' && authorSwitcher} */}
        </div>
      )}
    </div>
  )
}

const CustomElement = (
  props: RenderElementProps & {
    oauthorName?: string
    sourceUrl?: string
  }
) => {
  const { attributes, children, element, oauthorName, sourceUrl } = props

  switch (element.type) {
    case 'label':
      return <Label {...{ attributes, children, element }} />
    case 'mirror':
      return <Mirror {...{ attributes, children, element }} />
    case 'lc':
      return (
        <Lc {...{ attributes, children, element, oauthorName, sourceUrl }} />
      )
    case 'li':
      return <Li {...{ attributes, children, element }} />
    case 'ul':
      return <Ul {...{ attributes, children, element }} />
    default:
      return <span {...attributes}>{children}</span>
  }
}

const withInline = (editor: Editor): Editor => {
  const { isInline, isVoid } = editor

  editor.isInline = (element) => {
    return ['label', 'mirror'].includes(element.type) ? true : isInline(element)
  }

  // editor.isVoid = (element) => {
  //   return ['label', 'mirror'].includes(element.type) ? true : isVoid(element)
  // }

  return editor
}

export const BulletEditor = (props: {
  initialValue?: LiElement[]
  authorName?: string
  sourceUrl?: string
}): JSX.Element => {
  const { initialValue = initialValueDemo, authorName, sourceUrl } = props

  const [value, setValue] = useState<LiElement[]>(initialValue)
  const editor = useMemo(
    () => withInline(withHistory(withReact(createEditor()))),
    []
  )
  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <CustomElement {...{ ...props, authorName, sourceUrl }} />
    ),
    []
  )
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )

  const [readonly, setReadonly] = useState(false)

  return (
    <div>
      <button onClick={() => setReadonly(!readonly)}>
        Readonly {readonly ? 'Y' : 'N'}
      </button>

      <hr />

      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          if (isLiArray(value)) {
            setValue(value)
          } else {
            throw new Error('value 需為 li array')
          }
        }}
      >
        <Editable
          autoCorrect="false"
          decorate={decorate}
          readOnly={readonly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          // onKeyDown={(event) => {
          //   withLcbodyOnKeyDown(event, editor)
          // }}
        />
      </Slate>
    </div>
  )
}

const TestPage = (): JSX.Element => {
  return (
    <div>
      <BulletEditor />
    </div>
  )
}

export default TestPage
