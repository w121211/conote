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
import {
  LabelInlineElement,
  LcBodyElement,
  LcElement,
  LcHeadElement,
  LiElement,
  UlElement,
} from './slate-custom-types'
import {
  createListOperator,
  ListHelper,
  onKeyDownWithList,
  withList,
} from './with-list'
// import { useSearch } from './search'

const initialValueDemo: LiElement[] = [
  {
    type: 'li',
    children: [{ type: 'lc', id: '1', children: [{ text: '111' }] }],
  },
  {
    type: 'li',
    children: [{ type: 'lc', id: '1', children: [{ text: '222' }] }],
  },
  {
    type: 'li',
    children: [
      { type: 'lc', id: '1', children: [{ text: '111' }] },
      {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lc', id: '1', children: [{ text: '333' }] }],
          },
          {
            type: 'li',
            children: [{ type: 'lc', id: '1', children: [{ text: '333' }] }],
          },
        ],
      },
    ],
  },
  {
    type: 'li',
    children: [{ type: 'lc', id: '1', children: [{ text: '222' }] }],
  },
  {
    type: 'li',
    children: [{ type: 'lc', id: '1', children: [{ text: '333' }] }],
  },
]

const Lc = (
  props: RenderElementProps & { element: LcElement; sourceUrl?: string }
): JSX.Element => {
  const { attributes, children, element, sourceUrl } = props
  const editor = useSlateStatic()
  const readonly = useReadOnly()
  const focused = useFocused() // 整個editor是否focus
  const selected = useSelected() // 這個element是否被select（等同指標在這個element裡）
  // const [author, authorSwitcher] = useAuthorSwitcher({ authorName })
  // const [placeholder, setPlaceholder] = useState<string | undefined>()
  // useEffect(() => {
  //   setPlaceholder(element.placeholder)
  // }, [element])
  // const author = location.author

  // console.log('lc entry', element)

  // useEffect(() => {
  //   if (element.op === 'CREATE') {
  //     let lcPath: number[] | undefined
  //     if (author && element.author === undefined) {
  //       lcPath = ReactEditor.findPath(editor, element)
  //       Transforms.setNodes<LcElement>(editor, { author }, { at: lcPath })
  //     }
  //     if (sourceUrl && element.sourceUrl === undefined) {
  //       Transforms.setNodes<LcElement>(editor, { sourceUrl }, { at: lcPath ?? ReactEditor.findPath(editor, element) })
  //     }
  //   }
  // }, [author, element, sourceUrl])

  // useEffect(() => {
  //   // cursor 離開 lc-head，將 text 轉 tokens、驗證 tokens、轉成 inline-elements
  //   if ((focused && !selected) || readonly) {
  //     const path = ReactEditor.findPath(editor, element)
  //     parseLcAndReplace({ editor, lcEntry: [element, path] })
  //     // console.log('parseLcAndReplace', path)
  //   }
  //   // cursor 進入 lc-head，將 inlines 轉回 text，避免直接操作 inlines
  //   if (selected) {
  //     const path = ReactEditor.findPath(editor, element)
  //     Transforms.unwrapNodes(editor, {
  //       at: path,
  //       match: (n, p) => Element.isElement(n) && Path.isChild(p, path),
  //     })
  //     // console.log('unwrapNodes', path)
  //   }
  // }, [selected, readonly])

  return (
    <div {...attributes}>
      <span>{children}</span>
      {((focused && !selected) || readonly) && (
        <span contentEditable={false} style={{ color: 'green' }}>
          {/* {author === element.author && element.author} */}
          {/* {sourceUrl === element.sourceUrl && sourceUrl} */}
          {/* {element.emojis?.map((e, i) => (
            <EmojiButotn key={i} emoji={e} />
          ))} */}
        </span>
      )}
    </div>
  )
}

const Li = (props: RenderElementProps & { element: LiElement }) => {
  const { attributes, children } = props
  return <li {...attributes}>{children}</li>
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

const CustomElement = ({
  attributes,
  children,
  element,
  oauthorName,
  sourceUrl,
}: RenderElementProps & {
  oauthorName?: string
  sourceUrl?: string
}) => {
  switch (element.type) {
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

export const BulletEditor = (props: {
  initialValue?: LiElement[]
  authorName?: string
  sourceUrl?: string
}): JSX.Element => {
  const { initialValue = initialValueDemo, authorName, sourceUrl } = props

  const [value, setValue] = useState<LiElement[]>(initialValue)
  const listOperator = useMemo(() => createListOperator({}), [])
  const editor = useMemo(
    () => withList(withHistory(withReact(createEditor())), listOperator),
    []
  )
  const renderElement = useCallback(
    (props: RenderElementProps) => (
      <CustomElement {...{ ...props, authorName, sourceUrl }} />
    ),
    []
  )

  return (
    <div>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => {
          if (ListHelper.isLiArray(value)) {
            setValue(value)
          } else {
            throw new Error('value 需為 li array')
          }
        }}
      >
        <ul>
          <Editable
            autoCorrect="false"
            renderElement={renderElement}
            onKeyDown={(event) => {
              onKeyDownWithList(event, editor, listOperator)
            }}
          />
        </ul>
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
