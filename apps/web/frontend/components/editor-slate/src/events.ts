import type { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import { differenceBlocks, parseGQLBlocks } from '../../../../share/utils'
import type { Block, Doc } from '../../editor-textarea/src/interfaces'
import { docUpdatePropsOp } from '../../editor-textarea/src/op/ops'
import { noteDraftService } from '../../editor-textarea/src/services/note-draft.service'
import { docRepo } from '../../editor-textarea/src/stores/doc.repository'
import {
  BlockInput,
  writeBlocks,
} from '../../editor-textarea/src/utils/block-writer'
import { blocksToIndenters, indentersToBlocks } from './indenter/serializers'
import type { ElementIndenter, ElementLi } from './interfaces'
// import { blocksToLiList, elementLisToBlocks } from './serializers'
import { docValueRepo } from './stores/doc-value.repository'

function toGQLBlocks(blocks: Block[]) {
  return blocks.map(e => {
    const { editTime, childrenUids, ...rest } = e
    return { ...rest }
  })
}

function toNoteDraftInput(doc: Doc, value: ElementIndenter[]): NoteDraftInput {
  const { blockUid: docBlockUid, noteCopy, noteDraftCopy, contentHead } = doc,
    docBlock = docRepo.getDocBlock(doc),
    // bodyBlocks = elementLisToBlocks(value, blockUid),
    bodyBlocks = indentersToBlocks(value, docBlockUid),
    bodyBlocks_: Block[] = bodyBlocks.map(e => ({ ...e, childrenUids: [] })),
    blocks = [docBlock, ...bodyBlocks_],
    blocks_ = toGQLBlocks(blocks)

  // Null is a valide input for differencer, but '[]' is not
  const startBlocks = noteCopy
      ? noteCopy.headDoc.contentBody.blocks.map(e => ({
          ...e,
          parentUid: e.parentUid ?? null,
          open: e.open ?? undefined,
          docSymbol: e.docSymbol ?? undefined,
        }))
      : null,
    blockDiff = differenceBlocks(blocks_, startBlocks),
    input: NoteDraftInput = {
      fromDocId: noteCopy?.headDoc.id,
      domain: noteDraftCopy.domain,
      contentHead,
      contentBody: {
        // discussIds: [],
        // symbols: [],
        blocks: blocks_,
        blockDiff: blockDiff,
      },
    }
  return input
}

function isValueChanged(docUid: string, value: ElementIndenter[]) {
  const doc = docRepo.getDoc(docUid),
    { noteDraftCopy } = doc

  const input = toNoteDraftInput(doc, value),
    { blocks: startBlocks } = parseGQLBlocks(noteDraftCopy.contentBody.blocks),
    { blocks: finalBlocks } = parseGQLBlocks(input.contentBody.blocks),
    changes = differenceBlocks(finalBlocks, startBlocks),
    changed = changes.length > 0

  return { changed, changes, doc, noteDraftCopy, input }
}

/**
 * @returns true if doc is saved, returns false if doc is not perform save (eg, content not change)
 *
 * @throws Value validation error, eg 'indent_oversize'
 */
export async function slateDocSave(
  docUid: string,
  // value: ElementLi[],
  newSymbol?: string,
  opts = {
    force: false,
  },
) {
  const { value } = docValueRepo.getDocValue(docUid)
  const { changed, input, noteDraftCopy } = isValueChanged(docUid, value)

  if (opts.force || changed) {
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

export function docTemplateGenerate(doc: Doc) {
  const docBlock = docRepo.getDocBlock(doc),
    blocks = writeBlocks(genTemplateGeneral(), { docBlock }),
    indenters = blocksToIndenters(blocks)

  return indenters
}
