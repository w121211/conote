import { Editor, Transforms, Node, Path, NodeEntry } from 'slate'
import { BulletParser } from '../bullet/bullet-parser'
import { InlineItem } from '../inline/inline-item-types'
import { CustomElement, CustomInlineElement, CustomText, LcElement } from './slate-custom-types'

const toInlineElement = (item: InlineItem): CustomInlineElement | CustomText => {
  if (item.type === 'text') {
    return { text: item.str }
  }
  const inline: CustomInlineElement = {
    ...item,
    children: [{ text: item.str }],
  }
  return inline
}

export const isInlineElement = (element: CustomElement): element is CustomInlineElement => {
  const inlineTypes = [
    'inline-discuss',
    'inline-filtertag',
    'inline-mirror',
    'inline-poll',
    'inline-rate',
    'inline-symbol',
  ]
  return inlineTypes.includes(element.type)
}

export const withInline = (editor: Editor): Editor => {
  const { isInline } = editor

  editor.isInline = element => {
    return isInlineElement(element) ? true : isInline(element)
  }

  return editor
}

export const wrapToInlines = ({
  editor,
  lcEntry: [lcNode, lcPath],
}: {
  editor: Editor
  lcEntry: NodeEntry<LcElement>
}): void => {
  if (lcNode.children.find(e => e.type !== undefined)) {
    // at least one inline element existed in lc, no need to wrap again
    return
  }

  const str = Node.string(lcNode)
  const { inlines } = BulletParser.parseBulletHead({ str })
  if (inlines.filter(e => e.type !== 'text').length === 0) {
    // all inlines are text, no need to replace
    return
  }

  const inlineNodes = inlines.map(e => toInlineElement(e))
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
