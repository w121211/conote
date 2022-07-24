import { treeUtil } from '@conote/docdiff'
import { Node } from 'slate'
import type { Block } from '../../../editor-textarea/src/interfaces'
import type { ElementIndenter } from '../interfaces'
import { validateIndenters } from './normalizers'
import { getParentIndenter, getPrevSiblings } from './queries'

/**
 * Input blocks require the root block.
 *
 * @returns [rootIndenter, ...restIndenters] Indenters are in depth-first order
 */
export function blocksToIndenters(blocks: Block[]): ElementIndenter[] {
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
 * Convert the slate input value (ie, li list) to blocks
 *
 */
export function indentersToBlocks(
  indenters: ElementIndenter[],
  rootUid: string,
): Omit<Block, 'childrenUids'>[] {
  validateIndenters(indenters)

  const traversed: (ElementIndenter & { parentUid: string })[] = [],
    blocks: Omit<Block, 'childrenUids'>[] = []

  for (const cur of indenters) {
    const { uid } = cur,
      parent = getParentIndenter(cur, traversed),
      parentUid = parent?.uid ?? rootUid,
      cur_ = { ...cur, parentUid },
      prevSiblings = getPrevSiblings(cur_, traversed)

    traversed.push(cur_)
    blocks.push({
      uid,
      parentUid,
      order: prevSiblings.length,
      str: Node.string(cur),
    })
  }

  return blocks
}
