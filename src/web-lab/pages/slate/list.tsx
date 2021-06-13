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
        children: [{ text: '111' }],
      },
      {
        type: 'list',
        children: [
          {
            type: 'list-item',
            children: [{ text: '111' }],
          },
          {
            type: 'list-item',
            children: [{ text: '111' }],
          },
        ],
      },
      {
        type: 'list-item',
        children: [{ text: '111' }],
      },
    ],
  },
]

const CustomElement = (props: RenderElementProps): JSX.Element => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'list':
      return <ul {...attributes}>{children}</ul>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}

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

const CheckListsExample = (): JSX.Element => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback(
    (props: RenderElementProps) => <CustomElement {...props} />,
    []
  )
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

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
