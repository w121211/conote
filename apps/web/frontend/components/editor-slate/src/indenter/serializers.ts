import { Node } from 'slate'
import { blocksToIndenters } from '../../../../../share/converters'
import type { Block } from '../../../editor-textarea/src/interfaces'
import type { ElementIndenter } from '../interfaces'
import { validateIndenters } from './normalizers'
import { getParentIndenter, getPrevSiblings } from './queries'

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

export { blocksToIndenters }
