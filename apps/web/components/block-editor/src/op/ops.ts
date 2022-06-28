/**
 * Ops is by designed called by event to make one or many mutations of the block-store,
 * each op function produce `BlockRecuer[]` for later execute in a batch.
 *
 */

import {
  addEntities,
  deleteEntities,
  updateEntities,
  updateEntitiesIds,
} from '@ngneat/elf-entities'
import assert from 'assert'
import type { NoteDocContentHeadInput } from 'graphql-let/__generated__/__types__'
import { nanoid } from 'nanoid'
import type {
  NoteDraftFragment,
  NoteFragment,
} from '../../../../apollo/query.graphql'
import { parseGQLBlocks } from '../../../../shared/block-helpers'
import type {
  Block,
  BlockPosition,
  BlockPositionRelation,
  Doc,
} from '../interfaces'
import { noteDraftService } from '../services/note-draft.service'
import {
  BlockReducer,
  BlockReducerFn,
  getBlock,
  getBlockChildren,
} from '../stores/block.repository'
import { DocReducer, docRepo } from '../stores/doc.repository'
import { genBlockUid } from '../utils'
import {
  getRefBlockOfPosition,
  isChildRelation,
  isDescendant,
  validatePosition,
  validateUid,
} from './helpers'
import { insert, moveBetween, moveWithin, remove, reorder } from './order'
import { allDescendants } from './queries'

//
// Helpers
//
//
//
//
//
//

function reorderOps(reorderBlocks: Block[]): BlockReducer[] {
  return reorderBlocks.map(e => updateEntities(e.uid, { order: e.order }))
}

//
// Block Atomic Ops
//
//
//
//
//
//

/**
 * Move a block, fails if it has children
 * - is block x move in the same parent?
 *   - (yes) move between & change order
 *   - (no)
 *     - get new parent from position
 *     - remove x from old parent-children
 *     - reoder old parent-children
 *
 */
export function blockMoveOp(
  block: Block,
  position: BlockPosition,
  opts: { validate: boolean } = { validate: true },
): BlockReducer[] {
  if (block.parentUid === null) {
    console.error(block)
    throw new Error(
      '[blockMoveOp] block to be moved is a page, cannot move pages.',
    )
  }
  validatePosition(position)

  const { relation } = position,
    refBlock = getRefBlockOfPosition(position),
    refChildRelation = isChildRelation(relation),
    refBlockParent =
      refBlock && refBlock.parentUid ? getBlock(refBlock.parentUid) : null,
    newParentBlock = refChildRelation ? refBlock : refBlockParent

  // console.debug(
  //   refPage,
  //   refUid,
  //   refBlock,
  //   refChildRelation,
  //   refBlockParent,
  //   newParentBlock,
  // )

  assert(refBlock, '[blockMoveOp] refBlock does not exist')
  assert(newParentBlock, '[blockMoveOp] newParentBlock === null')
  assert(
    !isDescendant(refBlock, block),
    '[blockMoveOp] refBlock is descendant of block',
  )

  const oldParent = getBlock(block.parentUid),
    sameParent = newParentBlock.uid === oldParent.uid,
    editTime = Date.now()

  // console.debug(oldParent, sameParent)

  let ops: BlockReducer[] = [
    updateEntities(block.uid, { editTime, parentUid: newParentBlock.uid }),
  ]

  let reorder_: Block[]
  if (sameParent) {
    const children = getBlockChildren(oldParent.uid),
      children_ = moveWithin(children, block, relation, refBlock)
    reorder_ = reorder(children, children_)

    // console.debug(children_, reorder_)

    ops.push(
      updateEntities(oldParent.uid, {
        childrenUids: children_.map(e => e.uid),
        editTime,
      }),
    )
  } else {
    const originChildren = getBlockChildren(oldParent.uid),
      destChildren = getBlockChildren(newParentBlock.uid),
      [originChildren_, destChildren_] = moveBetween(
        originChildren,
        destChildren,
        block,
        relation,
        refBlock,
      ),
      reorderOrigin = reorder(originChildren, originChildren_),
      reorderDest = reorder(destChildren, destChildren_)
    reorder_ = reorderOrigin.concat(reorderDest)

    ops = ops.concat([
      updateEntities(oldParent.uid, {
        childrenUids: originChildren_.map(e => e.uid),
        editTime,
      }),
      updateEntities(newParentBlock.uid, {
        childrenUids: destChildren_.map(e => e.uid),
        editTime,
      }),
    ])
  }
  return ops.concat(reorderOps(reorder_))
}

