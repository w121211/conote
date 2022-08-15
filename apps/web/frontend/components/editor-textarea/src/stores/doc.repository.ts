import type { TreeNodeChange } from '@conote/docdiff'
import { createStore, Reducer } from '@ngneat/elf'
import { getEntity, selectEntity, withEntities } from '@ngneat/elf-entities'
import type { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import type {
  LinkFragment,
  NoteFragment,
} from '../../../../../apollo/query.graphql'
import type {
  NoteDocContentHead,
  SymbolParsed,
} from '../../../../../lib/interfaces'
import {
  differenceBlocks,
  omitTypenameDeep,
  parseGQLBlocks,
} from '../../../../../share/utils'
import type { Block, Doc } from '../interfaces'
import { allDescendants, rootBlock } from '../op/queries'
import { genBlockUid, genDocUid } from '../utils'
import { blankLines, writeBlocks } from '../utils/block-writer'
import { getBlock } from './block.repository'

type DocStoreState = {
  entities: Record<string, Doc>
  ids: string[]
}

export type DocReducer = Reducer<DocStoreState>

export const docsStore = createStore(
  { name: 'docsStore' },
  withEntities<Doc, 'uid'>({ idKey: 'uid' }),
)

class DocRepository {
  getDoc(uid: string): Doc {
    const doc = docsStore.query(getEntity(uid))
    if (doc === undefined) {
      throw new Error('[getDoc] Doc not found:' + uid)
    }
    return doc
  }

  findDoc(searchBy: { symbol?: string; draftId?: string }): Doc | null {
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

  getDocBlock(doc: Doc): Block {
    return getBlock(doc.blockUid)
  }

  /**
   * Get doc's root block and all kids
   */
  getContentBlocks(doc: Doc): Block[] {
    const docBlock = this.getDocBlock(doc),
      kids = allDescendants(docBlock)
    return [docBlock, ...kids]
  }

  // getDoc(title: string): Doc | undefined {
  //   return docsStore.query(getEntity(title))
  // }

  // getDoc$(symbol: string) {
  //   return docsStore.pipe(
  //     tap(v => console.log(v.entities)),
  //     selectManyByPredicate(e => e.symbol === symbol),
  //     map(e => {
  //       console.log('rxjs map', e)

  //       if (e.length === 0) return undefined
  //       if (e.length > 1)
  //         throw new Error(
  //           '[getDoc$] Found more than one docs of the same symbol',
  //         )
  //       return e[0]
  //     }),
  //     // selectEntity(title),
  //     // tap((v) => console.log(`block   ${v ? v.uid + '-' + v.str : v}`)),
  //   )
  // }

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

export const docRepo = new DocRepository()

//
// Doc helpers
// Functions that uses the doc repo, so write in here to avoid circular import
//
//
//
//
//
//

function toGQLBlocks(blocks: Block[]) {
  return blocks.map(e => {
    const { childrenUids, editTime, ...rest } = e
    return { ...rest }
  })
}

export function docToNoteDraftInput(doc: Doc): NoteDraftInput {
  const { noteCopy, noteDraftCopy, contentHead } = doc,
    blocks = docRepo.getContentBlocks(doc),
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
export function genNewDoc(
  symbol: string,
  symbolType: SymbolParsed['type'],
  domain: string,
  note: NoteFragment | null,
  link?: LinkFragment,
): {
  newDoc: Omit<Doc, 'noteDraftCopy'>
  newBlocks: Block[]
  draftInput: NoteDraftInput
} {
  if (docRepo.findDoc({ symbol }) !== null)
    throw new Error('Doc already existed')
  if (symbolType === 'URL' && link === undefined)
    throw new Error('Link is required for url-symbol')

  let newDoc: Omit<Doc, 'noteDraftCopy'>
  let newBlocks: Block[]

  if (note) {
    const { blocks: gqlBlocks } = note.headDoc.contentBody,
      { blocks, docBlock } = parseGQLBlocks(gqlBlocks)
    newBlocks = blocks
    newDoc = {
      uid: genDocUid(),
      noteCopy: note,
      contentHead: omitTypenameDeep(note.headDoc.contentHead),
      contentBody: {
        // discussIds: discussIds.map(omitTypename),
        // symbols: symbols.map(omitTypename),
        blockDiff: [],
      },
      blockUid: docBlock.uid,
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
    }
    newBlocks = link
      ? writeBlocks(blankLines, { docBlock: newDocBlock })
      : [newDocBlock]

    const contentHead: NoteDocContentHead = link
      ? {
          keywords: link.scraped.keywords ?? undefined,
          webpage: {
            // authors?: string[]
            title: link.scraped.title ?? undefined,
            // publishedAt: link.scraped.date,
            tickers: link.scraped.tickers ?? undefined,
          },
        }
      : {}
    newDoc = {
      uid: genDocUid(),
      noteCopy: null,
      contentHead,
      contentBody: {
        // discussIds: [],
        // symbols: [],
        blockDiff: [],
      },
      blockUid: newDocBlock.uid,
    }
  }

  const input: NoteDraftInput = {
    fromDocId: newDoc.noteCopy?.headDoc.id,
    domain,
    contentHead: newDoc.contentHead,
    contentBody: {
      ...newDoc.contentBody,
      blocks: toGQLBlocks(newBlocks),
    },
  }
  return { newDoc, newBlocks, draftInput: input }
}

/**
 * Get the doc that includes the given block, recursive function
 */
export function getDocByBlock(blockUid: string): Doc {
  const root = rootBlock(blockUid)
  if (root.docSymbol === undefined)
    throw new Error('[getDocByBlock] Root block should have a doc symbol')

  const doc = docRepo.findDoc({ symbol: root.docSymbol })
  if (doc === null)
    throw new Error(
      '[getDocByBlock] Doc is not found by the symbol of doc-block',
    )
  return doc
}

/**
 *
 */
export function isDocChanged(docUid: string): {
  changed: boolean
  changes: TreeNodeChange[]
  doc: Doc
  input: NoteDraftInput
  noteDraftCopy: Doc['noteDraftCopy']
} {
  const doc = docRepo.getDoc(docUid),
    { noteDraftCopy } = doc

  const input = docToNoteDraftInput(doc),
    { blocks: startBlocks } = parseGQLBlocks(noteDraftCopy.contentBody.blocks),
    { blocks: finalBlocks } = parseGQLBlocks(input.contentBody.blocks),
    changes = differenceBlocks(finalBlocks, startBlocks),
    changed = changes.length > 0

  return { changed, changes, doc, noteDraftCopy, input }
}
