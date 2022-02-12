/**
 * Mainly copy from slate.js example code
 * @see https://github.com/ianstormtaylor/slate/blob/main/site/examples/code-highlighting.tsx
 */
import { NodeEntry, Text } from 'slate'
import { TokenHelper } from '../../common/token-helper'
import { tokenizeBulletString } from '../bullet/bullet-parser'
import { CustomRange } from './slate-custom-types'

export const decorate = ([node, path]: NodeEntry): CustomRange[] => {
  const ranges: CustomRange[] = []
  if (!Text.isText(node)) {
    return ranges
  }

  const tokens = tokenizeBulletString(node.text)
  const flatTokens = TokenHelper.flatten(tokens)

  let start = 0
  for (const e of flatTokens) {
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