/**
 * - add new block
 * - update parent.childrenUids
 * - update parent->children order
 *
 */
export function blockNewOp(
  newUid: string,
  position: BlockPosition,
): BlockReducer[] {
  validatePosition(position)
  validateUid(newUid)

  const { relation } = position,
    refBlock = getRefBlockOfPosition(position),
    refChildRelation = isChildRelation(relation),
    refBlockParent =
      refBlock && refBlock.parentUid ? getBlock(refBlock.parentUid) : null,
    newParentBlock = refChildRelation ? refBlock : refBlockParent

  if (refBlock === null) throw new Error('refBlock === null')
  if (newParentBlock === null) throw new Error('newParentBlock === null')

  const editTime = Date.now(),
    newBlock: Block = {
      uid: newUid,
      str: '',
      open: true,
      childrenUids: [],
      editTime,
      order: 0, // temporary
      parentUid: newParentBlock.uid,
    },
    children = getBlockChildren(newParentBlock.uid),
    children_ = insert(children, newBlock, relation, refBlock),
    reorder_ = reorder(children, children_)

  let ops: BlockReducer[] = [
    addEntities([newBlock]),
    updateEntities(newParentBlock.uid, {
      childrenUids: children_.map(e => e.uid),
      editTime,
    }),
  ]
  ops = ops.concat(reorderOps(reorder_))

  // console.debug(newParentBlock, children, children_)

  return ops
}

export function blockOpenOp(uid: string, open: boolean): BlockReducer[] {
  const block = getBlock(uid)
  if (block.open === open) {
    console.info(
      'block/open already at desired state, :block/open',
      block.open,
      open,
    )
    return []
  }
  return [updateEntities(block.uid, { open })]
}

/**
 * - update parent's childrenUids
 * - update siblings order
 * - remove block and all its descendants (kids)
 *
 */
export function blockRemoveOp(removeBlock: Block): BlockReducer[] {
  const kids = allDescendants(removeBlock),
    kidsUids = kids.map(e => e.uid),
    parent = removeBlock.parentUid ? getBlock(removeBlock.parentUid) : null

  let ops: BlockReducer[] = []
  if (parent) {
    const parentChildren = getBlockChildren(parent.uid),
      parentChildren_ = remove(parentChildren, removeBlock),
      reorder_ = reorder(parentChildren, parentChildren_)
    ops = ops.concat([
      updateEntities(parent.uid, {
        childrenUids: parentChildren_.map(e => e.uid),
      }),
      ...reorderOps(reorder_),
    ])
  }
  ops.push(deleteEntities([removeBlock.uid, ...kidsUids]))

  return ops
}

export function blockSaveOp(uid: string, str: string): BlockReducer[] {
  return [updateEntities(uid, { str, editTime: Date.now() })]
}

/**
 * @param parent blocks attach to, only allow non-children block to insert
 * @param blocks
 */
export function blocksInsertOp(parent: Block, blocks: Block[]): BlockReducer[] {
  const parentChildrenUids = blocks
    .filter(e => e.parentUid === parent.uid)
    .map(e => e.uid)

  if (parent.childrenUids.length > 0)
    throw new Error('Only allow non children block to insert')
  if (parentChildrenUids.length === 0)
    throw new Error('No blocks are attached to the parent')

  return [
    updateEntities(parent.uid, {
      editTime: Date.now(),
      childrenUids: parentChildrenUids,
    }),
    addEntities(blocks),
  ]
}

//
// Chain Ops
//
//
//
//
//
//

/**
 * "Creates `:block/remove` & `:block/save` ops.
  Arguments:
  - `db` db value
  - `remove-uid` `:block/uid` to delete
  - `merge-uid` `:block/uid` to merge (postfix) `value` to
  - `value`: string to be postfixed to `:block/string` of `merge-uid`"
 * 
 * @eg
 * - hello // merge
 * - world // remove, value = 'world'
 *   - ccc
 *   - ddd
 * 
 * >>>>>>
 * 
 * - helloworld
 *   - ccc
 *   - ddd
 */
