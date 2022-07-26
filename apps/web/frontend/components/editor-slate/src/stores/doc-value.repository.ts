import { createStore, Reducer } from '@ngneat/elf'
import {
  getEntity,
  selectEntity,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities'
import type { ElementIndenter, ElementLi } from '../interfaces'

type DocValue = {
  uid: string
  value: ElementIndenter[]
}

const docsStore = createStore(
  { name: 'docsStore' },
  withEntities<DocValue, 'uid'>({ idKey: 'uid' }),
)

class DocValueRepository {
  getDocValue$(uid: string) {
    return docsStore.pipe(selectEntity(uid))
  }

  getDocValue(uid: string): DocValue {
    const doc = docsStore.query(getEntity(uid))
    if (doc === undefined) {
      throw new Error('[getDoc] Doc not found:' + uid)
    }
    return doc
  }

  setDocValue(uid: string, value: ElementIndenter[]) {
    docsStore.update(updateEntities(uid, { value }))
  }
}

export const docValueRepo = new DocValueRepository()