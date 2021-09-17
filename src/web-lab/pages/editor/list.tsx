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
import {
  LabelInlineElement,
  LcBodyElement,
  LcElement,
  LcHeadElement,
  LiElement,
  UlElement,
} from './slate-custom-types'
import { withList } from '../../../web/components/editor/with-list'
// import { useSearch } from './search'

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

const initialValueDemo: LiElement[] = [
  {
    type: 'li',
    children: [
      {
        type: 'lc',
        children: [
          {
            type: 'lc-mirror',
            children: [{ text: '::$XX' }],
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
            children: [{ text: '11' }, { text: '11' }, { text: '' }],
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

const LcHead = (
  props: RenderElementProps & {
    element: LcHeadElement
  }
) => {
  const { attributes, children, element } = props
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
    case 'lc-head':
      return (
        <LcHead
          {...{ attributes, children, element, oauthorName, sourceUrl }}
        />
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
  const editor = useMemo(
    () => withList(withHistory(withReact(createEditor()))),
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
          if (isLiArray(value)) {
            setValue(value)
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
  return (
    <div>
      <BulletEditor />
    </div>
  )
}

export default TestPage