export function blockMergeChainOp(
  removeBlock: Block,
  mergeBlock: Block,
  value: string,
): BlockReducerFn[] {
  // const childrenToMove = getBlockChildren(removeBlock.uid),
  //   moveOps = childrenToMove
  //     .map((e) =>
  //       blockMoveOp(e, {
  //         blockUid: mergeBlock.uid,
  //         relation: 'last',
  //       }),
  //     )
  //     .reduce((acc, cur) => acc.concat(cur), []),
  //   removeOp = blockRemoveOp(removeBlock),
  //   saveOp = blockSaveOp(mergeBlock.uid, mergeBlock.str + value)
  // return [...moveOps, ...removeOp, ...saveOp]

  const fns: BlockReducerFn[] = removeBlock.childrenUids.map(e => {
    const block = getBlock(e)
    return () =>
      blockMoveOp(block, { refBlockUid: mergeBlock.uid, relation: 'last' })
  })
  fns.push(() => blockRemoveOp(removeBlock))
  fns.push(() => blockSaveOp(mergeBlock.uid, mergeBlock.str + value))

  return fns
}

/**
 * For backspace event
 *
 * steps:
 * - move remove-block's children
 * - remove remove-block
 * - save merge-block
 *
 * @eg
 * - hello // merge,  updateValue = 'hello'
 * - world // remove, value       = 'world'
 *   - ccc
 *   - ddd
 *
 * >>>>>
 *
 * - helloworld
 *   - ccc
 *   - ddd
 *
 * TODO: remove-block and merge-block need to be siblings?
 */
export function blockMergeWithUpdatedChainOp(
  removeBlock: Block,
  mergeBlock: Block,
  value: string,
  updateValue = '',
): BlockReducerFn[] {
  // const removeOp = blockRemoveOp(removeBlock),
  //   saveOp = blockSaveOp(mergeBlock.uid, updateValue + value),
  //   childrenToMove = removeBlock.childrenUids,
  //   moveOps = childrenToMove.map((e) => {
  //     const block = getBlock(e)
  //     return blockMoveOp(block, { blockUid: mergeBlock.uid, relation: 'last' })
  //   }),
  //   deleteAndMergeOp = moveOps.concat([removeOp, saveOp])

  const fns: BlockReducerFn[] = removeBlock.childrenUids.map(e => {
    const block = getBlock(e)
    return () =>
      blockMoveOp(block, { refBlockUid: mergeBlock.uid, relation: 'last' })
  })
  fns.push(() => blockRemoveOp(removeBlock))
  fns.push(() => blockSaveOp(mergeBlock.uid, updateValue + value))

  return fns
}

/**
 * Move source block and its siblings to the target
 *
 * @eg source = [a, b, c, d], target = z
 * - move a to z
 * - move b after a, move c after b, ...
 *
 * @returns consequence-op
 *
 * TODO: what if source-uids are not siblings?
 */
export function blockMoveChainOp(
  targetUid: string,
  sourceUids: string[],
  firstRel: BlockPositionRelation,
): BlockReducerFn[] {
  // TODO: validate source-uids are siblings

  // const first = getBlock(sourceUids[0]),
  //   ops: BlockReducer[][] = [
  //     blockMoveOp(first, { blockUid: targetUid, relation: firstRel }),
  //   ]
  // for (let i = 0; i < sourceUids.length - 1; i++) {
  //   const one = sourceUids[i],
  //     two = sourceUids[i + 1],
  //     two_ = getBlock(two)
  //   ops.push(blockMoveOp(two_, { blockUid: one, relation: 'after' }))
  // }
  // return ops

  const first = getBlock(sourceUids[0]),
    fns: BlockReducerFn[] = [
      () => blockMoveOp(first, { refBlockUid: targetUid, relation: firstRel }),
    ]

  for (let i = 0; i < sourceUids.length - 1; i++) {
    const one = sourceUids[i],
      two = sourceUids[i + 1],
      two_ = getBlock(two)
    fns.push(() => blockMoveOp(two_, { refBlockUid: one, relation: 'after' }))
  }
  return fns
}

/**
 *
 */
export function blockRemoveManyChainOp(removeUids: string[]): BlockReducerFn[] {
  const chainOps: BlockReducerFn[] = removeUids.map(e => {
    const block = getBlock(e)
    return () => blockRemoveOp(block)
  })
  return chainOps
}

