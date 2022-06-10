import { createStore, Reducer } from '@ngneat/elf'
import {
  getEntity,
  selectEntity,
  selectEntityByPredicate,
  selectManyByPredicate,
  withEntities,
} from '@ngneat/elf-entities'
import { map, tap } from 'rxjs'
import { Block, Doc } from '../interfaces'
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
