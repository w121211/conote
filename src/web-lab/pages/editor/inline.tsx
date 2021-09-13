import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  CSSProperties,
  useRef,
} from 'react'
import Modal from 'react-modal'
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
import {
  isLcBody,
  isLcHead,
  onKeyDown as withLcbodyOnKeyDown,
  removeLcBody,
} from './with-lcbody'
import { CustomText } from '../../../web/components/editor/slate-custom-types'
// import { useSearch } from './search'

const initialValueDemo: LiElement[] = [
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        children: [
          {
            type: 'lc-head',
            children: [
              {
                text: '::$XX this is [[some test]] ::$XX @someon #hashtag #Hashtag2 @https://developer.mozilla.org',
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
        children: [
          {
            type: 'lc-head',
            // body: '__11',
            children: [
              { text: '::[[A mirror]] ' },
              { type: 'label', children: [{ text: '#label' }] },
            ],
          },
          // { type: 'lc-body', children: [{ text: '__11' }] },
        ],
      },
    ],
  },
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        children: [
          { type: 'lc-head', body: '__22', children: [{ text: '::$TICKER' }] },
          // { type: 'lc-body', children: [{ text: '__22' }] },
        ],
      },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [
              {
                type: 'lc',
                children: [
                  { type: 'lc-head', body: '__33', children: [{ text: '33' }] },
                  { type: 'lc-body', children: [{ text: '__33' }] },
                ],
              },
            ],
          },
          {
            type: 'li',
            children: [
              {
                type: 'lc',
                children: [
                  { type: 'lc-head', body: '__44', children: [{ text: '44' }] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

export function isUl(node: Node): node is UlElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'ul'
}

export function isLi(node: Node): node is LiElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'li'
}

export function isLiArray(nodes: Node[]): nodes is LiElement[] {
  for (const e of nodes) {
    if (!isLi(e)) {
      return false
    }
  }
  return true
}

export function isLc(node: Node): node is LcElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'lc'
}

export function lcPath(liPath: Path): Path {
  return [...liPath, 0]
}

export function ulPath(liPath: Path): Path {
  return [...liPath, 1]
}

const LcBody = (
  props: RenderElementProps & {
    element: LcBodyElement
  }
) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）

  useEffect(() => {
    if (focused && !selected) {
      const path = ReactEditor.findPath(editor, element)
      removeLcBody(editor, [element, path])
    }
  }, [selected])

  return <div {...attributes}>{children}</div>
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

const CustomElement = (
  props: RenderElementProps & {
    oauthorName?: string
    sourceUrl?: string
  }
) => {
  const { attributes, children, element, oauthorName, sourceUrl } = props

  switch (element.type) {
    case 'label':
      return (
        <Label {...{ attributes, children, element, oauthorName, sourceUrl }} />
      )
    case 'mirror':
      return (
        <Mirror
          {...{ attributes, children, element, oauthorName, sourceUrl }}
        />
      )
    // case 'mirror':
    //   return (
    //     <Mirror
    //       {...{ attributes, children, element, oauthorName, sourceUrl }}
    //     />
    //   )
  }

  if (isLcHead(element)) {
    return (
      <LcHead {...{ attributes, children, element, oauthorName, sourceUrl }} />
    )
  }
  if (isLcBody(element)) {
    return (
      <LcBody {...{ attributes, children, element, oauthorName, sourceUrl }} />
    )
  }
  if (isLc(element)) {
    return <span {...attributes}>{children}</span>
  }
  if (isLi(element)) {
    return <Li {...{ attributes, children, element }} />
  }
  if (isUl(element)) {
    return <Ul {...{ attributes, children, element }} />
  }
  return <span {...attributes}>{children}</span>
}

// ------ Main code start ------

function streamToString(stream: TokenStream, ignoreTokenType?: string): string {
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

/**
 * @see
 * url https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 * hashtag https://stackoverflow.com/questions/38506598/regular-expression-to-match-hashtag-but-not-hashtag-with-semicolon
 */
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

function tokenize(text: string): (string | Token)[] {
  return prismTokenize(text, grammar)
}

function parseLcHead(
  editor: Editor,
  lcBodyEntry: NodeEntry<LcHeadElement>
): void {
  const [node, path] = lcBodyEntry

  const tokens = tokenize(Node.string(node))

  // TODO: validate

  function _toInlineElement(
    token: string | Token
  ): CustomText | LabelInlineElement | MirrorInlineElement {
    if (typeof token === 'string') {
      return { text: token }
    }
    switch (token.type) {
      case 'mirror-ticker':
      case 'mirror-topic': {
        const mirrorSymbol = streamToString(token.content)
        return {
          type: 'mirror',
          mirrorSymbol,
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

  // const inlines = tokens.map((e) => _toInlineElement(e))
  const inlines: (CustomText | LabelInlineElement | MirrorInlineElement)[] = [
    { text: '11 22 33 44 55 66 77 88' },
    { type: 'label', children: [{ text: '22' }] },
    { type: 'label', children: [{ text: '33' }] },
  ]
  Transforms.removeNodes(editor, {
    at: path,
    match: (n, p) => Path.isChild(p, path),
  })
  // Transforms.insertFragment(editor, inlines, { at: [...path, 0] })
  Transforms.insertNodes(editor, inlines, { at: [...path, 0] })
}

const LcHead = (
  props: RenderElementProps & {
    element: LcHeadElement
  }
) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）
  const readonly = useReadOnly()

  useEffect(() => {
    // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
    if ((focused && !selected) || readonly) {
      const path = ReactEditor.findPath(editor, element)
      parseLcHead(editor, [element, path])
      console.log('parseLcHead', path)
    }
    if (selected) {
      const path = ReactEditor.findPath(editor, element)
      // parseLcHead(editor, [element, path])
      Transforms.unwrapNodes(editor, {
        at: path,
        match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
      })
      console.log('unwrapNodes', path)
    }
  }, [selected, readonly])

  return (
    <div {...attributes}>
      <li>
        <span>{children}</span>
      </li>

      <div contentEditable={false} style={{ color: 'green' }}>
        {!element.isEditingBody && (
          <span style={{ color: 'red' }}>{element.body}</span>
        )}
        {/* {placeholder && Node.string(element).length === 0 && <span style={{ color: 'grey' }}>{placeholder}</span>} */}
        {/* {element.op === 'CREATE' && authorSwitcher} */}
      </div>
    </div>
  )
}

const Mirror = (
  props: RenderElementProps & {
    element: MirrorInlineElement
    oauthorName?: string
    sourceUrl?: string
  }
) => {
  const { attributes, children, element, oauthorName, sourceUrl } = props
  const readonly = useReadOnly()

  if (readonly) {
    return <button {...attributes}>{children}</button>
  }
  return <span {...attributes}>{children}</span>
}

const Label = (props: RenderElementProps & { element: LabelInlineElement }) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
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

const withLabel = (editor: Editor): Editor => {
  const { isInline } = editor

  editor.isInline = (element) => {
    return ['label', 'mirror'].includes(element.type) ? true : isInline(element)
  }

  return editor
}

export const BulletEditor = (props: {
  initialValue?: LiElement[]
  authorName?: string
  sourceUrl?: string
  withMirror?: boolean
}): JSX.Element => {
  const {
    initialValue = initialValueDemo,
    authorName,
    sourceUrl,
    withMirror: isWithMirror = false,
  } = props

  const [value, setValue] = useState<LiElement[]>(initialValue)
  const editor = useMemo(
    () => withLabel(withHistory(withReact(createEditor()))),
    []
  )
  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <CustomElement
        {...{ ...props, authorName, sourceUrl, withMirror: isWithMirror }}
      />
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
          onKeyDown={(event) => {
            withLcbodyOnKeyDown(event, editor)
          }}
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
