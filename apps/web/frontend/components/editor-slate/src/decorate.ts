/**
 * Mainly copy from: https://github.com/ianstormtaylor/slate/blob/main/site/examples/code-highlighting.tsx
 */
import { Editor, Element, NodeEntry, Text } from 'slate'
import { parseBlockString } from '../../editor-textarea/src/parse-render'
import type { ElementIndenter, RangeCustom } from './interfaces'

export const decorate = (
  [node, path]: NodeEntry,
  editor: Editor,
): RangeCustom[] => {
  const ranges: RangeCustom[] = []

  if (!Text.isText(node)) return ranges

  const entry = Editor.above<ElementIndenter>(editor, {
    match: n => Element.isElementType<ElementIndenter>(n, 'indenter'),
    at: path,
  })
  if (entry === undefined) throw new Error('Indenter not found.')

  const { inlineItems } = parseBlockString(node.text),
    [n] = entry,
    { uid: blockUid } = n

  let start = 0
  for (const e of inlineItems) {
    const end = start + e.str.length
    ranges.push({
      anchor: { path, offset: start },
      focus: { path, offset: end },
      inlineItem: e,
      blockUid,
    })
    // console.log(e.type, e.token)
    start = end
  }

  return ranges
}
