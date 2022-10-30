import { ApolloError, FetchPolicy } from '@apollo/client'
import { difference, differenceBy, isInteger, isNil, zip } from 'lodash'
import type { NextRouter } from 'next/router'
import type {
  NoteDocFragment,
  NoteDraftEntryFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../../../apollo/query.graphql'
import { parseSymbol, toURLSymbol } from '../../../../share/symbol.common'
import {
  editingFocus,
  routeUpdateShallow,
  scrollToElement,
  setCursorPosition,
} from './effects'
import type {
  Block,
  DestructTextareaKeyEvent,
  BlockPositionRelation,
  Doc,
  EditorProps,
  TabChainItem,
} from './interfaces'
import { areSameParent, compatPosition } from './op/helpers'
import * as ops from './op/ops'
import { nextBlock, nthSiblingBlock, prevBlock } from './op/queries'
import { commitService } from './services/commit.service'
import { linkService } from './services/link.service'
import { noteService } from './services/note.service'
import { noteDraftService } from './services/note-draft.service'
import {
  BlockReducer,
  blockRepo,
  getBlock,
  getBlockChildren,
} from './stores/block.repository'
import { docRepo, genNewDoc, isDocChanged } from './stores/doc.repository'
import {
  buildChains,
  editorRepo,
  isChainItem,
} from './stores/editor.repository'
import { rfdbRepo } from './stores/rfdb.repository'
import { genBlockUid } from './utils'
import { BlockInput, writeBlocks } from './utils/block-writer'
import { slateDocSave } from '../../editor-slate/src/events'
import type { NoteDocContentHead } from '../../../../lib/interfaces'
import { BRANCH_NAME_DEFAULT } from '../../../../share/constants'

// const noteService = getNoteService(),
//   noteDraftService = getNoteDraftService(),
//   commitService = getCommitService()

//
// History Events
//
//
//
//
//
//

export function historyClear() {
  blockRepo.clearHistory()
}

/**
 * Undo
 */
export function historyUndo() {
  // const doNothing = rfdbRepo.getValue().editing.uid !== null
  // const editingUid = rfdbRepo.getValue().editing.uid,
  //   block = editingUid ? getBlock(editingUid) : null
  blockRepo.undo()
  const cursor = blockRepo.getCursor()
  if (cursor) editingUid(cursor.blockUid, cursor.caretIndex)
}

export function historyRedo() {
  blockRepo.redo()
}

//
// Key-down Events
//
//
//
//
//
//

export function keyArrowUp(uid: string, targetPos: number | 'end') {
  const block = getBlock(uid),
    parent = block.parentUid && getBlock(block.parentUid),
    prev = parent && prevBlock(block, parent),
    _editingUid = prev ? prev.uid : uid
  editingUid(_editingUid, targetPos)
}

export function keyArrowDown(uid: string, targetPos: number | 'end') {
  const block = getBlock(uid),
    next = block && nextBlock(block),
    _editingUid = next ? next.uid : uid
  editingUid(_editingUid, targetPos)
}

/**
 * "If root and 0th child, 1) if value, no-op, 2) if blank value, delete only block.
No-op if parent is missing.
No-op if parent is prev-block and block has children.
No-op if prev-sibling-block has children.
Otherwise delete block and join with previous block
If prev-block has children"
 * 
 */
export function keyBackspace(
  uid: string,
  value: string,
  maybeLocalUpdates?: string,
) {
  const block = getBlock(uid),
    { order, parentUid } = block,
    children = getBlockChildren(uid),
    parent = parentUid ? getBlock(parentUid) : null,
    prev = parent && prevBlock(block, parent),
    prevSib = parent && nthSiblingBlock(block, parent, -1)

  if (
    parent === null ||
    (children.length > 0 && prevSib && prevSib.childrenUids.length > 0) ||
    (children.length > 0 && parent === prev)
  ) {
    return
  }
  if (
    children.length === 0 &&
    parent.docSymbol &&
    order === 0 &&
    value === ''
  ) {
    backspaceDeleteOnlyChild(block)
    return
  }
  if (prev && maybeLocalUpdates) {
    backspaceDeleteMergeBlockWithSave(block, value, prev, maybeLocalUpdates)
    return
  }
  if (prev) {
    backspaceDeleteMergeBlock(block, value, prev)
    return
  }
  console.error({
    block,
    value,
    maybeLocalUpdates,
    children,
    parent,
    prev,
    prevSib,
  })
  throw new Error('backspace::unhandled situation')
}

/**
 * "- If block is open, has children, and caret at end, create new child
- If block is CLOSED, has children, and caret at end, add a sibling block.
- If value is empty and a root block, add a sibling block.
- If caret is not at start, split block in half.
- If block has children and is closed, if at end, just add another child.
- If block has children and is closed and is in middle of block, split block.
- If value is empty, unindent.
- If caret is at start and there is a value, create new block below but keep same block index."
 */
export function keyEnter(uid: string, dKeyDown: DestructTextareaKeyEvent) {
  const block = getBlock(uid),
    hasChildren = block.childrenUids.length > 0,
    parent = block.parentUid && getBlock(block.parentUid),
    parentIsRootBlock = (parent && parent.docSymbol) !== undefined,
    // contextRootUid = rfdbRepo.currentRoute.pathParams.id,  // contextRoot: the block opened as root
    newUid = genBlockUid(),
    { value, start } = dKeyDown,
    caretAtEnd = value.length === start,
    valueEmpty = value.length === 0

  if (block.open && hasChildren && caretAtEnd) {
    enterAddChild(block, newUid)
  } else if (!block.open && hasChildren && caretAtEnd && parent) {
    enterNewBlock(block, newUid)
  } else if (valueEmpty && parentIsRootBlock) {
    enterNewBlock(block, newUid)
  } else if (block.open && hasChildren && !caretAtEnd && start !== 0) {
    enterSplitBlock(block, newUid, value, start, 'first')
  } else if (start !== 0) {
    enterSplitBlock(block, newUid, value, start, 'after')
  } else if (valueEmpty) {
    // unindent(uid, dKeyDown, '', contextRootUid)
    enterNewBlock(block, newUid)
  } else if (start === 0 && value) {
    // enterBumpUp(block, newUid)
    enterSplitBlock(block, newUid, value, start, 'after')
  } else {
    console.error('[enter]', { uid, dKeyDown, block, parent })
    throw new Error('[enter]')
  }
}

function blockSaveBlockMoveCompositeOp(
  sourceBlock: Block,
  refUid: string,
  relation: BlockPositionRelation,
  localStr: string,
): [BlockReducer[], BlockReducer[]] {
  const location = compatPosition({ refBlockUid: refUid, relation })
  return [
    ops.blockSaveOp(sourceBlock.uid, localStr),
    ops.blockMoveOp(sourceBlock, location),
  ]
}

function getPrevSiblingBlockAndTargetRel(
  block: Block,
): [Block | null, BlockPositionRelation] {
  const parent = block.parentUid ? getBlock(block.parentUid) : null,
    prevSib = parent && nthSiblingBlock(block, parent, -1),
    targetRel = prevSib && prevSib.childrenUids.length > 0 ? 'last' : 'first'
  return [prevSib, targetRel]
}

/**
 * ;; - `block-zero`: The first block in a page
  ;; - `value`     : The current string inside the block being indented. Otherwise, if user changes block string and indents,
  ;;                 the local string  is reset to original value, since it has not been unfocused yet (which is currently the
  ;;                 transaction that updates the string).
  // if sibling block is closed with children, open
 */
export function indent(
  uid: string,
  dKeyDown: DestructTextareaKeyEvent,
  localStr: string,
) {
  const block = getBlock(uid),
    blockZero = block.order === 0,
    [sib, rel] = getPrevSiblingBlockAndTargetRel(block)

  if (sib && !blockZero) {
    const sibClose = !sib.open && sib.childrenUids.length > 0,
      sibOpenOp = sibClose && ops.blockOpenOp(sib.uid, true),
      { start, end } = dKeyDown,
      [saveOp, moveOp] = blockSaveBlockMoveCompositeOp(
        block,
        sib.uid,
        rel,
        localStr,
      )

    if (sibOpenOp) {
      blockRepo.update([...saveOp, ...moveOp, ...sibOpenOp], {
        blockUid: uid,
        caretIndex: start,
      })
    } else {
      blockRepo.update([...saveOp, ...moveOp], {
        blockUid: uid,
        caretIndex: start,
      })
    }
    setCursorPosition(uid, start, end)
  }
}

export function indentMulti(uids: string[]) {
  const blocks = uids.map(e => getBlock(e)),
    firstBlock = blocks[0],
    firstBlockOrder = firstBlock.order,
    blockZero_ = firstBlockOrder === 0,
    [prevBlock, targetRel] = getPrevSiblingBlockAndTargetRel(firstBlock),
    sameParent_ = areSameParent(blocks)

  if (sameParent_ && !blockZero_ && prevBlock) {
    dropMultiSiblings(uids, prevBlock.uid, targetRel)
  }
}

export function unindent(
  uid: string,
  dKeyDown: DestructTextareaKeyEvent,
  localStr: string,
  contextRootUid?: string,
) {
  const block = getBlock(uid),
    parent = block.parentUid ? getBlock(block.parentUid) : null,
    // doNothing =
    //   parent === null ||
    //   parent.pageTitle !== null ||
    //   contextRootUid === parent.uid,
    { start, end } = dKeyDown

  if (parent && parent.docSymbol === undefined) {
    const [saveOp, moveOp] = blockSaveBlockMoveCompositeOp(
      block,
      parent.uid,
      'after',
      localStr,
    )
    blockRepo.update([...saveOp, ...moveOp], {
      blockUid: uid,
      caretIndex: start,
    })

    editingUid(uid)
    setCursorPosition(uid, start, end)
  }
}

export function unindentMulti(uids: string[]) {
  const blocks = uids.map(e => getBlock(e)),
    firstBlock = blocks[0],
    parent = firstBlock.parentUid ? getBlock(firstBlock.parentUid) : null,
    sameParent_ = areSameParent(blocks)

  if (parent && parent.docSymbol === undefined && sameParent_) {
    dropMultiSiblings(uids, parent.uid, 'after')
  }
}

//
// Backspace Events
//
//
//
//
//
//

export function backspaceDeleteMergeBlock(
  block: Block,
  value: string,
  prevBlock: Block,
) {
  blockRepo.updateChain(ops.blockMergeChainOp(block, prevBlock, value), {
    blockUid: prevBlock.uid,
    caretIndex: prevBlock.str.length,
  })
  editingUid(prevBlock.uid, prevBlock.str.length)
}

export function backspaceDeleteMergeBlockWithSave(
  block: Block,
  value: string,
  prevBlock: Block,
  localUpdate?: string,
) {
  blockRepo.updateChain(
    ops.blockMergeWithUpdatedChainOp(block, prevBlock, value, localUpdate),
    {
      blockUid: prevBlock.uid,
      caretIndex: localUpdate?.length ?? 0,
    },
  )
  editingUid(prevBlock.uid, localUpdate?.length)
}

export function backspaceDeleteOnlyChild(block: Block) {
  // console.log('backspaceDeleteOnlyChild')
  blockRepo.update(ops.blockRemoveOp(block), null)
  editingUid(null)
}

//
// Block Events
//
//
//
//
//
//

export function blockMove(
  sourceUid: string,
  targetUid: string,
  targetRel: BlockPositionRelation,
) {
  const block = getBlock(sourceUid)

  blockRepo.update(
    ops.blockMoveOp(block, { refBlockUid: targetUid, relation: targetRel }),
  )
}

export function blockOpen(uid: string, open: boolean) {
  blockRepo.update(ops.blockOpenOp(uid, open))
}

export function blockSave(uid: string, str: string) {
  // console.debug('save', str)

  const block = getBlock(uid),
    doNothing = block.str === str

  if (block.docSymbol) {
    throw new Error('[blockSave] doc-block not allow to change string')
  }
  if (!doNothing) {
    blockRepo.update(ops.blockSaveOp(uid, str))
  }
}

/**
 * Replace block's partial string if found and save
 */
export function blockStrReplace(
  uid: string,
  searchStr: string,
  replaceStr: string,
) {
  const block = getBlock(uid),
    { str } = block,
    str_ = str.replace(searchStr, replaceStr)

  blockSave(uid, str_)
}

//
// Drop Events
//
//
//
//
//
//

export function dropMultiChild(sourceUids: string[], targetUid: string) {
  blockRepo.updateChain(ops.blockMoveChainOp(targetUid, sourceUids, 'first'))
}

/**
 * ;; When the selected blocks have same parent and are DnD under the same parent this event is fired.
    ;; This also applies if on selects multiple Zero level blocks and change the order among other Zero level blocks.
 */
export function dropMultiSiblings(
  sourceUids: string[],
  targetUid: string,
  dragTarget: BlockPositionRelation,
) {
  blockRepo.updateChain(ops.blockMoveChainOp(targetUid, sourceUids, dragTarget))
}

//
// Editing Events
//
//
//
//
//
//

export function editingTarget(target: HTMLTextAreaElement) {
  const uid = target.id.split('editable-uid-')[1]
  editingUid(uid)
}

export function editingUid(uid: string | null, cursorAnchor?: number | 'end') {
  rfdbRepo.updateEditingUid(uid)
  editingFocus(uid, cursorAnchor)
}

export function editingFirstChild(doc: Doc) {
  const docBlock = getBlock(doc.blockUid),
    { childrenUids } = docBlock
  if (childrenUids.length > 0) editingUid(childrenUids[0])
}

export function editingLastChild(doc: Doc) {
  const docBlock = getBlock(doc.blockUid),
    { childrenUids } = docBlock
  if (childrenUids.length > 0) editingUid(childrenUids[childrenUids.length - 1])
}

//
// Enter Events
//
//
//
//
//
//

export function enterAddChild(block: Block, newUid: string) {
  const position = compatPosition({
      refBlockUid: block.uid,
      relation: 'first',
    }),
    op = ops.blockNewOp(newUid, position)
  blockRepo.update(op, { blockUid: newUid, caretIndex: 0 })
  editingUid(newUid)
}

export function enterBumpUp(block: Block, newUid: string) {
  const position = compatPosition({
      refBlockUid: block.uid,
      relation: 'before',
    }),
    op = ops.blockNewOp(newUid, position)
  blockRepo.update(op, { blockUid: newUid, caretIndex: 0 })
  editingUid(newUid)
}

// export function enterNewBlock(block: Block, parent: Block, newUid: string) {
export function enterNewBlock(block: Block, newUid: string) {
  blockRepo.update(
    ops.blockNewOp(newUid, { refBlockUid: block.uid, relation: 'after' }),
    { blockUid: newUid, caretIndex: 0 },
  )
  editingUid(newUid)
}

export function enterSplitBlock(
  block: Block,
  newUid: string,
  value: string,
  index: number,
  relation: BlockPositionRelation,
) {
  // console.debug(value)
  blockRepo.updateChain(
    ops.blockSplitChainOp(block, newUid, value, index, relation),
    { blockUid: newUid, caretIndex: 0 },
  )
  editingUid(newUid)
}

/**
 * ;; Triggered when there is a closed embeded block with no content in the top level block
  ;; and then one presses enter in the embeded block.
 */
// function enterOpenBlockAddChild() {}

//
// Mouse Events
//
//
//
//
//
//

export function mouseDownSet() {
  rfdbRepo.updateMouseDown(true)
}

export function mouseDownUnset() {
  rfdbRepo.updateMouseDown(false)
}

//
// Paste Events
//
//
//
//
//
//
// export function pasteInternal(
//   uid: string,
//   localStr: string,
//   internalRepresentation,
// ) {
//   // ops.
// }

//
// Selction Events
//
//
//
//
//
//

export function selectionAddItem(
  uid: string,
  position: number | 'first' | 'last',
) {
  const selectedItems = rfdbRepo.getValue().selection.items,
    selectedCount = selectedItems.length

  if (position === 'last') {
    rfdbRepo.updateSelectionItems([...selectedItems, uid])
  } else if (position === 'first') {
    rfdbRepo.updateSelectionItems([uid, ...selectedItems])
  } else if (isInteger(position)) {
    if (0 <= position && position <= selectedCount) {
      const newSelectedItems = [
        ...selectedItems.slice(0, position),
        uid,
        ...selectedItems.slice(position, selectedCount),
      ]
      rfdbRepo.updateSelectionItems([...newSelectedItems, uid])
    } else {
      console.error(
        '[selectionAddItem] Invalid insert position',
        position,
        uid,
        selectedItems,
      )
    }
  }
}

export function selectionClear() {
  rfdbRepo.updateSelectionItems([])
}

export function selectionDelete() {
  const selectedUids = rfdbRepo.getValue().selection.items,
    chain = ops.blockRemoveManyChainOp(selectedUids)

  blockRepo.updateChain(chain, null)
  rfdbRepo.updateSelectionItems([])
  editingUid(null)
}

export function selectionSetItems(uids: string[]) {
  rfdbRepo.updateSelectionItems(uids)
  editingUid(null)
}

function selectUp(selectedItems: string[]): string[] {
  if (selectedItems.length === 0) {
    throw new Error('[selectUp] selectedItems.length === 0')
  }

  const firstItem = selectedItems[0],
    block = getBlock(firstItem),
    parent = block.parentUid && getBlock(block.parentUid),
    prev = parent && prevBlock(block, parent),
    editingUid = rfdbRepo.getValue().editing.uid,
    editingIdx = selectedItems.findIndex(e => e === editingUid),
    n = selectedItems.length

  let newItems: string[] = []
  // ;; if prev-block is root node TODO: (OR context root), don't do anything
  if (editingIdx === 0 && n > 1 && selectedItems.pop()) {
    // do nothing
  } else if (prev && prev.docSymbol) {
    newItems = selectedItems
    // ;; if prev block is parent, replace editing/uid and first item w parent; remove children
  } else if (parent && prev && parent.uid === prev.uid) {
    const parentChildren = parent.childrenUids,
      toKeep = selectedItems.filter(e => !parentChildren.includes(e))
    newItems = [prev.uid, ...toKeep]
  } else if (prev) {
    newItems = [prev.uid, ...selectedItems]
  }

  return newItems
}

export function selectedUp(selectedItems: string[]) {
  console.debug('selectedUp', selectedItems)
  rfdbRepo.updateSelectionItems(selectUp(selectedItems))
}

export function selectedDown(selectedItems: string[]) {
  if (selectedItems.length === 0) {
    throw new Error('[selectUp] selectedItems.length === 0')
  }

  const lastItem = selectedItems[selectedItems.length - 1],
    block = getBlock(lastItem),
    next = nextBlock(block, true)

  if (next) {
    rfdbRepo.updateSelectionItems([...selectedItems, next.uid])
  }
}

//
// Doc Events
//
//
//
//
//
//

// export function pageNew(title: string, blockUid: string, shift?: true) {
//   blockRepo.pageNewOp(title, blockUid)
//   pageNewFollowup(title, shift)
//   editingUid(blockUid)
// }

// export function pageNewFollowup(title: string, shift?: true) {
//   const pageUid = blockRepo.getPageUid(title)
//   if (shift) {
//     // rightSidebarOpenItem(pageUid)
//   } else {
//     navigate({ page: { id: pageUid } })
//   }
// }

/**
 * TODO:
 * - [] Remove branch param and use it from draft
 */
function docLoadFromDraft(draft: NoteDraftFragment, note: NoteFragment | null) {
  const docData = noteDraftService.toDoc(draft, note),
    { blockReducers, docReducers, docUid } = ops.docLoadOp(
      draft.symbol,
      docData,
    )
  blockRepo.update(blockReducers)
  docRepo.update(docReducers)

  const doc = docRepo.getDoc(docUid)
  return doc
}

async function getOrCreateDocByUrl(
  url: URL,
  branch = BRANCH_NAME_DEFAULT,
  domain = 'domain',
) {
  const link = await linkService.getOrCreateLink(url.href)
  const symbol = toURLSymbol(link.url)

  const doc = docRepo.findDoc({ symbol })
  if (doc !== null) return doc

  const [queriedNote, queriedDraft] = await Promise.all([
    noteService.queryNote(symbol, 'network-only'),
    noteDraftService.queryDraft(symbol, 'network-only'),
  ])
  if (queriedDraft !== null) return docLoadFromDraft(queriedDraft, queriedNote)

  const symbolParsed = parseSymbol(symbol)
  const { draftInput } = genNewDoc(symbolParsed, domain, queriedNote, link)
  const draft = await noteDraftService.createDraftByLink(
    branch,
    link.id,
    draftInput,
  )
  const newDoc = docLoadFromDraft(draft, queriedNote)

  await editorChainsRefresh('network-only')

  return newDoc
}

/**
 * If doc is found in the repository (local memory), no need to query,
 *  otherwise, query remote's note, note-draft and then create a doc,
 * - If local-doc found, do nothing.
 * - If local-doc not found, find remote's draft.
 * - If remote's draft not found, create draft & local-doc from note's head-doc.
 * - If note's head-doc not found, create new draft and then local-doc.
 *   - If symbol is a link, get or create link first, and then use link's resolved url as symbol
 *
 */
export async function docGetOrCreate(
  symbol: string,
  branch = BRANCH_NAME_DEFAULT,
  domain = 'domain',
): Promise<Doc> {
  // If local-doc found, do nothing.
  //
  const doc = docRepo.findDoc({ symbol })
  if (doc !== null) return doc

  // If local-doc not found, find remote's draft.
  //
  const [queriedNote, queriedDraft] = await Promise.all([
    noteService.queryNote(symbol, 'network-only'),
    noteDraftService.queryDraft(symbol, 'network-only'),
  ])
  if (queriedDraft !== null) return docLoadFromDraft(queriedDraft, queriedNote)

  // If remote's draft not found, create draft & local-doc from note's head-doc.
  //
  const symbolParsed = parseSymbol(symbol)

  if (symbolParsed.url)
    return getOrCreateDocByUrl(symbolParsed.url, branch, domain)

  // Create a temporary doc (without draft) and use it to create the draft, then save the doc to the repo with the just created draft.
  const { draftInput } = genNewDoc(symbolParsed, domain, queriedNote)
  const draft = await noteDraftService.createDraft(branch, symbol, draftInput)
  const newDoc = docLoadFromDraft(draft, queriedNote)

  await editorChainsRefresh('network-only')

  return newDoc
}

/**
 * Save doc on remote, use doc's title as 'symbol'
 *  Because local repositories already have the content,
 *  only update the note-draft-copy.
 * @param opts.force if not true, will check and only save when doc is changed
 */
export async function docSave(
  docUid: string,
  newSymbol?: string,
  opts = {
    force: false,
  },
) {
  // console.log('docSave')
  const { changed, changes, input, noteDraftCopy } = isDocChanged(docUid)

  if (opts.force || changed) {
    const draft = await noteDraftService.updateDraft(
        noteDraftCopy.id,
        input,
        newSymbol,
      ),
      op = ops.docUpdatePropsOp(docUid, { noteDraftCopy: draft })

    docRepo.update(op)
  }
}

/**
 * Remove doc from local and remote if possible
 */
function docRemove(doc: Doc) {
  const { blockReducers, docReducers } = ops.docRemoveOp(doc)
  blockRepo.update(blockReducers)
  docRepo.update(docReducers)
}

/**
 * If note not existed, rename the doc
 * If note existed, update content-head without rename
 *
 * TODO:
 */
export async function docRename(
  doc: Doc,
  newSymbol: string,
  router?: NextRouter,
) {
  if (doc.noteDraftCopy.symbol === newSymbol) return
  if (doc.noteCopy) return // Note existed, update content-head without rename

  const { blockReducers, docReducers } = ops.docRenameOp(doc, newSymbol)
  blockRepo.update(blockReducers)
  docRepo.update(docReducers)

  await docSave(doc.uid, newSymbol)

  // console.log(opening.symbolMain, doc.title)

  const { opening } = editorRepo.getValue()
  if (opening.main.docUid === doc.uid)
    await editorOpenSymbolInMain(newSymbol, router, {
      forceRouteUpdateShallow: true,
      skipSave: true,
    })
  if (opening.modal.docUid === doc.uid)
    await editorOpenSymbolInModal(newSymbol, router, { skipSave: true })

  // await editorLeftSidebarRefresh('network-only')
  await editorChainsRefresh('network-only')
}

function genTemplateGeneral(): BlockInput {
  const general: BlockInput = [
    'DUMMY_ROOT',
    [
      [
        'Basic',
        [
          ['What is ...?', ['']],
          // ['Explain ... in one picture?', ['']],
          ['Why and why not ...?', ['']],
          ['How ...?', ['']],
          // ['How this research solve?', ['']],
          ['What difference compared to the others?', ['']],
        ],
      ],
      ['Discuss', ['']],
    ],
  ]
  return general
}

/**
 * Set doc template
 */
export function docTemplateSet(docUid: string) {
  const doc = docRepo.getDoc(docUid),
    docBlock = docRepo.getDocBlock(doc),
    blocks = writeBlocks(genTemplateGeneral(), { docBlock }),
    [, ...children] = blocks,
    op = ops.blocksInsertOp(docBlock, children)

  blockRepo.update(op)
}

/**
 *
 */
export async function docContentHeadUpdate(
  doc: Doc,
  newContentHead: NoteDocContentHead,
  router?: NextRouter,
) {
  const { symbol } = newContentHead,
    isRename = !isNil(symbol) && symbol !== doc.noteDraftCopy.symbol

  const op = ops.docUpdatePropsOp(doc.uid, { contentHead: newContentHead })
  docRepo.update(op)

  if (isRename) {
    docRename(doc, symbol, router)
  }
}

//
// Editor Events
//
//
//
//
//
//

/**
 * Refresh left sidebar by query and load my-all-draft-entries
 */
export async function editorLeftSidebarRefresh(fetchPolicy?: FetchPolicy) {
  try {
    const entries = await noteDraftService.queryMyAllDraftEntries(fetchPolicy)
    editorRepo.setLeftSidebarItems(entries)
  } catch (err) {
    if (err instanceof ApolloError) {
      // TODO: Handle not authenticated case -> set auth status in editor repo
      console.debug(err)
    } else {
      throw err
    }
  }
}

/**
 * Remove the item from left sidebar
 * - If draft is existed in doc-repo, remove both doc and remote-draft
 *   If not, remove remote-draft only
 * - Refresh sidebar
 *
 * TODOS
 * - [] After remove the item, show items in the recycle bin
 */
export async function editorLeftSidebarItemRemove(
  item: NoteDraftEntryFragment,
) {
  const { id, symbol } = item,
    doc = docRepo.findDoc({ symbol })

  if (doc) {
    docRemove(doc)
  } else if (item.status === 'EDIT') {
    await noteDraftService.dropDraft(id)
  } else if (item.status === 'DROP') {
    await noteDraftService.deleteDraft(id)
  }
  await editorLeftSidebarRefresh('network-only')
}

async function saveCurDoc(docUid: string) {
  try {
    await docSave(docUid)
  } catch (err) {
    // In some cases (eg remove doc), the doc will not be found
    console.debug(err)
  }
}

/**
 * Opens a symbol in the modal editor.
 * - If symbol is 'null', save previous and close the modal editor.
 * - If the modal symbol is the same as main symbol, set modal symbol to 'null'.
 * - If the new modal symbol is the same as current, do nothing.
 * - If has cur modal doc, save it
 * - Open the doc of given symbol so it will store into doc repo,
 *   update opening modal symbol
 * Side effect: shallow update route
 */
export async function editorOpenSymbolInModal(
  symbol: string | null,
  router?: NextRouter,
  opts?: {
    skipSave?: true
  },
) {
  const { opening } = editorRepo.getValue()

  if (opening.main.symbol === null)
    throw new Error('[editorOpenSymbolInModal] symbolMain === null')

  if (opening.modal.docUid && !opts?.skipSave) saveCurDoc(opening.modal.docUid)

  if (symbol === null || symbol === opening.main.symbol) {
    if (router) {
      await routeUpdateShallow(router, {
        pathname: '/note/[...slug]',
        query: { slug: [opening.main.symbol, 'edit'] },
      })
    }
    editorRepo.updateOpening({
      ...opening,
      modal: { symbol: null, docUid: null },
    })
  } else if (symbol === opening.modal.symbol) {
    // Do nothing
  } else {
    if (router) {
      await routeUpdateShallow(router, {
        pathname: '/note/[...slug]',
        query: { slug: [opening.main.symbol, 'edit'], pop: symbol },
      })
    }
    editorRepo.updateOpening({
      ...opening,
      modal: { symbol, docUid: null },
    })

    const doc = await docGetOrCreate(symbol)
    editorRepo.updateOpening({
      ...opening,
      modal: { symbol, docUid: doc.uid },
    })
  }
}

/**
 * Opens a symbol in the main editor and set modal-symbol to 'null' if any
 * This method should be called when the editor component first render.
 * - Save all the previous docs
 * - Set new main-symbol
 * - Set modal-symbol to 'null'
 *
 */
export async function editorOpenSymbolInMain(
  symbol: string | null,
  router?: NextRouter,
  opts?: {
    skipSave?: true
    forceRouteUpdateShallow?: true
  },
) {
  // console.log('editorOpenSymbolInMain', symbol)

  const { opening } = editorRepo.getValue()

  if (opening.main.docUid && !opts?.skipSave) saveCurDoc(opening.main.docUid)
  if (opening.modal.docUid && !opts?.skipSave) saveCurDoc(opening.modal.docUid)

  if (symbol === null) {
    editorRepo.updateOpening({
      main: { symbol: null, docUid: null },
      modal: { symbol: null, docUid: null },
    })
    return
  }
  if (router) {
    const { pop } = router.query
    if (pop) {
      // Remove query params
      await routeUpdateShallow(router, {
        pathname: '/note/[...slug]',
        query: { slug: [symbol, 'edit'] },
      })
    } else if (opts?.forceRouteUpdateShallow) {
      await routeUpdateShallow(router, {
        pathname: '/note/[...slug]',
        query: { slug: [symbol, 'edit'] },
      })
    }
  }

  const doc = await docGetOrCreate(symbol)
  editorRepo.updateOpening({
    modal: { symbol: null, docUid: null },
    main: { symbol, docUid: doc.uid },
  })
}

/**
 * - If insert position is its current position, do nothing
 * - Disconnect from current position
 * - Insert to the new position
 */
async function connectChainItem(
  entries: EditorProps['draftEntries'],
  afterThisDraftId: string | null,
  insertDraft: Doc['noteDraftCopy'],
) {
  if (insertDraft.meta.chain?.prevId === afterThisDraftId) {
    return
  }
  if (entries.find(e => e.id === insertDraft.id)) {
    disconnectChainItem(entries, insertDraft.id)
  }
  if (afterThisDraftId !== null) {
    const atPrev = entries.find(e => e.id === afterThisDraftId),
      atNext = entries.find(e => e.meta.chain?.prevId === afterThisDraftId)

    if (atPrev === undefined) throw new Error('atPrev not found')
    if (atNext) {
      await noteDraftService.updateDraftMeta(atNext.id, {
        chainPrevId: insertDraft.id,
      })
    }
  }
  await noteDraftService.updateDraftMeta(insertDraft.id, {
    chainPrevId: afterThisDraftId,
  })
}

async function disconnectChainItem(
  entries: EditorProps['draftEntries'],
  itemDraftId: string,
) {
  const item = entries.find(e => e.id === itemDraftId),
    itemPrev = item && entries.find(e => e.id === item.meta.chain?.prevId),
    itemsNext = item && entries.filter(e => e.meta.chain?.prevId === item.id)

  if (item === undefined) throw new Error('Item not found in entries')
  if (item.meta.chain?.prevId && itemPrev === undefined)
    throw new Error('Item-prev not found in entries')
  if (itemsNext && itemsNext.length > 1)
    throw new Error('Found multiple next items')

  if (itemsNext && itemsNext.length === 1) {
    const itemNext = itemsNext[0]
    await noteDraftService.updateDraftMeta(itemNext.id, {
      chainPrevId: item.meta.chain?.prevId ?? null,
    })
  }
}

/**
 * Reset orphans link to null
 */
async function resetChainOrphans(orphans: NoteDraftEntryFragment[]) {
  await Promise.all(
    orphans.map(e =>
      noteDraftService.updateDraftMeta(e.id, { chainPrevId: null }),
    ),
  )
}

/**
 * Insert an item into current chain
 * If item is in current chain, return
 * If symbol is in other chains, remove it and insert
 * If symbol is not existed, insert it
 */
export async function editorChainItemInsert(
  symbol: string,
  afterThisDraftId: string | null,
) {
  const { tab, draftEntries } = editorRepo.getValue(),
    entries = draftEntries.filter(e => e.status === 'EDIT'),
    doc = docRepo.findDoc({ symbol }),
    entry = doc && draftEntries.find(e => e.id === doc.noteDraftCopy.id),
    afterThisDraftIdx = afterThisDraftId
      ? tab.chain.findIndex(
          e => isChainItem(e) && e.entry.id === afterThisDraftId,
        )
      : null,
    insertIndex = (afterThisDraftIdx ?? 0) + 1

  if (afterThisDraftIdx !== null && afterThisDraftIdx < 0) {
    throw new Error('Not found afterThisDraftId in tab.chain')
  }

  // Doc is in current chain, do nothing and scroll to the item
  if (
    doc &&
    tab.chain.find(e => isChainItem(e) && e.entry.id === doc.noteDraftCopy.id)
  ) {
    scrollToElement(doc.noteDraftCopy.id)
    return { draftInserted: doc.noteDraftCopy }
  }

  // Doc is in other chains
  if (doc && entry) {
    tab.chain.splice(insertIndex, 0, {
      entry,
      docUid: doc.uid,
      rendered: true,
    })
    editorRepo.setTab({
      chain: tab.chain,
      openingDraftId: entry.id,
    })
    scrollToElement(doc.noteDraftCopy.id)
  }

  // Doc is not exist, insert a placeholder first
  if (doc === null) {
    tab.chain.splice(insertIndex, 0, { symbol })
    editorRepo.setTab({ chain: tab.chain })
  }

  const doc_ = doc ?? (await docGetOrCreate(symbol))
  await connectChainItem(entries, afterThisDraftId, doc_.noteDraftCopy)

  const { entries: entries_ } = await editorChainsRefresh('network-only'),
    entry_ = entries_.find(e => e.id === doc_.noteDraftCopy.id)

  if (entry_ === undefined) throw new Error('')

  tab.chain.splice(insertIndex, 1, {
    entry: entry_,
    docUid: doc_.uid,
    rendered: true,
  })
  editorRepo.setTab({
    chain: tab.chain,
    openingDraftId: entry_.id,
  })

  return { draftInserted: doc_.noteDraftCopy }
}

/**
 * @returns true if success
 */
export async function editorChainItemRemove(entry: NoteDraftEntryFragment) {
  const { id } = entry,
    { draftEntries, tab } = editorRepo.getValue(),
    entries = draftEntries.filter(e => e.status === 'EDIT'),
    doc = docRepo.findDoc({ draftId: id })

  if (doc) {
    docRemove(doc)
  }
  if (entry.status === 'EDIT') {
    await noteDraftService.dropDraft(id)
  } else if (entry.status === 'DROP') {
    await noteDraftService.deleteDraft(id)
  }
  await disconnectChainItem(entries, id)
  await editorChainsRefresh('network-only')

  editorRepo.setTab({
    chain: tab.chain.filter(e => isChainItem(e) && e.entry.id !== entry.id),
  })

  return true
}

/**
 *
 */
export async function editorChainCommit(draftId: string) {
  const { chains, tab } = editorRepo.getValue(),
    entries = editorRepo.getChainEntries(chains, draftId),
    entriesInEditing = tab.chain.filter(
      (a): a is TabChainItem =>
        entries.find(b => isChainItem(a) && b.id === a.entry.id) !== undefined,
    )

  if (entries[0].id !== draftId)
    throw new Error('Only allow to commit the chain from the first chain item')

  // Save current works before commit
  await Promise.all(entriesInEditing.map(e => slateDocSave(e.docUid)))

  const commit = await commitService.createCommit(entries.map(e => e.id))
  commitSuccessClean(commit.noteDocs)
  await editorChainsRefresh('network-only')
  await commitService.queryCommitsByUser(commit.userId)

  return commit
}

/**
 * Open a chain of the given draftId
 * - [removed] If given draftId is in current chain, no call
 */
export async function editorChainOpen(
  leadDraftId: string,
  anchorDraftId?: string,
) {
  const draftId = anchorDraftId ?? leadDraftId

  editorRepo.setTab({ chain: [], openingDraftId: draftId })

  const { chains } = await editorChainsRefresh(),
    entries = editorRepo.getChainEntries(chains, draftId),
    docs = await Promise.all(entries.map(e => docGetOrCreate(e.symbol))),
    chain: EditorProps['tab']['chain'] = zip(entries, docs).map(([a, b]) => {
      if (a && b) {
        return {
          entry: a,
          docUid: b.uid,
          rendered: false,
        }
      }
      throw new Error()
    }),
    curDoc = docs.find(e => e.noteDraftCopy.id === draftId)

  if (curDoc === undefined)
    throw new Error('Unexpected error: curDoc === undefined')

  editorRepo.setTab({ chain })

  return { chain, curDoc }
}

export function editorChainItemScrollTo(anchorDraftId: string) {
  editorRepo.setTab({
    openingDraftId: anchorDraftId,
  })
}

/**
 *
 * Will not update tab.chain here. It is updated by `editorChainItemInsert`, `editorChainItemRemove` events
 */
export async function editorChainsRefresh(fetchPolicy?: FetchPolicy): Promise<{
  entries: NoteDraftEntryFragment[]
  chains: NoteDraftEntryFragment[][]
}> {
  try {
    const entries = await noteDraftService.queryMyAllDraftEntries(fetchPolicy),
      { chains, orphans } = buildChains(entries, e => e.meta.chain?.prevId)

    if (orphans.length > 0) {
      console.debug('orphans', orphans)
      await resetChainOrphans(orphans)
      await editorChainsRefresh('network-only')
    }

    editorRepo.setDraftEntries(entries)
    editorRepo.setChains(chains)

    return { entries, chains }
  } catch (err) {
    if (err instanceof ApolloError) {
      // TODO: Handle not authenticated case -> set auth status in editor repo
      console.debug(err)
      return { entries: [], chains: [] }
    } else {
      throw err
    }
  }
}

export async function editorChainItemSetRendered(docUid: string) {
  // editorRepo.setTabChainItemRendered(docUid)
}

//
// Commit Events
//
//
//
//
//
//

/**
 * Commit is called directly through the apollo-client,
 * here only taking care of repository mutations after the commit.
 *
 * If commit success
 * - Remove local docs from doc-repo, sidebar
 */
export function commitSuccessClean(resultDocs: NoteDocFragment[]) {
  for (const e of resultDocs) {
    const doc = docRepo.findDoc({ symbol: e.symbol })
    if (doc) {
      const { blockReducers, docReducers } = ops.docRemoveOp(doc)
      blockRepo.update(blockReducers)
      docRepo.update(docReducers)
    }
  }
}
