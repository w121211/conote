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
  LcMirrorElement,
  LiElement,
  UlElement,
} from './slate-custom-types'
import {
  isLcBody,
  isLcHead,
  onKeyDown as withLcbodyOnKeyDown,
  removeLcBody,
} from './with-lcbody'
// import { useSearch } from './search'

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

  // const inputRef = useRef<HTMLInputElement | null>(null)
  // const [value, setValue] = useState('')

  // const headRef = useRef<HTMLSpanElement | null>(null)

  // useEffect(() => {
  //   if (element.editingBody) {
  //     console.log('render2')
  //     // ReactEditor.blur(editor)
  //     console.log(inputRef.current)
  //     // TODO: firefox 在focus後會re-render element，造成blur被執行
  //     inputRef.current?.focus()
  //   }
  // }, [element])

  // useEffect(() => {
  //   if (!focused && element.editingBody) {
  //     const path = ReactEditor.findPath(editor, element)
  //     Transforms.setNodes<LcElement>(
  //       editor,
  //       {
  //         editingBody: undefined,
  //         // body: value,
  //       },
  //       { at: path },
  //     )
  //   }
  // }, [element, focused])

  // console.log('lc focused?' + focused)

  // const bodyInput = (
  //   <input
  //     type="text"
  //     ref={inputRef}
  //     value={value}
  //     onChange={(e) => setValue(e.target.value)}
  //     // onKeyDown={e => {
  //     //   if (e.shiftKey && e.key === 'Enter') {
  //     //     console.log('input key down')
  //     //     e.preventDefault()
  //     //     // inputRef.current?.blur()

  //     //     // headRef.current?.focus()
  //     //     const path = ReactEditor.findPath(editor, element)
  //     //     Transforms.setNodes<LcElement>(
  //     //       editor,
  //     //       {
  //     //         editingBody: undefined,
  //     //         body: value,
  //     //       },
  //     //       { at: path },
  //     //     )

  //     //     // 重新focus，並將指標移到lc尾端
  //     //     ReactEditor.focus(editor)
  //     //     Transforms.select(editor, path)
  //     //     Transforms.collapse(editor, { edge: 'end' })
  //     //   }
  //     // }}
  //     // onFocus={e => {
  //     //   // e.preventDefault()
  //     //   console.log('onFocus')
  //     // }}
  //     onBlur={(e) => {
  //       if (e.currentTarget === e.target) {
  //         console.log('unfocused self')
  //       }
  //       // if (e.currentTarget === e.target && !focused) {
  //       //   console.log('unfocused self')
  //       //   console.log('focused?', focused)
  //       //   const path = ReactEditor.findPath(editor, element)
  //       //   Transforms.setNodes<LcElement>(
  //       //     editor,
  //       //     {
  //       //       editingBody: undefined,
  //       //       // body: value,
  //       //     },
  //       //     { at: path },
  //       //   )
  //       // } else {
  //       //   console.log('unfocused child', e.target)
  //       // }
  //       // if (!e.currentTarget.contains(e.relatedTarget)) {
  //       //   // Not triggered when swapping focus between children
  //       //   console.log('focus left self')
  //       // }
  //       // if (inputRef.current && !inputRef.current.contains(e.target) && document.activeElement === inputRef.current) {
  //       //   console.log('onBlur self')
  //       //   console.log(element.editingBody)
  //       //   console.log(e)
  //       // }
  //     }}
  //   />
  // )

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
        {/* {sourceUrl}
        {element.id}
        {element.error}
        {element.freeze && 'freeze'} */}
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

