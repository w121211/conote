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
    opening: {
      main: { symbol: null, docUid: null },
      modal: { symbol: null, docUid: null },
    },
  }),
)

class EditorRepository {
  alter$ = editorStore.pipe(select(state => state.alert))

  leftSidebar$ = editorStore.pipe(select(state => state.leftSidebar))

  mainDoc$ = editorStore.pipe(
    select(state => state.opening.main.docUid),
    filter((e): e is string => e !== null),
    switchMap(uid => docRepo.getDoc$(uid)),
  )

  modalDoc$ = editorStore.pipe(
    select(state => state.opening.modal.docUid),
    // filter((e): e is string => e !== null),
    // switchMap(symbol => (symbol ? docRepo.getDoc$(symbol) : of(null))),
    switchMap(uid => (uid ? docRepo.getDoc$(uid) : of(null))),
  )

  opening$ = editorStore.pipe(select(state => state.opening))

  getValue() {
    return editorStore.getValue()
  }

  updateOpening(opening: EditorProps['opening']) {
    editorStore.update(setProp('opening', opening))
  }

  setLeftSidebarItems(items: NoteDraftEntryFragment[]) {
    editorStore.update(
      setProp('leftSidebar', leftSidebar => ({
        ...leftSidebar,
        items,
      })),
    )
  }
}

export const editorRepo = new EditorRepository()
