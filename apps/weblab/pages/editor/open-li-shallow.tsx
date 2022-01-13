import { ParsedUrlQuery, ParsedUrlQueryInput } from 'querystring'
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  CSSProperties,
  useRef,
} from 'react'
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
import { useRouter } from 'next/router'
import Link from 'next/link'
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
import { UrlObject } from 'url'
// import { useSearch } from './search'

const initialLi: LiElement = {
  type: 'li',
  children: [
    {
      type: 'lc',
      children: [
        {
          type: 'lc-head',
          children: [{ text: '' }],
        },
      ],
    },
  ],
}
const initialValue0: LiElement[] = [
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
                type: 'mirror',
                children: [{ text: '::$XX' }],
                mirrorSymbol: '::$XX',
              },
              { text: 'hello world' },
            ],
          },
        ],
      },
    ],
  },
]

const initialValue1: LiElement[] = [
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        children: [
          {
            type: 'lc-head',
            children: [
              { text: '' },
              {
                type: 'mirror',
                children: [{ text: '::$XX' }],
                mirrorSymbol: '::$XX',
              },
              { text: '' },
            ],
          },
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
              { text: '11' },
              { text: '11' },
              { type: 'label', children: [{ text: '#label' }] },
              { text: '' },
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
          { type: 'lc-head', body: '__22', children: [{ text: '22' }] },
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

/**
 * @see https://stackoverflow.com/questions/28889826/how-to-set-focus-on-an-input-field-after-rendering
 */
const useFocus = (): [
  React.MutableRefObject<HTMLInputElement | null>,
  VoidFunction
] => {
  const htmlElRef = useRef<HTMLInputElement | null>(null)
  // const setFocus = React.useCallback(() => {
  //   if (htmlElRef.current) htmlElRef.current.focus()
  // }, [htmlElRef])
  const setFocus = (): void => {
    htmlElRef.current?.focus()
  }
  // return React.useMemo(() => [htmlElRef, setFocus], [htmlElRef, setFocus])
  return [htmlElRef, setFocus]
}

export function isUl(node: Node): node is UlElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'ul'
}

export function isLi(node: Node): node is LiElement {
  return !Editor.isEditor(node) && Element.isElement(node) && node.type === 'li'
}

export function isLiArray(nodes: (Node | undefined)[]): nodes is LiElement[] {
  for (const e of nodes) {
    if (e === undefined) {
      return false
    }
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
    oauthorName?: string
    sourceUrl?: string
  }
) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）

  return <div {...attributes}>{children}</div>
}

const LcHead = (
  props: RenderElementProps & {
    element: LcHeadElement
    oauthorName?: string
    sourceUrl?: string
  }
) => {
  const { attributes, children, element, oauthorName, sourceUrl } = props
  const editor = useSlateStatic()

  return (
    <div {...attributes}>
      <li>
        <span>{children}</span>
      </li>
      <div contentEditable={false} style={{ color: 'green' }}>
        {!element.isEditingBody && (
          <span style={{ color: 'red' }}>{element.body}</span>
        )}
      </div>
    </div>
  )
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
    case 'mirror':
      return (
        <Mirror
          {...{ attributes, children, element, oauthorName, sourceUrl }}
        />
      )
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
    return <div {...attributes}>{children}</div>
  }
  if (isLi(element)) {
    return <Li {...{ attributes, children, element }} />
  }
  if (isUl(element)) {
    return <Ul {...{ attributes, children, element }} />
  }
  return <span {...attributes}>{children}</span>
}

// ------------ Main code ------------

const PATH_KEY = 'p'
const MIRROR_KEY = 'm'
const PATH_SPLITTER = '.'

