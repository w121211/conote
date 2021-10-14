import { Editor, Transforms, Node, Path, NodeEntry, createEditor } from 'slate'
import { parseBulletHead } from '../../lib/bullet/text'
import { InlineItem } from '../../lib/bullet/types'
import { LcElement, CustomElement, CustomInlineElement, CustomText, LiElement } from './slate-custom-types'
import { isLc, isLiArray } from './with-list'

function isInlineElement(element: CustomElement): element is CustomInlineElement {
  const inlineTypes = ['mirror', 'poll', 'filtertag']
  return inlineTypes.includes(element.type)
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

export function withParse(editor: Editor): Editor {
  const { isInline } = editor

  editor.isInline = element => {
    return isInlineElement(element) ? true : isInline(element)
  }

  return editor
}

export function parseLcAndReplace(props: { editor: Editor; lcEntry: NodeEntry<LcElement> }): void {
  const {
    editor,
    lcEntry: [lcNode, lcPath],
  } = props
  const { headInlines } = parseBulletHead({ str: Node.string(lcNode) })
  const inlines = headInlines.map(e => toSlateInline(e))

  // 移除 lc 原本的 children 並插入新的 inlines
  Transforms.removeNodes(editor, {
    at: lcPath,
    match: (n, p) => Path.isChild(p, lcPath),
  })
  // Transforms.insertFragment(editor, inlines, { at: [...path, 0] })
  Transforms.insertNodes(editor, inlines, { at: [...lcPath, 0] })
}

export function parseChildren(lis: LiElement[]): LiElement[] {
  const editor = withParse(createEditor())
  editor.children = lis
  for (const [n, p] of Editor.nodes(editor, { at: [] })) {
    if (isLc(n)) {
      parseLcAndReplace({ editor, lcEntry: [n, p] })
    }
  }
  if (isLiArray(editor.children)) {
    return editor.children
  }
  throw ''
}
