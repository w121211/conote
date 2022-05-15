import { createStore, select, setProp, withProps } from '@ngneat/elf'
import { filter, of, switchMap } from 'rxjs'
import { NoteDraftEntryFragment } from '../../../../apollo/query.graphql'
import { EditorProps } from '../interfaces'
import { docRepo } from './doc.repository'

export const editorStore = createStore(
  { name: 'editorStore' },
  withProps<EditorProps>({
    alert: {},
    leftSidebar: {
      show: true,
      items: [],
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
  )

  modalDoc$ = editorStore.pipe(
    select(state => state.route.symbolModal),
    // filter((e): e is string => e !== null),
    switchMap(symbol => (symbol ? docRepo.getDoc$(symbol) : of(null))),
  )

  route$ = editorStore.pipe(select(state => state.route))

  getValue() {
    return editorStore.getValue()
  }

  updateRoute(route: EditorProps['route']) {
    editorStore.update(setProp('route', route))
  }

  updateLeftSidebarItems(items: NoteDraftEntryFragment[]) {
    editorStore.update(
      setProp('leftSidebar', leftSidebar => ({
        ...leftSidebar,
        items,
      })),
    )
  }
}

export const editorRepo = new EditorRepository()
