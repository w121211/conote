import { Editor, Transforms, Node, Path, NodeEntry } from 'slate'
import { BulletParser } from '../bullet/bullet-parser'
import { InlineItem } from '../inline/inline-types'
import { CustomElement, CustomInlineElement, CustomText, LcElement } from './slate-custom-types'

const toSlateInline = (item: InlineItem): CustomInlineElement | CustomText => {
  if (item.type === 'text') {
    return { text: item.str, shift: false }
  }
  const inline: CustomInlineElement = {
    ...item,
    children: [{ text: item.str }],
  }
  return inline
}

export const parseLcAndReplace = (props: { editor: Editor; lcEntry: NodeEntry<LcElement> }): void => {
  const {
    editor,
    lcEntry: [lcNode, lcPath],
  } = props
  const { inlines } = BulletParser.parseBulletHead({ str: Node.string(lcNode) })

  if (inlines.filter(e => e.type !== 'text').length === 0) {
    return // all inlines are text, no need to replace
  }

  const headInlines = inlines.map(e => toSlateInline(e))
  Transforms.removeNodes(editor, {
    at: lcPath,
    match: (n, p) => Path.isChild(p, lcPath),
  }) // 移除 lc 原本的 children 並插入新的 inlines
  // Transforms.insertFragment(editor, inlines, { at: [...path, 0] })
  Transforms.insertNodes(editor, headInlines, { at: [...lcPath, 0] })
}

export const isInlineElement = (element: CustomElement): element is CustomInlineElement => {
  const inlineTypes = ['mirror', 'poll', 'filtertag', 'symbol', 'rate']
  return inlineTypes.includes(element.type)
}

export const withInline = (editor: Editor): Editor => {
  const { isInline } = editor

  editor.isInline = element => {
    return isInlineElement(element) ? true : isInline(element)
  }

  return editor
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
