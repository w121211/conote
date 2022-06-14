import { TreeNodeBody, treeUtil } from '@conote/docdiff'
import { BlockFragment } from '../apollo/query.graphql'
import { Block } from '../components/block-editor/src/interfaces'

/**
 * Convert gql-blocks to blocks by
 * - validate root-block
 * - add children uids
 * - validate children uids
 * - validate is any orphan block
 *
 * @returns blocks: includes doc-block
 * @returns docBlock
 */
export function convertGQLBlocks(
  gqlBlocks: Omit<BlockFragment, '__typename'>[],
): {
  blocks: Block[]
  docBlock: Block
} {
  const nodes: TreeNodeBody<Omit<BlockFragment, '__typename'>>[] =
    gqlBlocks.map(e => ({
      uid: e.uid,
      parentUid: e.parentUid ?? null,
      order: e.order,
      data: e,
    }))

  const root = treeUtil.buildFromList(nodes),
    nodes_ = treeUtil.toList(root),
    blocks: Block[] = nodes_.map(e => {
      const {
        data: { str, open, order, docSymbol },
        uid,
        parentUid,
        childrenUids,
      } = e
      return {
        uid,
        str,
        open: open ?? undefined,
        order,
        docSymbol: docSymbol ?? undefined,
        parentUid,
        childrenUids,

        // TODO:
        // editTime?: number // TBC, consider to drop
      }
    }),
    docBlock = blocks.find(e => e.uid === root.uid)

  if (docBlock === undefined)
    throw new Error('[convertGQLBlocks] docBlock === undefined')

  treeUtil.validateList(nodes_)
  return { blocks, docBlock }
}
