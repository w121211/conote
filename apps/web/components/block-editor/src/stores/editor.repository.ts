import { createStore, select, setProp, withProps } from '@ngneat/elf'
import { filter, of, switchMap, tap } from 'rxjs'
import type { NoteDraftEntryFragment } from '../../../../apollo/query.graphql'
import type { EditorProps } from '../interfaces'
import { docRepo } from './doc.repository'

export const editorStore = createStore(
  { name: 'editorStore' },
  withProps<EditorProps>({
    alert: {},
    leftSidebar: {
      show: true,
      droppedItems: [],
      editingItems: [],
    },
    modal: {},
    opening: {
      main: { symbol: null, docUid: null },
      modal: { symbol: null, docUid: null },
    },
    draftEntries: [],
    chains: [],
    chainTab: {
      isOpening: false,
      chain: [],
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

  chainTab$ = editorStore.pipe(select(state => state.chainTab))

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
        editingItems: items.filter(e => e.status === 'EDIT'),
        droppedItems: items.filter(e => e.status === 'DROP'),
      })),
    )
  }

  setDraftEntries(entries: EditorProps['draftEntries']) {
    editorStore.update(setProp('draftEntries', entries))
  }

  setChains(chains: EditorProps['chains']) {
    editorStore.update(setProp('chains', chains))
  }

  setChainTab(chain: EditorProps['chainTab']['chain']) {
    editorStore.update(
      setProp('chainTab', { chain, isOpening: chain.length > 0 }),
    )
  }
}

export const editorRepo = new EditorRepository()
