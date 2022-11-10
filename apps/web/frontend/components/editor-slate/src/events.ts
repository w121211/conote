import type { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import { isEqual } from 'lodash'
import { NoteDocFragment } from '../../../../apollo/query.graphql'
import type { NoteDocContentHead } from '../../../../lib/interfaces'
import {
  differenceBlocks,
  differenceContentHead,
  parseGQLBlocks,
} from '../../../../share/utils'
import type {
  Block,
  Doc,
  TabChainItem,
} from '../../editor-textarea/src/interfaces'
import { docUpdatePropsOp } from '../../editor-textarea/src/op/ops'
import { noteDraftService } from '../../editor-textarea/src/services/note-draft.service'
import { docRepo } from '../../editor-textarea/src/stores/doc.repository'
import { editorRepo } from '../../editor-textarea/src/stores/editor.repository'
import { validateIndenters } from './indenter/normalizers'
import { blocksToIndenters, indentersToBlocks } from './indenter/serializers'
import type { ElementIndenter } from './interfaces'
import { docEditorValueRepo } from './stores/doc-editor-value.repository'
import { genTemplateBlocks } from './templates'

//
// Utils
//
//
//
//
//
//

function toGQLBlocks(blocks: Block[]) {
  return blocks.map(e => {
    const { editTime, childrenUids, ...rest } = e
    return { ...rest }
  })
}

export function toNoteDraftInput(
  doc: Doc,
  value: ElementIndenter[],
): NoteDraftInput {
  const { blockUid: docBlockUid, noteCopy, noteDraftCopy, contentHead } = doc
  const bodyBlocks = indentersToBlocks(value, docBlockUid)
  const bodyBlocks_: Block[] = bodyBlocks.map(e => ({ ...e, childrenUids: [] }))
  const docBlock = docRepo.getDocBlock(doc)
  const finalBlocks = [docBlock, ...bodyBlocks_]
  const finalBlocks_ = toGQLBlocks(finalBlocks)

  // Null is a valide input for differencer, but '[]' is not
  const startBlocks = noteCopy
      ? noteCopy.headDoc.contentBody.blocks.map(e => ({
          ...e,
          parentUid: e.parentUid ?? null,
          open: e.open ?? undefined,
          docSymbol: e.docSymbol ?? undefined,
        }))
      : null,
    blockDiff = differenceBlocks(finalBlocks_, startBlocks)

  const input: NoteDraftInput = {
    fromDocId: noteCopy?.headDoc.id,
    domain: noteDraftCopy.domain,
    contentHead,
    contentBody: {
      // discussIds: [],
      // symbols: [],
      blocks: finalBlocks_,
      blockDiff: blockDiff,
    },
  }

  return input
}

/**
 * Compare difference between saved draft and current value, used to determine should update draft or not
 *
 */
function isDraftValueChanged(docUid: string, value: ElementIndenter[]) {
  const doc = docRepo.getDoc(docUid)
  const { noteDraftCopy: start } = doc

  const input = toNoteDraftInput(doc, value)
  const { blocks: startBlocks } = parseGQLBlocks(start.contentBody.blocks)
  const { blocks: finalBlocks } = parseGQLBlocks(input.contentBody.blocks)

  const diffBlocks = differenceBlocks(finalBlocks, startBlocks)
  const diffContentHead = differenceContentHead(
    doc.contentHead,
    start.contentHead,
  )

  return { doc, noteDraftCopy: start, input, diffBlocks, diffContentHead }
}

//
// Slate doc events
//
//
//
//
//
//

/**
 * @returns true if doc is saved, returns false if doc is not perform save (eg, content not change)
 * @throws IndenterFormatError
 */
export async function slateDocSave(
  docUid: string,
  newSymbol?: string,
  opts = {
    force: false,
  },
) {
  const { value } = docEditorValueRepo.getValue(docUid)
  const { input, noteDraftCopy, diffBlocks, diffContentHead } =
    isDraftValueChanged(docUid, value) // This method involve validate indenter value

  if (opts.force || diffBlocks.length > 0 || diffContentHead) {
    const draft = await noteDraftService.updateDraft(
        noteDraftCopy.id,
        input,
        newSymbol,
      ),
      op = docUpdatePropsOp(docUid, { noteDraftCopy: draft })

    docRepo.update(op)
    return true
  }

  return false
}

export function docTemplateGenerate(docUid: string, templateName: string) {
  const doc = docRepo.getDoc(docUid)
  const docBlock = docRepo.getDocBlock(doc)
  const blocks = genTemplateBlocks(
    templateName.toLowerCase(),
    docBlock,
    doc.noteDraftCopy.symbol,
  )
  const indenters = blocksToIndenters(blocks)

  return indenters
}

//
// Editor events
//
//
//
//
//
//

export function editorValueUpdate(docUid: string, value: ElementIndenter[]) {
  docEditorValueRepo.updateValue(docUid, value)
}

/**
 * Used to trigger template reset
 */
export function editorValueReset(docUid: string) {
  docEditorValueRepo.updateValue(docUid, [])
}

export function editorAlertRefresh() {
  //
}

function preventExitWithoutSave(e: BeforeUnloadEvent) {
  const {
    tab: { chain },
  } = editorRepo.getValue()

  let preventClose = false

  for (const e of chain) {
    const { docUid } = e as TabChainItem
    if (docUid) {
      const { value } = docEditorValueRepo.getValue(docUid)
      const { diffBlocks, diffContentHead } = isDraftValueChanged(docUid, value)
      if (diffBlocks.length > 0 || diffContentHead) {
        slateDocSave(docUid)
        preventClose = true
      }
    }
  }

  if (preventClose) {
    window.confirm(
      "Konote hasn't finished saving yet. " +
        'Try refreshing or quitting again later.',
    )
    e.preventDefault()
    e.returnValue =
      'Setting e.returnValue to string prevents exit for some browsers.'
    return 'Returning a string also prevents exit on other browsers.'
  }
}

/**
 * Listen to before unload event, used for prevent exit without save
 */
export function pageBeforeUnload(e: BeforeUnloadEvent) {
  preventExitWithoutSave(e)
}
