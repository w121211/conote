import { Editor, Transforms, Node, Path, NodeEntry } from 'slate'
import { parseBulletHead } from '../../lib/bullet/text'
import { InlineItem } from '../../lib/bullet/types'
import { LcElement, CustomElement, CustomInlineElement, CustomText } from './slate-custom-types'

function isInlineElement(element: CustomElement): element is CustomInlineElement {
  const inlineTypes = ['symbol', 'mirror', 'hashtag', 'new-hashtag', 'poll', 'new-poll']
  return inlineTypes.includes(element.type)
}

export function setInlinesToText(editor: Editor, lcEntry: NodeEntry<LcElement>): void {
  const [node, path] = lcEntry

  // 移除 lc 原本的 children 並插入 text
  Transforms.removeNodes(editor, {
    at: path,
    match: (n, p) => Path.isChild(p, path),
  })
  Transforms.insertNodes(editor, { text: Node.string(node) }, { at: [...path, 0] })
}

function toSlateInline(item: InlineItem): CustomInlineElement | CustomText {
  if (item.type === 'text') {
    return { text: item.str }
  }
  return {
    ...item,
    children: [{ text: item.str }],
  }
}

export function parseLcAndReplace(editor: Editor, lcEntry: NodeEntry<LcElement>): void {
  const [node, path] = lcEntry
  const { headInlines } = parseBulletHead({
    str: Node.string(node),
  })
  const inlines = headInlines.map(e => toSlateInline(e))
  // 移除 lc 原本的 children 並插入新的 inlines
  Transforms.removeNodes(editor, {
    at: path,
    match: (n, p) => Path.isChild(p, path),
  })
  // Transforms.insertFragment(editor, inlines, { at: [...path, 0] })
  Transforms.insertNodes(editor, inlines, { at: [...path, 0] })
}

export function withParse(editor: Editor): Editor {
  const { isInline } = editor

  editor.isInline = element => {
    return isInlineElement(element) ? true : isInline(element)
  }

  return editor
}
