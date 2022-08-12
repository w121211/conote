import {
  isTreeNodeChangeType,
  treeDifferencer,
  TreeNodeBody,
  treeUtil,
} from '@conote/docdiff'
import type {
  NoteDocContentBodyInput,
  NoteDocContentHeadInput,
} from 'graphql-let/__generated__/__types__'
import { isEqual } from 'lodash'
import type {
  BlockFragment,
  NoteDocContentHeadFragment,
} from '../apollo/query.graphql'
import type {
  Block,
  InlineDiscuss,
  InlineSymbol,
} from '../frontend/components/editor-textarea/src/interfaces'
import { parseBlockString } from '../frontend/components/editor-textarea/src/parse-render'
import { omitTypenameDeep } from '../frontend/components/editor-textarea/src/utils'
import type { NoteDocContentBody, NoteDocContentHead } from '../lib/interfaces'

//
// Differencers
//
//
//
//
//
//

function isBlockEqual(
  a: Omit<Block, 'childrenUids'>,
  b: Omit<Block, 'childrenUids'>,
) {
  return a.str === b.str && a.docSymbol === b.docSymbol
}

/**
 * Input require to be a valide tree.
 * An empty array of blocks cannot build a tree and will throw an error, use 'null' instead
 */
export function differenceBlocks(
  final: NoteDocContentBody['blocks'],
  start: NoteDocContentBody['blocks'] | null,
) {
  const f_blocks = treeUtil.toTreeNodeBodyList(final),
    s_blocks = start && treeUtil.toTreeNodeBodyList(start),
    changes = treeDifferencer.difference(f_blocks, s_blocks, isBlockEqual)
  return changes
}

/**
 * Get changes of content-head
 *
 * TODO:
 */
export function differenceContentHead(
  final: NoteDocContentHead,
  start: NoteDocContentHeadFragment,
) {
  const start_ = omitTypenameDeep(start)

  return !isEqual(final, start_)
}

/**
 *
 */
export function differenceContentBody(
  final: NoteDocContentBody,
  start: NoteDocContentBody,
) {
  return {
    blockChanges: differenceBlocks(final.blocks, start.blocks),
  }
}

export function validateContentBlocks(blocks: NoteDocContentBody['blocks']) {
  // Validate the blocks
  parseGQLBlocks(blocks)

  // Validate the list, `toTreeNodeBodyList` validate the list before return
  const nodes = treeUtil.toTreeNodeBodyList(blocks),
    isContentEmpty = nodes.length <= 1
  return { nodes, isContentEmpty }
}

//
// Pasers
//
//
//
//
//
//

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
export function parseGQLContentBodyInput(
  symbol: string,
  input: NoteDocContentBodyInput,
): NoteDocContentBody {
  const { blocks, blockDiff, ...r } = input,
    { docBlock, blocks: blocks_ } = parseGQLBlocks(blocks),
    // discussIds_: NoteDocContentBody['discussIds'] = discussIds.map(
    //   ({ __typename, commitId, ...r }) => ({
    //     ...r,
    //     commitId: commitId ?? undefined,
    //   }),
    // ),
    // symbols_: NoteDocContentBody['symbols'] = symbols.map(
    //   ({ __typename, symId, ...r }) => ({
    //     ...r,
    //     symId: symId ?? null,
    //   }),
    // ),
    blockDiff_: NoteDocContentBody['blockDiff'] = blockDiff.map(
      ({ type, ...r }) => {
        if (isTreeNodeChangeType(type)) {
          return { type, ...r }
        }
        throw new Error("The 'type' in 'blockDiff' is not TreeNodeChangeType")
      },
    )

  if (docBlock.docSymbol === undefined)
    throw new Error('docBlock.docSymbol === undefined')
  if (docBlock.docSymbol !== docBlock.str)
    throw new Error('docBlock.docSymbol !== docBlock.str')
  if (symbol !== docBlock.docSymbol)
    throw new Error('symbol !== docBlock.docSymbol')

  return {
    ...r,
    blocks: blocks_,
    blockDiff: blockDiff_,
    // discussIds: discussIds_,
    // symbols: symbols_,
    discussIds: [],
    symbols: [],
  }
}

/**
 * TODO:
 * - [] Parse symbols
 */
export function parseBlockValues(blocks: Omit<Block, 'childrenUids'>[]) {
  const blocksParsed = blocks.map(e => {
    return { ...e, blockParsed: parseBlockString(e.str) }
  })

  const discussIds: NoteDocContentBody['discussIds'] = [],
    symbols: NoteDocContentBody['symbols'] = [],
    inlineDiscusses: InlineDiscuss[] = [],
    inlineSymbols: InlineSymbol[] = []

  for (const { uid, blockParsed } of blocksParsed) {
    const { inlineItems } = blockParsed

    for (const e of inlineItems) {
      switch (e.type) {
        case 'inline-discuss': {
          if (e.id) {
            discussIds.push({ blockUid: uid, discussId: e.id })
          }
          inlineDiscusses.push(e)
          break
        }
        case 'inline-symbol':
          inlineSymbols.push(e)
          break
      }
    }
  }

  return { blocksParsed, discussIds, symbols, inlineDiscusses, inlineSymbols }
}
