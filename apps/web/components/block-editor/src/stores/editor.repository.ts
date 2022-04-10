import { createStore, select, setProp, withProps } from '@ngneat/elf'
import { filter, switchMap, tap } from 'rxjs'
import { EditorProps } from '../interfaces'
import { docRepo } from './doc.repository'

export const editorStore = createStore(
  { name: 'editorStore' },
  withProps<EditorProps>({
    alert: {},
    leftSidebar: {
      show: true,
      entries: [],
    },
    modal: {},
    route: {
      symbolMain: null,
      symbolModal: null,
    },
  }),
)

class EditorRepository {
  alter$ = editorStore.pipe(select(state => state.alert))

  leftSidebar$ = editorStore.pipe(select(state => state.leftSidebar))

  mainDoc$ = editorStore.pipe(
    select(state => state.route.symbolMain),
    filter((e): e is string => e !== null),
    switchMap(symbol => docRepo.getDoc$(symbol)),
    // tap(console.debug),
  )

  modalDoc$ = editorStore.pipe(
    select(state => state.route.symbolModal),
    filter((e): e is string => e !== null),
    switchMap(symbol => docRepo.getDoc$(symbol)),
    // tap(console.debug),
  )

  getValue() {
    return editorStore.getValue()
  }

  updateRoute(route: EditorProps['route']) {
    editorStore.update(setProp('route', route))
  }
}

export const editorRepo = new EditorRepository()
