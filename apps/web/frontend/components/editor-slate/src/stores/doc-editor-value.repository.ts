import { createStore } from '@ngneat/elf'
import {
  getEntity,
  selectEntity,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities'
import type { ElementIndenter } from '../interfaces'

type DocEditorValue = {
  docUid: string
  value: ElementIndenter[]
}

const editorValuesStore = createStore(
  { name: 'editorValuesStore' },
  withEntities<DocEditorValue, 'docUid'>({ idKey: 'docUid' }),
)

/**
 * TODO:
 * - [] Remove this and use doc repo only
 */
class DocEditorValueRepository {
  getValue$(docUid: string) {
    return editorValuesStore.pipe(selectEntity(docUid))
  }

  getValue(docUid: string): DocEditorValue {
    const v = editorValuesStore.query(getEntity(docUid))
    if (v === undefined) {
      throw new Error('[getDoc] Doc not found:' + docUid)
    }
    return v
  }

  updateValue(docUid: string, value: ElementIndenter[]) {
    editorValuesStore.update(updateEntities(docUid, { value }))
  }
}

export const docEditorValueRepo = new DocEditorValueRepository()
