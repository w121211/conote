import { treeUtil } from '@conote/docdiff'
import { ElementIndenter } from '../frontend/components/editor-slate/src/interfaces'
import { Block } from '../frontend/components/editor-textarea/src/interfaces'

/**
 * Input blocks require the root block.
 *
 * @returns [rootIndenter, ...restIndenters] Indenters are in depth-first order
 */
export function blocksToIndenters(
  blocks: Omit<Block, 'childrenUids'>[],
): ElementIndenter[] {
  const nodes = treeUtil.toTreeNodeBodyList(blocks)
  const indenters = nodes.map((e): ElementIndenter => {
    const {
      uid,
      data,
      extraInfo: { depth },
    } = e
    const el: ElementIndenter = {
      type: 'indenter',
      children: [{ text: data.str }],
      indent: depth - 1,
      uid,
      blockCopy: data,
    }
    return el
  })

  return indenters
}

/**
 * Convert blocks to plain text for export.
 */
export function blocksToText(blocks: Omit<Block, 'childrenUids'>[]): string {
  const [, ...rest] = blocksToIndenters(blocks)
  const lines: string[] = rest.map(e => {
    const line = e.blockCopy?.str ?? ''
    return '    '.repeat(e.indent) + '- ' + line
  })
  const text = lines.join('\n')
  return text
}
