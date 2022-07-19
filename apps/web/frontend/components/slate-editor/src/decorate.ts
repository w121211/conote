/**
 * Mainly copy from slate.js example code
 * @see https://github.com/ianstormtaylor/slate/blob/main/site/examples/code-highlighting.tsx
 */
import { NodeEntry, Text } from 'slate'
import { TokenHelper } from '../../../../share/token'
import { parse } from '../../block-editor/src/parse-render'
import type { CustomRange } from './slate-custom-types'

export const decorate = ([node, path]: NodeEntry): CustomRange[] => {
  const ranges: CustomRange[] = []
  if (!Text.isText(node)) {
    return ranges
  }

  // token
  const { tokens } = parse(node.text),
    tokens_ = TokenHelper.flatten(tokens)

  let start = 0
  for (const e of tokens_) {
    const end = start + e.string.length
    if (e.type) {
      ranges.push({
        tokenType: e.type,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      })
    }
    start = end
  }

  return ranges
}
