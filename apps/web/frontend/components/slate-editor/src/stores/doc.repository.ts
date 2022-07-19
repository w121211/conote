import type { TreeNodeChange } from '@conote/docdiff'
import { createStore, Reducer } from '@ngneat/elf'
import { getEntity, selectEntity, withEntities } from '@ngneat/elf-entities'
import type { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import type { NoteFragment } from '../../../../../apollo/query.graphql'
import type { SymbolParsed } from '../../../../../lib/interfaces'
import { differenceBlocks, parseGQLBlocks } from '../../../../../share/utils'
import { Block } from '../../../block-editor/src/interfaces'
import { DocSlate } from '../interfaces'
import { elementLisToBlocks } from '../serializers'

type DocStoreState = {
  entities: Record<string, DocSlate>
  ids: string[]
}

type DocReducer = Reducer<DocStoreState>

const docsStore = createStore(
  { name: 'docsStore' },
  withEntities<DocSlate, 'uid'>({ idKey: 'uid' }),
)

class DocSlateRepository {
  getDoc(uid: string): DocSlate {
    const doc = docsStore.query(getEntity(uid))
    if (doc === undefined) {
      throw new Error('[getDoc] Doc not found:' + uid)
    }
    return doc
  }

  findDoc(searchBy: { symbol?: string; draftId?: string }): DocSlate | null {
    const entities = docsStore.getValue().entities

    if (searchBy.symbol) {
      const found = Object.entries(entities).find(
        ([, v]) => v.noteDraftCopy.symbol === searchBy.symbol,
      )
      return found ? found[1] : null
    } else if (searchBy.draftId) {
      const found = Object.entries(entities).find(
        ([, v]) => v.noteDraftCopy.id === searchBy.draftId,
      )
      return found ? found[1] : null
    }
    throw new Error('Need to provide a search param')
  }

  getDoc$(uid: string) {
    return docsStore.pipe(
      selectEntity(uid),
      // tap((v) => console.log(`block   ${v ? v.uid + '-' + v.str : v}`)),
    )
  }

  update(reducers: DocReducer[]) {
    docsStore.update(...reducers)
  }
}

export const docSlateRepo = new DocSlateRepository()

//
// Doc helpers
// Functions that uses the doc repo, so write in here to avoid circular import
//
//
//
//
//
//

function toGQLBlocks(blocks: Omit<Block, 'childrenUids'>[]) {
  return blocks.map(e => {
    const { editTime, ...rest } = e
    return { ...rest }
  })
}

export function docSlateToNoteDraftInput(doc: DocSlate): NoteDraftInput {
  const { blockUid, noteCopy, noteDraftCopy, contentHead, value } = doc,
    blocks = elementLisToBlocks(value, blockUid),
    blocks_ = toGQLBlocks(blocks),
    // Null is a valide input for differencer, but '[]' is not
    startBlocks = noteCopy
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

/**
 * Doc is first generated then save into draft, so `noteDraftCopy` is omitted
 * - If symbol is a link, start with blank lines
 *
 */
// export function genNewDoc(
//   symbol: string,
//   symbolType: SymbolParsed['type'],
//   domain: string,
//   note: NoteFragment | null,
// ): {
//   newDoc: Omit<Doc, 'noteDraftCopy'>
//   newBlocks: Block[]
//   draftInput: NoteDraftInput
// } {
//   if (docRepo.findDoc({ symbol }) !== null)
//     throw new Error('[genNewDoc] Doc is already existed')

//   let newDoc: Omit<Doc, 'noteDraftCopy'>
//   let newBlocks: Block[]

//   if (note) {
//     const { blocks: gqlBlocks } = note.headDoc.contentBody,
//       { blocks, docBlock } = parseGQLBlocks(gqlBlocks)
//     newBlocks = blocks
//     newDoc = {
//       uid: genDocUid(),
//       noteCopy: note,
//       contentHead: omitTypenameDeep(note.headDoc.contentHead),
//       contentBody: {
//         // discussIds: discussIds.map(omitTypename),
//         // symbols: symbols.map(omitTypename),
//         blockDiff: [],
//       },
//       blockUid: docBlock.uid,
//     }
//   } else {
//     const newDocBlock: Block = {
//       uid: genBlockUid(),
//       str: symbol,
//       docSymbol: symbol,
//       open: true,
//       order: 0,
//       parentUid: null,
//       childrenUids: [],
//     }
//     newBlocks =
//       symbolType === 'URL'
//         ? writeBlocks(blankLines, { docBlock: newDocBlock })
//         : [newDocBlock]
//     newDoc = {
//       uid: genDocUid(),
//       noteCopy: null,
//       contentHead: {},
//       contentBody: {
//         // discussIds: [],
//         // symbols: [],
//         blockDiff: [],
//       },
//       blockUid: newDocBlock.uid,
//     }
//   }

//   const input: NoteDraftInput = {
//     fromDocId: newDoc.noteCopy?.headDoc.id,
//     domain,
//     contentHead: newDoc.contentHead,
//     contentBody: {
//       ...newDoc.contentBody,
//       blocks: toGQLBlocks(newBlocks),
//     },
//   }
//   return { newDoc, newBlocks, draftInput: input }
// }

// /**
//  * Get the doc that includes the given block, recursive function
//  */
// export function getDocByBlock(blockUid: string): Doc {
//   const root = rootBlock(blockUid)
//   if (root.docSymbol === undefined)
//     throw new Error('[getDocByBlock] Root block should have a doc symbol')

//   const doc = docRepo.findDoc({ symbol: root.docSymbol })
//   if (doc === null)
//     throw new Error(
//       '[getDocByBlock] Doc is not found by the symbol of doc-block',
//     )
//   return doc
// }

// /**
//  *
//  */
// export function isDocChanged(docUid: string): {
//   changed: boolean
//   changes: TreeNodeChange[]
//   doc: Doc
//   input: NoteDraftInput
//   noteDraftCopy: Doc['noteDraftCopy']
// } {
//   const doc = docRepo.getDoc(docUid),
//     { noteDraftCopy } = doc

//   const input = docToNoteDraftInput(doc),
//     { blocks: startBlocks } = parseGQLBlocks(noteDraftCopy.contentBody.blocks),
//     { blocks: finalBlocks } = parseGQLBlocks(input.contentBody.blocks),
//     changes = differenceBlocks(finalBlocks, startBlocks),
//     changed = changes.length > 0

//   return { changed, changes, doc, noteDraftCopy, input }
// }