/**
 * * "Creates `:block/split` composite op, taking into account context.
  If old-block has children, pass them on to new-block.
  If old-block is open or closed, pass that state on to new-block."
 * 
 * @param str current local string to split
 * @param idx index for string to split at
 * @returns consequence-op
 */
export function blockSplitChainOp(
  oldBlock: Block,
  newBlockUid: string,
  str: string,
  idx: number,
  relation: BlockPositionRelation,
): BlockReducerFn[] {
  // const saveOp = () => blockSaveOp(oldBlock.uid, str.substring(0, idx)),
  //   newOp = () => blockNewOp(newBlockUid, { blockUid: oldBlock.uid, relation }),
  //   saveNewOp = () => blockSaveOp(newBlockUid, str.substring(idx)),
  //   { open } = oldBlock,
  //   children = getBlockChildren(oldBlock.uid),
  //   hasChildren = children.length > 0,
  //   moveChildrenOp = hasChildren
  //     ? blockMoveChain(
  //         newBlockUid,
  //         children.map((e) => e.uid),
  //         'first',
  //       )
  //     : [],
  //   closeNewOp = hasChildren
  //     ? blockOpenOp(newBlockUid, oldBlock.open ?? false)
  //     : []
  // splitOp = [saveOp, newOp, saveNewOp, ...moveChildrenOp, closeNewOp]
  // return splitOp

  // const [strBefore, strAfter] = [str.substring(0, idx), str.substring(idx)]
  const strBefore = str.substring(0, idx),
    strAfter = str.substring(idx),
    newBlockStr = relation === 'before' ? strBefore : strAfter,
    oldBlockStr = relation === 'before' ? strAfter : strBefore

  const chains: BlockReducerFn[] = [
    // Save old-block
    () => blockSaveOp(oldBlock.uid, oldBlockStr),

    // Create new block
    () => blockNewOp(newBlockUid, { refBlockUid: oldBlock.uid, relation }),

    // Save new-block
    () => blockSaveOp(newBlockUid, newBlockStr),

    // move children (if any)
  ]

  return chains
}

//
// Doc Ops
//
//
//
//
//
//

/**
 * Create a doc from note-draft and also add blocks
 */
export function docLoadOp(
  symbol: string,
  load: {
    doc: Doc
    docBlock: Block
    blocks: Block[]
  },
): {
  blockReducers: BlockReducer[]
  docReducers: DocReducer[]
  docUid: string
} {
  if (docRepo.findDoc(symbol))
    throw new Error('[docLoadOp] Doc is already existed')
  if (symbol !== load.doc.symbol)
    throw new Error('[docLoadOp] title !== noteDraft.symbol')
  if (symbol !== load.docBlock.docSymbol) {
    console.debug(load.docBlock, symbol)
    throw new Error('[docLoadOp] symbol !== docBlock.docSymbol')
  }
  return {
    blockReducers: [addEntities(load.blocks)],
    docReducers: [addEntities(load.doc)],
    docUid: load.doc.uid,
  }
}

/**
 * Create a new doc
 * - if note is given, use note-doc as start
 * - if note is null
 *   - if title is url, query url & create a blank web-note doc
 *   - others, create a blank doc
 */
export function docNewOp(
  branch: string,
  symbol: string,
  domain: string,
  note: NoteFragment | null,
): {
  blockReducers: BlockReducer[]
  docReducers: DocReducer[]
  newDocUid: string
} {
  if (docRepo.findDoc(symbol) !== null)
    throw new Error('[docNewOp] Doc is already existed')

  if (note) {
    const { blocks: gqlBlocks, ...rest } = note.headDoc.contentBody,
      { blocks, docBlock } = parseGQLBlocks(gqlBlocks),
      newDoc: Doc = {
        uid: nanoid(),
        branch,
        domain,
        symbol,
        contentHead: {},
        contentBody: { ...rest },
        blockUid: docBlock.uid,
        noteCopy: note ?? undefined,
      }
    return {
      blockReducers: [addEntities(blocks)],
      docReducers: [addEntities(newDoc)],
      newDocUid: newDoc.uid,
    }
  } else {
    const newDocBlock: Block = {
        uid: genBlockUid(),
        str: symbol,
        docSymbol: symbol,
        open: true,
        order: 0,
        parentUid: null,
        childrenUids: [],
      },
      newDoc: Doc = {
        uid: nanoid(),
        branch,
        domain,
        symbol,
        contentHead: {},
        contentBody: {
          discussIds: [],
          symbols: [],
        },
        blockUid: newDocBlock.uid,
      }
    return {
      blockReducers: [addEntities([newDocBlock])],
      docReducers: [addEntities(newDoc)],
      newDocUid: newDoc.uid,
    }
  }
}

