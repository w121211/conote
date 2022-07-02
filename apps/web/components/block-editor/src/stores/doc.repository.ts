import { TreeNodeChange } from '@conote/docdiff'
import { createStore, Reducer } from '@ngneat/elf'
import { getEntity, selectEntity, withEntities } from '@ngneat/elf-entities'
import type { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import {
  differenceBlocks,
  parseGQLBlocks,
} from '../../../../shared/block.common'
import type { Block, Doc } from '../interfaces'
import { allDescendants } from '../op/queries'
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

  findDoc(symbol: string): Doc | null {
    const found = Object.entries(docsStore.getValue().entities).find(
      ([, v]) => v.symbol === symbol,
    )
    if (found) {
      return found[1]
    }
    return null
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

export function docToNoteDraftInput(doc: Doc): NoteDraftInput {
  const { noteCopy, domain, contentHead } = doc,
    blocks = docRepo.getContentBlocks(doc),
    blocksWithoutChildrenUids = blocks.map(e => {
      const { childrenUids, editTime, ...rest } = e
      return { ...rest }
    }),
    startBlocks = noteCopy
      ? noteCopy.headDoc.contentBody.blocks.map(e => ({
          ...e,
          parentUid: e.parentUid ?? null,
          open: e.open ?? undefined,
          docSymbol: e.docSymbol ?? undefined,
        }))
      : [],
    blockDiff = differenceBlocks(blocksWithoutChildrenUids, startBlocks),
    input: NoteDraftInput = {
      fromDocId: noteCopy?.headDoc.id,
      domain,
      contentHead,
      contentBody: {
        discussIds: [],
        symbols: [],
        blocks: blocksWithoutChildrenUids,
        blockDiff: blockDiff,
      },
    }
  return input
}

/**
 * Recusively find the root of the given block (should be a doc-block) and returns its doc.
 */
export function getDocByBlock(blockUid: string): Doc {
  // console.log(blockUid)
  let cur = getBlock(blockUid)
  while (cur.parentUid !== null) {
    cur = getBlock(cur.parentUid)
  }
  if (cur.docSymbol === undefined)
    throw new Error('[getRootBlock] Root block should have a doc symbol')

  const doc = docRepo.findDoc(cur.docSymbol)
  if (doc === null)
    throw new Error(
      '[getRootBlock] Doc is not found by the symbol of doc-block',
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
  noteDraftCopy: NonNullable<Doc['noteDraftCopy']>
} {
  const doc = docRepo.getDoc(docUid),
    { noteDraftCopy } = doc

  if (noteDraftCopy === undefined) {
    console.debug(doc)
    throw new Error('[isDocSaved] doc.noteDraftCopy === undefined')
  }

  const input = docToNoteDraftInput(doc),
    { blocks: startBlocks } = parseGQLBlocks(noteDraftCopy.contentBody.blocks),
    { blocks: finalBlocks } = parseGQLBlocks(input.contentBody.blocks),
    changes = differenceBlocks(finalBlocks, startBlocks),
    changed = changes.length > 0

  return { changed, changes, doc, noteDraftCopy, input }
}
