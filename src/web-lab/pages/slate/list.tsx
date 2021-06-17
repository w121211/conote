/* eslint-disable no-console */
import React, { useState, useMemo, useCallback } from 'react'
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
} from 'slate-react'
import { withHistory } from 'slate-history'

const initialValue: Descendant[] = [
  {
    type: 'list',
    children: [
      {
        type: 'list-item',
        body: 'aaabbbccc',
        children: [
          { text: '111' },
          // {
          //   type: 'list-item-body',
          //   children: [{ text: '111222333444555' }],
          // },
        ],
      },
      {
        type: 'list',
        children: [
          {
            type: 'list-item',
            body: null,
            children: [{ text: '111' }],
          },
          {
            type: 'list-item',
            body: null,
            children: [{ text: '111' }],
          },
        ],
      },
      {
        type: 'list-item',
        body: null,
        children: [{ text: '111' }],
      },
    ],
  },
]

function indentListItem(editor: Editor, node: NodeEntry<Element>): void {
  const [curNode, curPath] = node

  const prev = Editor.previous<Element>(editor, { at: curPath })
  if (prev === undefined) {
    console.warn('第一個list-item無法縮排')
    return
  }
  const [prevNode, prevPath] = prev
  const [nextNode, nextPath] = Editor.next<Element>(editor, {
    at: curPath,
  }) ?? [undefined, undefined]

  Editor.withoutNormalizing(editor, () => {
    switch (prevNode.type) {
      case 'list': {
        // prev為list -> 併入prev的children中的最後一個
        if (nextPath && nextNode?.type === 'list') {
          // 若next為list -> 與cur一起併入 (先移動next，所以不會影響curPath）
          Transforms.moveNodes(editor, {
            at: nextPath,
            to: [...prevPath, prevNode.children.length],
          })
        }
        // 在next之後放cur，這樣next就會被擠至下一個
        Transforms.moveNodes(editor, {
          at: curPath,
          to: [...prevPath, prevNode.children.length],
        })
        break
      }
      case 'list-item': {
        // prev為list-item -> 創新的list & 併入該list的children
        Transforms.insertNodes(
          editor,
          { type: 'list', children: [] },
          { at: curPath }
        )
        Transforms.moveNodes(editor, {
          at: nextPath, // 因為前面插入了list，原item位置變為next
          to: [...curPath, 0],
        })
        if (nextPath && nextNode?.type === 'list') {
          Transforms.moveNodes(editor, {
            at: nextPath, // 因為cur移走了，所以next位置沒變
            to: [...curPath, 1],
          })
        }
        break
      }
    }
  })
}

function unindentListItem(editor: Editor, node: NodeEntry<Element>): void {
  const [curNode, curPath] = node
  if (curPath.length <= 2) {
    console.warn('list-item最頂層無法縮排')
    return
  }

  const parent = Editor.parent(editor, curPath)
  const [parentNode, parentPath] = parent
  const [nextNode, nextPath] = Editor.next<Element>(editor, {
    at: curPath,
  }) ?? [undefined, undefined]

  Editor.withoutNormalizing(editor, () => {
    // 將cur移動到與parent同層並且是parent的下一個，若nextNode為list，一起移動
    const toPath = Path.next(parentPath)
    if (nextPath && nextNode?.type === 'list') {
      Transforms.moveNodes(editor, { at: nextPath, to: toPath })
    }
    Transforms.moveNodes(editor, { at: curPath, to: toPath })

    // 當parent(list)的children已經為空，刪除parent
    const parentNode = Node.get(editor, parentPath)
    if (Element.isElement(parentNode) && parentNode.children.length === 0) {
      Transforms.removeNodes(editor, { at: parentPath })
    }
  })
}

function withItemBody(editor: Editor): Editor {
  const { insertBreak } = editor

  // editor.isInline = (element) => {
  //   return element.type === 'list-item-body' ? true : isInline(element)
  // }

  // editor.insertBreak = () => {
  // }

  return editor
}

const ListItemElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const editor = useSlateStatic()
  // const readOnly = useReadOnly()
  if (!('body' in element)) {
    return null
  }
  const { body } = element
  return (
    <li {...attributes}>
      {/* <span contentEditable={!readOnly} suppressContentEditableWarning>
        {children}
      </span> */}
      <span>{children}</span>
      {body && (
        <div>
          <span contentEditable={true} style={{ color: 'red' }}>
            {body}
          </span>
          {/* <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          const path = ReactEditor.findPath(editor, element)
          const newProperties: Partial<Element> = {
            checked: event.target.checked,
          }
          Transforms.setNodes(editor, newProperties, { at: path })
        }}
      /> */}
        </div>
      )}
    </li>
  )
}

const CheckListsExample = (): JSX.Element => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props
    switch (element.type) {
      case 'list':
        return <ul {...attributes}>{children}</ul>
      case 'list-item':
        return <ListItemElement {...props} />
      // case 'list-item-body':
      //   return (
      //     <div {...attributes} style={{ color: 'red' }}>
      //       {children}
      //     </div>
      //   )
      default:
        return <p {...attributes}>{children}</p>
    }
  }, [])
  const editor = useMemo(
    () => withHistory(withReact(createEditor())),
    // () => withItemBody(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Editable
        renderElement={renderElement}
        placeholder=""
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          const { selection } = editor

          if (selection && Range.isCollapsed(selection)) {
            if (!['Tab', 'Enter'].includes(event.key)) {
              return
            }

            const [curNode, curPath] = Editor.node(editor, selection)
            const [parentNode, parentPath] = Editor.parent(editor, selection)

            if (
              !Element.isElement(parentNode) ||
              parentNode.type !== 'list-item'
            ) {
              return
            }

            if (event.shiftKey && event.key === 'Tab') {
              event.preventDefault()
              unindentListItem(editor, [parentNode, parentPath])
            } else if (event.key === 'Tab') {
              event.preventDefault()
              indentListItem(editor, [parentNode, parentPath])
            } else if (
              event.key === 'Enter' &&
              Text.isText(curNode) &&
              curNode.text === ''
            ) {
              event.preventDefault()
              unindentListItem(editor, [parentNode, parentPath])
            }
          }
        }}
      />
    </Slate>
  )
}

export default CheckListsExample
