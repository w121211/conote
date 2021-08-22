import { ParsedUrlQuery } from 'querystring'
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  CSSProperties,
  useRef,
} from 'react'
import Modal from 'react-modal'
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

  useEffect(() => {
    if (focused && !selected) {
      const path = ReactEditor.findPath(editor, element)
      removeLcBody(editor, [element, path])
    }
  }, [selected])

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

function toLink(props: {
  urlPathname: string
  urlQuery: ParsedUrlQuery
  absoluteLiPath?: number[]
  liPath?: number[]
  mirrorSymbol?: string
}): string {
  const { urlPathname, urlQuery, absoluteLiPath, liPath, mirrorSymbol } = props

  if (absoluteLiPath) {
    if (absoluteLiPath.length === 0) {
      return `${urlPathname}`
    }
    const params = new URLSearchParams({
      [PATH_KEY]: absoluteLiPath.join(PATH_SPLITTER),
    })
    return `${urlPathname}?${params.toString()}`
  }
  if (mirrorSymbol) {
    const params = new URLSearchParams({ [MIRROR_KEY]: mirrorSymbol })
    return `${urlPathname}?${params.toString()}`
  }
  if (liPath) {
    const p = urlQuery[PATH_KEY]
    const basePath =
      typeof p === 'string'
        ? p.split(PATH_SPLITTER).map((e) => parseInt(e))
        : []
    const merged = [...basePath, 1, ...liPath]
    const params = new URLSearchParams({
      [PATH_KEY]: merged.join(PATH_SPLITTER),
    })
    return `${urlPathname}?${params.toString()}`
  }
  throw new Error('Need to either provide `liPath` or `mirrorSymbol`')
}

const fakeRoot: LiElement = {
  type: 'li',
  children: [
    {
      type: 'lc',
      children: [{ type: 'lc-head', children: [{ text: 'fake root' }] }],
    },
    {
      type: 'ul',
      children: [...initialValueDemo],
    },
  ],
}

const useLocalValue = (): {
  root: LiElement | undefined
  mirror?: LiElement
  path: number[] | undefined
  openedLi: LiElement | undefined
  value: LiElement[] | undefined
  setLocalValue: (value: LiElement[]) => void
} => {
  const router = useRouter()
  const [root, setRoot] = useState<LiElement>()
  const [mirror, setMirror] = useState<LiElement>()
  const [path, setPath] = useState<number[]>()
  const [openedLi, setOpenedLi] = useState<LiElement>() // li opened by given path
  const [value, setValue] = useState<LiElement[]>()

  const setLocalValue = useCallback(
    (value: LiElement[]) => {
      if (openedLi) {
        openedLi.children = [
          openedLi.children[0],
          { type: 'ul', children: value },
        ] // shallow copy
        window.sessionStorage.setItem('root', JSON.stringify(root))
      }
    },
    [openedLi, root]
  )

  useEffect(() => {
    if (window && router.isReady) {
      const p = router.query[PATH_KEY]
      const m = router.query[MIRROR_KEY]

      const data = window.sessionStorage.getItem('root')
      let root: LiElement | undefined
      if (data) {
        root = JSON.parse(data)
        console.log('got local root', root)
        setRoot(root)
      }

      const _setRest = (root: LiElement, path: number[]) => {
        const node = Node.get(root, path)
        if (isLi(node)) {
          setValue(node.children[1]?.children ?? [initialLi])
          setOpenedLi(node)
        } else {
          console.log(node)
          throw new Error('Unexpected error')
        }
      }

      // URL search params 給予 mirror，按該 mirror 開啟
      if (typeof m === 'string') {
        const data = window.sessionStorage.getItem(m)
        let mirror: LiElement
        if (data) {
          mirror = JSON.parse(data)
        } else {
          console.log('simulate quering mirror... (use dummy data)')
          mirror = fakeRoot
        }
        setMirror(mirror)

        const path: number[] = []
        setPath(path)
        _setRest(mirror, path)
        return
      }

      // URL search params 給予 path，按該 path 開啟
      if (typeof p === 'string') {
        if (root === undefined) throw new Error('找不到 root，要先從 root 進入')

        const path = p.split(PATH_SPLITTER).map((e) => parseInt(e))
        setPath(path)
        _setRest(root, path)
        return
      }

      // 沒有給 path 或 mirror ，視為 root
      if (root === undefined) {
        console.log('simulate quering root... (use dummy data)')
        root = fakeRoot
        setRoot(fakeRoot)
      }
      const path: number[] = []
      setPath(path)
      _setRest(root, [])
    }
  }, [router])

  return {
    root,
    mirror,
    path,
    openedLi,
    value,
    setLocalValue,
  }
}

const Mirror = (
  props: RenderElementProps & { element: MirrorInlineElement }
) => {
  const { attributes, children, element } = props
  const readonly = useReadOnly()
  const router = useRouter()

  const href = toLink({
    urlPathname: router.pathname,
    urlQuery: router.query,
    mirrorSymbol: element.mirrorSymbol,
  })

  if (readonly) {
    return (
      <a {...attributes} href={href}>
        {children}
      </a>
    )
  }
  return (
    <span {...attributes} style={{ color: 'blue' }}>
      {children}
    </span>
  )
}

const Li = (props: RenderElementProps & { element: LiElement }) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const router = useRouter()

  const href = toLink({
    urlPathname: router.pathname,
    urlQuery: router.query,
    liPath: ReactEditor.findPath(editor, element),
  })

  return (
    <div {...attributes}>
      <span contentEditable={false}>
        <a href={href}>open</a>
      </span>
      {children}
    </div>
  )
}

const BulletEditor = (props: {
  initialValue: LiElement[]
  onValueChange?: (value: LiElement[]) => void
  authorName?: string
  sourceUrl?: string
}): JSX.Element => {
  const { initialValue, onValueChange, authorName, sourceUrl } = props

  const [value, setValue] = useState<LiElement[]>(initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <CustomElement
        {...{ ...props, authorName, sourceUrl, withMirror: false }}
      />
    ),
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
          readOnly={readonly}
          renderElement={renderElement}
          onKeyDown={(event) => {
            withLcbodyOnKeyDown(event, editor)
          }}
        />
      </Slate>
    </div>
  )
}

type Level = {
  text: string
  path: number[]
}

function getLevels(root: LiElement, path: number[]): Level[] {
  const levels: Level[] = []
  for (const [n, p] of Node.levels(root, path)) {
    if (isLi(n)) {
      const [lc] = n.children
      levels.push({
        text: Node.string(lc),
        path: p,
      })
    }
  }
  return levels
}

const TestPage = (): JSX.Element => {
  const router = useRouter()
  const { root, mirror, path, openedLi, value, setLocalValue } = useLocalValue()
  const [levels, setLevels] = useState<Level[]>()

  useEffect(() => {
    if (root && path) {
      const levels = getLevels(root, path)
      levels.pop() // 最後一個是當前的 li ，不需要
      setLevels(levels)
    }
  }, [root, path])

  return (
    <div>
      {levels &&
        levels.map((e, i) => (
          <span key={i}>
            <a
              href={toLink({
                urlPathname: router.pathname,
                urlQuery: router.query,
                absoluteLiPath: e.path,
              })}
            >
              {e.text}
            </a>
            |
          </span>
        ))}

      <h1>{openedLi && Node.string(openedLi.children[0])}</h1>

      {value && (
        <BulletEditor
          initialValue={value}
          onValueChange={(value) => {
            setLocalValue(value)
          }}
        />
      )}
    </div>
  )
}

export default TestPage