function toUrl(props: {
  curPathname: string
  curQuery: ParsedUrlQuery
  absoluteLiPath?: number[]
  liPath?: number[]
  mirrorSymbol?: string
}): UrlObject {
  const {
    curPathname: pathname,
    curQuery,
    absoluteLiPath,
    liPath,
    mirrorSymbol,
  } = props

  if (absoluteLiPath) {
    if (absoluteLiPath.length === 0) {
      // return `${urlPathname}`
      return { pathname }
    }
    // const params = new URLSearchParams({
    //   [PATH_KEY]: absoluteLiPath.join(PATH_SPLITTER),
    // })
    // return `${urlPathname}?${params.toString()}`
    return {
      pathname,
      query: { [PATH_KEY]: absoluteLiPath.join(PATH_SPLITTER) },
    }
  }
  if (mirrorSymbol) {
    // const params = new URLSearchParams({ [MIRROR_KEY]: mirrorSymbol })
    // return `${urlPathname}?${params.toString()}`
    return {
      pathname,
      query: { [MIRROR_KEY]: mirrorSymbol },
    }
  }
  if (liPath) {
    const p = curQuery[PATH_KEY]
    const basePath =
      typeof p === 'string'
        ? p.split(PATH_SPLITTER).map((e) => parseInt(e))
        : []
    const merged = [...basePath, 1, ...liPath]
    // const params = new URLSearchParams({
    //   [PATH_KEY]: merged.join(PATH_SPLITTER),
    // })
    // return `${urlPathname}?${params.toString()}`
    return {
      pathname,
      query: { [PATH_KEY]: merged.join(PATH_SPLITTER) },
    }
  }
  throw new Error('Need to either provide `liPath` or `mirrorSymbol`')
}

const Mirror = (
  props: RenderElementProps & { element: MirrorInlineElement }
) => {
  const { attributes, children, element } = props
  const router = useRouter()
  return (
    <span {...attributes}>
      <Link
        href={toUrl({
          curPathname: router.pathname,
          curQuery: router.query,
          mirrorSymbol: element.mirrorSymbol,
        })}
      >
        <a>{children}</a>
      </Link>
    </span>
  )
}

const Li = (props: RenderElementProps & { element: LiElement }) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const router = useRouter()

  return (
    <div {...attributes}>
      <span contentEditable={false}>
        <Link
          href={toUrl({
            curPathname: router.pathname,
            curQuery: router.query,
            liPath: ReactEditor.findPath(editor, element),
          })}
        >
          <button>open</button>
        </Link>
      </span>
      {children}
    </div>
  )
}

const withInline = (editor: Editor): Editor => {
  const { isInline } = editor

  editor.isInline = (element) => {
    return ['label', 'mirror'].includes(element.type) ? true : isInline(element)
  }

  return editor
}

const BulletEditor = ({
  initialValue,
  onValueChange,
  authorName,
  sourceUrl,
}: {
  initialValue: LiElement[]
  onValueChange?: (value: LiElement[]) => void
  authorName?: string
  sourceUrl?: string
}): JSX.Element => {
  const [value, setValue] = useState<LiElement[]>(initialValue)
  const editor = useMemo(
    () => withInline(withHistory(withReact(createEditor()))),
    []
  )
  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <CustomElement
        {...{ ...props, authorName, sourceUrl, withMirror: false }}
      />
    ),
    []
  )

  useEffect(() => {
    console.log('initialValue useEffect')
    setValue(initialValue)
  }, [initialValue])

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          if (isLiArray(value)) {
            setValue(value)
            if (onValueChange) {
              onValueChange(value)
            }
          } else {
            throw new Error('value 需為 li array')
          }
        }}
      >
        <Editable
          autoCorrect="false"
          renderElement={renderElement}
          onKeyDown={(event) => {
            withLcbodyOnKeyDown(event, editor)
          }}
        />
      </Slate>
    </div>
  )
}

const TestPage = (): JSX.Element => {
  const [value, setValue] = useState<LiElement[]>(initialValue0)
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      console.log(router.query)
    }
  }, [router])

  return (
    <div>
      <button
        onClick={() => {
          setValue(initialValue1)
        }}
      >
        set value
      </button>
      <BulletEditor initialValue={value} />
    </div>
  )
}

export default TestPage
