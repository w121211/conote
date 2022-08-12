import type { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import { isEqual } from 'lodash'
import { NoteDocFragment } from '../../../../apollo/query.graphql'
import type { NoteDocContentHead } from '../../../../lib/interfaces'
import {
  differenceBlocks,
  differenceContentHead,
  parseGQLBlocks,
} from '../../../../share/utils'
import type { Block, Doc } from '../../editor-textarea/src/interfaces'
import { docUpdatePropsOp } from '../../editor-textarea/src/op/ops'
import { noteDraftService } from '../../editor-textarea/src/services/note-draft.service'
import { docRepo } from '../../editor-textarea/src/stores/doc.repository'
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
  const { blockUid: docBlockUid, noteCopy, noteDraftCopy, contentHead } = doc,
    bodyBlocks = indentersToBlocks(value, docBlockUid),
    bodyBlocks_: Block[] = bodyBlocks.map(e => ({ ...e, childrenUids: [] })),
    docBlock = docRepo.getDocBlock(doc),
    finalBlocks = [docBlock, ...bodyBlocks_],
    finalBlocks_ = toGQLBlocks(finalBlocks)

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
  const doc = docRepo.getDoc(docUid),
    { noteDraftCopy: start } = doc

  const input = toNoteDraftInput(doc, value),
    { blocks: startBlocks } = parseGQLBlocks(start.contentBody.blocks),
    { blocks: finalBlocks } = parseGQLBlocks(input.contentBody.blocks)

  const diffBlocks = differenceBlocks(finalBlocks, startBlocks),
    diffContentHead = differenceContentHead(doc.contentHead, start.contentHead)

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
 * @throws Value validation error, eg 'indent_oversize'
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
    isDraftValueChanged(docUid, value)

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

export function docTemplateGenerate(docUid: string, title: string) {
  const doc = docRepo.getDoc(docUid),
    docBlock = docRepo.getDocBlock(doc),
    blocks = genTemplateBlocks(title.toLowerCase(), docBlock),
    indenters = blocksToIndenters(blocks)

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

export function editorAlertRefresh() {
  //
}
