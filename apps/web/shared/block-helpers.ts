import {
  TreeNodeBody,
  TreeNodeChange,
  treeNodeDifferencer,
  treeUtil,
} from '@conote/docdiff'
import type { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import {
  BlockFragment,
  NoteDocContentBodyFragment,
} from '../apollo/query.graphql'
import {
  Block,
  Doc,
  InlineDiscuss,
} from '../components/block-editor/src/interfaces'
import { parse } from '../components/block-editor/src/parse-render'
import { noteDraftService } from '../components/block-editor/src/services/note-draft.service'
import { docRepo } from '../components/block-editor/src/stores/doc.repository'
import type {
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

function differenceBlocks(
  final: NoteDocContentBody['blocks'],
  start: NoteDocContentBody['blocks'],
) {
  const f_blocks = treeUtil.toTreeNodeBodyList(final),
    s_blocks = treeUtil.toTreeNodeBodyList(start),
    changes = treeNodeDifferencer.difference(f_blocks, s_blocks, isBlockEqual)
  return changes
}

function isBlockEqual(
  a: Omit<Block, 'childrenUids'>,
  b: Omit<Block, 'childrenUids'>,
) {
  return a.str === b.str && a.docSymbol === b.docSymbol
}

export function isDocChanged(docUid: string): {
  changed: boolean
  changes: TreeNodeChange[]
  doc: Doc
  input: NoteDraftInput
  noteDraftCopy: NonNullable<Doc['noteDraftCopy']>
} {
  const doc = docRepo.getDoc(docUid),
    { noteDraftCopy } = doc

  if (noteDraftCopy === undefined) {
    console.debug(doc)
    throw new Error('[isDocSaved] doc.noteDraftCopy === undefined')
  }

  const input = noteDraftService.toNoteDraftInput(doc),
    { blocks: startBlocks } = parseGQLBlocks(noteDraftCopy.contentBody.blocks),
    { blocks: finalBlocks } = parseGQLBlocks(input.contentBody.blocks),
    changes = differenceBlocks(finalBlocks, startBlocks),
    changed = changes.length > 0

  return { changed, changes, doc, noteDraftCopy, input }
}
