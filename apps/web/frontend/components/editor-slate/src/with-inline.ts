import { Editor, Transforms, Node, Path, NodeEntry } from 'slate'
import type { InlineItem } from '../../editor-textarea/src/interfaces'
import { parse } from '../../editor-textarea/src/parse-render'
import type { InlineElementCustom, TextCustom } from './interfaces'
// import { BulletParser } from '../bullet/bullet-parser'
import type { CustomElement } from './slate-custom-types'

function toInlineElement(item: InlineItem): InlineElementCustom | TextCustom {
  if (item.type === 'text') {
    return { text: item.str }
  }
  const inline: InlineElementCustom = {
    ...item,
    children: [{ text: item.str }],
  }
  return inline
}

export function isInlineElement(
  element: CustomElement,
): element is InlineElementCustom {
  const inlineTypes = [
    'inline-discuss',
    'inline-filtertag',
    // 'inline-mirror',
    'inline-poll',
    'inline-rate',
    'inline-symbol',
    'inline-comment',
  ]
  return inlineTypes.includes(element.type)
}

export function withInline(editor: Editor): Editor {
  const { isInline } = editor

  editor.isInline = element => {
    return isInlineElement(element) ? true : isInline(element)
  }

  return editor
}

export function wrapToInlines({
  editor,
  lcEntry: [lcNode, lcPath],
}: {
  editor: Editor
  lcEntry: NodeEntry<ElementLc>
}): void {
  if (lcNode.children.find(e => e.type !== undefined)) {
    // at least one inline element existed in lc, no need to wrap again
    return
  }

  const str = Node.string(lcNode)
  // const { inlines } = BulletParser.parse(str)
  const { inlineItems } = parse(str)

  if (inlineItems.filter(e => e.type !== 'text').length === 0) {
    // all inlines are text, no need to replace
    return
  }

  const inlineNodes = inlineItems.map(e => toInlineElement(e))
  Editor.withoutNormalizing(editor, () => {
    Transforms.removeNodes(editor, {
      at: lcPath,
      match: (n, p) => Path.isChild(p, lcPath),
    }) // remove lc children & insert inlines
    // Transforms.insertFragment(editor, inlines, { at: [...path, 0] })
    Transforms.insertNodes(editor, inlineNodes, { at: [...lcPath, 0] })
  })
}

// export function parseChildren(lis: LiElement[]): LiElement[] {
//   const editor = withParse(createEditor())
//   editor.children = lis
//   for (const [n, p] of Editor.nodes(editor, { at: [] })) {
//     if (isLc(n)) {
//       parseLcAndReplace({ editor, lcEntry: [n, p] })
//     }
//   }
//   if (isLiArray(editor.children)) {
//     return editor.children
//   }
//   throw ''
// }
