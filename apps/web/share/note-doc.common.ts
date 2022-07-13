import { TreeNodeChange, treeNodeDifferencer, treeUtil } from '@conote/docdiff'
import type { Block } from '../frontend/components/block-editor/src/interfaces'
import type { NoteDocContentBody, NoteDocContentHead } from '../lib/interfaces'

function isBlockEqual(
  a: Omit<Block, 'childrenUids'>,
  b: Omit<Block, 'childrenUids'>,
) {
  return a.str === b.str && a.docSymbol === b.docSymbol
}

/**
 * Get changes of content-head
 *
 * TODO
 */
export function differenceContentHead(
  final: NoteDocContentHead,
  start: NoteDocContentHead,
) {
  throw new Error('Not implement')
  // return isEqual(final, start)
}

export function differenceContentBody(
  final: NoteDocContentBody,
  start: NoteDocContentBody,
): TreeNodeChange[] {
  const f_blocks = treeUtil.toTreeNodeBodyList(final.blocks),
    s_blocks = treeUtil.toTreeNodeBodyList(start.blocks),
    changes = treeNodeDifferencer.difference(f_blocks, s_blocks, isBlockEqual)
  return changes
}
