import { TreeNodeBody, treeUtil } from '@conote/docdiff'
import {
  BlockFragment,
  NoteDocContentBodyFragment,
} from '../apollo/query.graphql'
import { Block, InlineDiscuss } from '../components/block-editor/src/interfaces'
import { parse } from '../components/block-editor/src/parse-render'
import {
  BlockUid_DiscussId,
  NoteDocContentBody,
  Symbol_SymId,
} from '../lib/interfaces'

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
export function parseGQLBlocks(
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

/**
 * Parse content body input to content body,
 *  include validation and updating the meta properties
 *
 */
export function parseGQLContentBody(
  symbol: string,
  gqlContentBody: Omit<NoteDocContentBodyFragment, '__typename' | 'blocks'> & {
    blocks: Omit<BlockFragment, '__typename'>[]
  },
): NoteDocContentBody {
  const { blocks, discussIds, symbols, ...r } = gqlContentBody,
    { docBlock, blocks: blocks_ } = parseGQLBlocks(gqlContentBody.blocks),
    discussIds_: BlockUid_DiscussId[] = discussIds.map(
      ({ __typename, commitId, ...r }) => ({
        ...r,
        commitId: commitId ?? undefined,
      }),
    ),
    symbols_: Symbol_SymId[] = symbols.map(({ __typename, symId, ...r }) => ({
      ...r,
      symId: symId ?? null,
    }))

  if (docBlock.docSymbol === undefined)
    throw new Error('docBlock.docSymbol === undefined')
  if (docBlock.docSymbol !== docBlock.str)
    throw new Error('docBlock.docSymbol !== docBlock.str')
  if (symbol !== docBlock.docSymbol)
    throw new Error('symbol !== docBlock.docSymbol')

  blocks.forEach(e => {
    const { uid, str } = e,
      inlineItems = parse(str)

    inlineItems
      .filter((e): e is InlineDiscuss => e.type === 'inline-discuss')
      .forEach(e => {
        if (e.id) {
          discussIds_.push({ blockUid: uid, discussId: e.id })
        }
      })
  })

  return {
    ...r,
    blocks: blocks_,
    discussIds: discussIds_,
    symbols: symbols_,
  }
}
