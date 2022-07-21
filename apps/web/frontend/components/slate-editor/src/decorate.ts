/**
 * Mainly copy from: https://github.com/ianstormtaylor/slate/blob/main/site/examples/code-highlighting.tsx
 */
import { Editor, NodeEntry, Text } from 'slate'
import { parse } from '../../block-editor/src/parse-render'
import type { ElementLc, RangeCustom } from './interfaces'
import type { CustomEditor } from './slate-custom-types'
import { isLc } from './utils'

export const decorate = (
  [node, path]: NodeEntry,
  editor: CustomEditor,
  draftId: string,
): RangeCustom[] => {
  const ranges: RangeCustom[] = []

  if (!Text.isText(node)) return ranges

  const lcEntry = Editor.above<ElementLc>(editor, {
    match: n => isLc(n),
    at: path,
  })

  if (lcEntry === undefined) throw new Error('lcEntry === undefined')

  const { inlineItems } = parse(node.text),
    [lc] = lcEntry,
    blockUid = lc.uid

  let start = 0
  for (const e of inlineItems) {
    const end = start + e.str.length
    ranges.push({
      anchor: { path, offset: start },
      focus: { path, offset: end },
      inlineItem: e,
      blockUid,
      draftId,
    })
    start = end
  }

  return ranges
}
