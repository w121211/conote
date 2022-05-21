import { createStore, Reducer } from '@ngneat/elf'
import { getEntity, selectEntity, withEntities } from '@ngneat/elf-entities'
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
  withEntities<Doc, 'title'>({ idKey: 'title' }),
)

export function getDoc(title: string): Doc {
  const doc = docsStore.query(getEntity(title))
  if (doc === undefined) {
    console.error(title)
    throw new Error('[getDoc] doc not found:' + title)
  }
  return doc
}

class DocRepository {
  findDoc(title: string): Doc | undefined {
    return docsStore.query(getEntity(title))
  }

  /**
   * Get doc's root block and all kids
   */
  getContentBlocks(doc: Doc): Block[] {
    const docBlock = getBlock(doc.blockUid),
      kids = allDescendants(docBlock)
    return [docBlock, ...kids]
  }

  getDoc$(title: string) {
    return docsStore.pipe(
      selectEntity(title),
      // tap((v) => console.log(`block   ${v ? v.uid + '-' + v.str : v}`)),
    )
  }

  update(reducers: DocReducer[]) {
    docsStore.update(...reducers)
  }
}

export const docRepo = new DocRepository()
