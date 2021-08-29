import { Editor, Transforms, Node, Path, NodeEntry } from 'slate'
import { parseBulletHead } from '../../lib/bullet/text'
import { LcElement, CustomElement, CustomInlineElement } from './slate-custom-types'

function isInlineElement(element: CustomElement): element is CustomInlineElement {
  const inlineTypes = [
    'label-inline',
    'mirror-inline',
    'cur-hashtags-placer-inline',
    'hashtag-inline',
    'hashtag-group-inline',
  ]
  return inlineTypes.includes(element.type)
}

export function parseLcAndReplaceChildren(editor: Editor, lcEntry: NodeEntry<LcElement>): void {
  const [node, path] = lcEntry

  const inlines = parseBulletHead({
    str: Node.string(node),
    curHashtags: node.curHashtags,
  })

  // 移除 lc 原本的 children 並插入新的 inlines
  Transforms.removeNodes(editor, {
    at: path,
    match: (n, p) => Path.isChild(p, path),
  })
  // Transforms.insertFragment(editor, inlines, { at: [...path, 0] })
  Transforms.insertNodes(editor, inlines, { at: [...path, 0] })
}

export function withInline(editor: Editor): Editor {
  const { isInline } = editor

  editor.isInline = element => {
    return isInlineElement(element) ? true : isInline(element)
  }

  return editor
}
