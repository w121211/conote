/* eslint-disable no-console */
/**
 * See: https://github.com/ianstormtaylor/slate/blob/main/docs/concepts/12-typescript.md
 *      https://github.com/ianstormtaylor/slate/blob/main/site/pages/examples/%5Bexample%5D.tsx
 */
// import Prism from 'prismjs'
import React, { useState, useCallback, useMemo, CSSProperties } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Descendant, Text, NodeEntry, Range, Editor } from 'slate'
import { withHistory } from 'slate-history'
import {
  Editor as CardEditor,
  ExtTokenStream,
  streamToStr,
} from '../../../lib/editor/src/index'
import { CustomEditor, CustomText } from './custom-types'

function Leaf({
  attributes,
  children,
  leaf,
}: {
  attributes: any
  children: any
  leaf: CustomText
}): JSX.Element {
  let style: CSSProperties = {}

  console.log(leaf)
  if (leaf.ticker) {
    style = { fontWeight: 'bold' }
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  )

  // return <span style={style}>{children}</span>
  //   let css =
  //   switch (leaf) {
  //     case leaf?.bold:
  //       break
  //   }

  //   return (
  //     <span
  //       {...attributes}
  //       className={css`
  //         font-weight: ${leaf.bold && 'bold'};
  //         font-style: ${leaf.italic && 'italic'};
  //         text-decoration: ${leaf.underlined && 'underline'};
  //         ${leaf.title &&
  //         css`
  //           display: inline-block;
  //           font-weight: bold;
  //           font-size: 20px;
  //           margin: 20px 0 10px 0;
  //         `}
  //         ${leaf.list &&
  //         css`
  //           padding-left: 10px;
  //           font-size: 20px;
  //           line-height: 10px;
  //         `}
  //             ${leaf.hr &&
  //         css`
  //           display: block;
  //           text-align: center;
  //           border-bottom: 2px solid #ddd;
  //         `}
  //             ${leaf.blockquote &&
  //         css`
  //           display: inline-block;
  //           border-left: 2px solid #ddd;
  //           padding-left: 10px;
  //           color: #aaa;
  //           font-style: italic;
  //         `}
  //             ${leaf.code &&
  //         css`
  //           font-family: monospace;
  //           background-color: #eee;
  //           padding: 3px;
  //         `}
  //       `}
  //     >
  //       {children}
  //     </span>
  //   )
}

// function withShortcuts(editor: CustomEditor): CustomEditor {
//   const { deleteBackward, insertText } = editor

// editor.insertText = function (text) {
//   const { selection } = editor

//   if (text === ' ' && selection && Range.isCollapsed(selection)) {
//     const { anchor } = selection
//     const block = Editor.above(editor, {
//       match: (n) => Editor.isBlock(editor, n),
//     })
//     const path = block ? block[1] : []
//     const start = Editor.start(editor, path)
//     const range = { anchor, focus: start }
//     const beforeText = Editor.string(editor, range)
//     const type = SHORTCUTS[beforeText]

//     if (type) {
//       Transforms.select(editor, range)
//       Transforms.delete(editor)
//       const newProperties: Partial<SlateElement> = {
//         type,
//       }
//       Transforms.setNodes(editor, newProperties, {
//         match: (n) => Editor.isBlock(editor, n),
//       })

//       if (type === 'list-item') {
//         const list: BulletedListElement = {
//           type: 'bulleted-list',
//           children: [],
//         }
//         Transforms.wrapNodes(editor, list, {
//           match: (n) =>
//             !Editor.isEditor(n) &&
//             SlateElement.isElement(n) &&
//             n.type === 'list-item',
//         })
//       }

//       return
//     }
//   }

//   insertText(text)
// }

// editor.deleteBackward = function (...args) {
//   const { selection } = editor

//   if (selection && Range.isCollapsed(selection)) {
//     const match = Editor.above(editor, {
//       match: (n) => Editor.isBlock(editor, n),
//     })

//     if (match) {
//       const [block, path] = match
//       const start = Editor.start(editor, path)

//       if (
//         !Editor.isEditor(block) &&
//         SlateElement.isElement(block) &&
//         block.type !== 'paragraph' &&
//         Point.equals(selection.anchor, start)
//       ) {
//         const newProperties: Partial<SlateElement> = {
//           type: 'paragraph',
//         }
//         Transforms.setNodes(editor, newProperties)

//         if (block.type === 'list-item') {
//           Transforms.unwrapNodes(editor, {
//             match: (n) =>
//               !Editor.isEditor(n) &&
//               SlateElement.isElement(n) &&
//               n.type === 'bulleted-list',
//             split: true,
//           })
//         }

//         return
//       }
//     }

//     deleteBackward(...args)
//   }
// }

//   return editor
// }

const MarkdownPreviewExample = () => {
  const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '$AAA\nsome words with [[BBB]]...' }],
    },
    {
      type: 'paragraph',
      children: [{ text: '## Try it out!' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Try it out for yourself!' }],
    },
  ]

  const [value, setValue] = useState<Descendant[]>(initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  // const editor = useMemo(() => withReact(createEditor()), [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const decorate = useCallback(([node, path]: NodeEntry): Range[] => {
    const ranges: Range[] = []

    if (!Text.isText(node)) {
      return ranges
    }

    const editor = new CardEditor(
      undefined,
      undefined,
      'http://test2.com',
      'test-oauther'
    )
    editor.setText(node.text)
    editor.flush()
    const sections = editor.getSections()

    console.log(sections)

    function pushStream(stream: ExtTokenStream, start: number): number {
      let length = 0
      if (typeof stream === 'string') {
        length = stream.length
      } else if (Array.isArray(stream)) {
        for (const e of stream) {
          const l = pushStream(e, start)
          start += l
          length += l
        }
      } else {
        // length = getLength(stream)
        // length = pushStream(stream, start)
        // stream.content
        const content = streamToStr(stream.content)
        length = content.length
        ranges.push({
          [stream.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: start + length },
        })
      }

      return length
    }

    let start = 0

    for (const sect of sections) {
      if (sect.stream) {
        const length = pushStream(sect.stream, start)
        start += length
      }
    }

    return ranges
  }, [])

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder="Write some markdown..."
      />
    </Slate>
  )
}

export const SlateEditorPage = (): JSX.Element => (
  <div>
    <MarkdownPreviewExample />
  </div>
)

export default SlateEditorPage