const Label = (
  props: RenderElementProps & {
    element: LabelInlineElement
    oauthorName?: string
    sourceUrl?: string
  }
) => {
  const { attributes, children, element, oauthorName, sourceUrl } = props
  const readonly = useReadOnly()
  const focused = useFocused()
  const selected = useSelected()

  useEffect(() => {
    console.log(readonly, focused, selected)
    // if (focused && !selected) {
    // const path = ReactEditor.findPath(editor, element)
    // removeLcBody(editor, [element, path])
    // }
  }, [readonly, focused, selected])
  if (readonly) {
    return <button {...attributes}>{children}</button>
  }
  return (
    <span {...attributes} style={{ color: 'red' }}>
      {children}
    </span>
  )
}

const LcMirror = (
  props: RenderElementProps & {
    element: LcMirrorElement
    oauthorName?: string
    sourceUrl?: string
  }
) => {
  const { attributes, children, element, oauthorName, sourceUrl } = props
  const readonly = useReadOnly()
  const focused = useFocused()
  const selected = useSelected()

  useEffect(() => {
    console.log(readonly, focused, selected)
    // if (focused && !selected) {
    // const path = ReactEditor.findPath(editor, element)
    // removeLcBody(editor, [element, path])
    // }
  }, [readonly, focused, selected])

  if (readonly) {
    return (
      <div>
        <button {...attributes}>{children}</button>
        <EditorModal />
      </div>
    )
  }
  return (
    <span {...attributes} style={{ color: 'blue' }}>
      {children}
    </span>
  )
}

const CustomElement = (
  props: RenderElementProps & {
    oauthorName?: string
    sourceUrl?: string
    withMirror: boolean
  }
) => {
  const { attributes, children, element, oauthorName, sourceUrl, withMirror } =
    props

  switch (element.type) {
    case 'label':
      return (
        <Label {...{ attributes, children, element, oauthorName, sourceUrl }} />
      )
    case 'lc-mirror':
      return (
        <LcMirror
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
    return <div {...{ attributes, children, element }} />
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

const withLabel = (editor: Editor): Editor => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = (element) => {
    return element.type === 'label' ? true : isInline(element)
  }

  // editor.insertText = text => {
  //   if (text && isUrl(text)) {
  //     wrapLink(editor, text)
  //   } else {
  //     insertText(text)
  //   }
  // }

  // editor.insertData = data => {
  //   const text = data.getData('text/plain')

  //   if (text && isUrl(text)) {
  //     wrapLink(editor, text)
  //   } else {
  //     insertData(data)
  //   }
  // }

  return editor
}

const withTest = (editor: Editor) => {
  const { isVoid } = editor

  // editor.isVoid = (element) => {
  //   return element.type === 'lc-body' ? true : isVoid(element)
  // }

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
    // () => withAutoComplete(withBullet(withHistory(withReact(createEditor())))),
    // () => withList(withHistory(withReact(createEditor()))),
    // () => withMirror(withList(withHistory(withReact(createEditor())))),
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
  // const [searchPanel, onValueChange] = useSearch(editor)

  // useEffect(() => {
  //   if (searchAllResult.data) {
  //     setSuggestions(searchAllResult.data.searchAll)
  //   } else {
  //     setSuggestions(null)
  //   }
  // }, [searchAllResult])

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

            sessionStorage.setItem('editorValue', JSON.stringify(value))
          } else {
            throw new Error('value 需為 li array')
          }
        }}
      >
        <Editable
          autoCorrect="false"
          // decorate={decorate}
          readOnly={readonly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={(event) => {
            withLcbodyOnKeyDown(event, editor)
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
      </Slate>
    </div>
  )
}

const ModalEditor = () => {
  const [isOpen, setIsOpen] = useState(true)

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      // style={customStyles}
      contentLabel="Example Modal"
    >
      <button onClick={closeModal}>close</button>
      <BulletEditor />
    </Modal>
  )
}

const TestPage = (): JSX.Element => {
  // sessionStorage.removeItem('key')
  // sessionStorage.clear()
  const data = sessionStorage.getItem('key')

  return (
    <div>
      <BulletEditor />
      {/* <hr />
      <BulletEditor /> */}
    </div>
  )
}

export default TestPage