/**
 * Rename doc title and its doc-block, only when note is not existed
 * If note is existed, a rename request stored in note-meta
 *
 * Steps
 * - Clone the doc with new name and add to the repo
 * - Open the new name doc
 * - Remove the old name doc
 */
export function docRenameOp(
  doc: Doc,
  newSymbol: string,
): {
  blockReducers: BlockReducer[]
  docReducers: DocReducer[]
} {
  if (doc.noteCopy)
    throw new Error('[docRenameOp] Doc has note-copy, cannot rename directly.')

  const docBlock = getBlock(doc.blockUid),
    blockReducers: BlockReducer[] = [
      updateEntities(doc.blockUid, {
        ...docBlock,
        docSymbol: newSymbol,
        str: newSymbol,
      }),
    ],
    docReducers = [
      // addEntities([{ ...doc, title: newTitle }]),
      updateEntities(doc.uid, { symbol: newSymbol }),
    ]
  return { blockReducers, docReducers }
}

/**
 * Also remove all blocks of doc
 */
export function docRemoveOp(doc: Doc): {
  blockReducers: BlockReducer[]
  docReducers: DocReducer[]
} {
  const docBlock = getBlock(doc.blockUid),
    blockReducers = blockRemoveOp(docBlock),
    docReducers = [deleteEntities(doc.uid)]

  return { blockReducers, docReducers }
}

/**
 * Because local repositories already have the content (blocks, meta),
 * only update the note-draft-copy
 */
export function docUpdatePropsOp(
  doc: Doc,
  props: Partial<Pick<Doc, 'noteDraftCopy' | 'contentHead'>>,
): DocReducer[] {
  return [updateEntities(doc.uid, { ...doc, ...props })]
}

// /**
//  *
//  */
// export function docUpdateContentHeadOp(
//   doc: Doc,
//   newContentHead: NoteDocContentHeadInput,
// ): {
//   docReducers: DocReducer[]
// } {
//   const docReducers = [
//     updateEntities(doc.title, { contentHead: newContentHead }),
//   ]
//   return { docReducers }
// }

//
// Shortcut Ops
//
//
//
//
//
//

// export function shortcutNewOp() {}

// export function shortcutRemoveOp() {}

// export function shortcutMoveOp() {}

//
// Common Ops
//
//
//
//
//
//

// /**
//  * "Convert internal representation to the vector of atomic operations that would create it.
//   :block/save operations are grouped at the end so that any ref'd entities are already created."
//  */
// function internalRepresentation_atomicOps(db, internalRepresentation defaultPosition) {
//   enhanceInternalRepresentation(internalRepresentation)

// }

// /**
//  *   "For blocks creates `:block/new` and `:block/save` event and for page creates `:page/new`
//    Arguments:
//    - `db` db value
//    - `uid` uid of the block where the internal representation needs to be pasted
//    - `internal-representation` of the pages/blocks selected"

//    ;; The parent of block depends on:
//          ;; - if the current block is open and has chidren : if this is the case then we want the blocks to be pasted
//          ;;   under the current block as its first children
//          ;; - else the parent is the current block's parent

//     ;; - If the block is empty then we delete the empty block and add new blocks. So in this case
//          ;;   the block order for the new blocks is the same as deleted blocks order.
//          ;; - If the block is parent then we want the blocks to be pasted as this blocks first children
//          ;; - If the block is not empty then add the new blocks after the current one.
//  */
// export function pasteOp(db, uid, localStr, internalRepresentation) {
//   const currentBlockParentUid = getParent(uid),
//     { order, childrenUids, str, open } = getBlock(uid),
//     isCurrentBlockParent = children && open,
//     isEmptyBlock = localStr.length === 0 && childrenUids.length === 0,
//     isNewBlockStr = localStr !== str,
//     blockSaveOp = isNewBlockStr && blockSaveOp()

//     // newBlockOrder = isEmptyBlock ?

// }
