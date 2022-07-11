import { createStore, select, setProp, withProps } from '@ngneat/elf'
import { differenceBy, flatten, isNil } from 'lodash'
import { filter, of, switchMap } from 'rxjs'
import type { NoteDraftEntryFragment } from '../../../../../apollo/query.graphql'
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
    tab: {
      chain: [],
      openDraftId: null,
      //
      loading: false,
    },
  }),
)

//
// Utils
//
//
//
//
//
//

export function buildChains<T extends { id: string }>(
  entries: T[],
  getPrevId: (v: T) => string | undefined | null,
): {
  chains: T[][]
  orphans: T[]
} {
  const dict: Record<string, T | null> = Object.fromEntries(
      entries.map(e => [e.id, e]),
    ),
    nextId: Record<string, string | null> = Object.fromEntries(
      entries.map(e => [e.id, null]),
    ),
    seeds: T[] = []

  // Find all parents that have multiple children

  entries.forEach(e => {
    const prevId = getPrevId(e)
    if (prevId) {
      // nextId[e.id] = e.meta.chain.prevId
      nextId[prevId] = e.id
    } else {
      seeds.push(e)
    }
  })

  const chains = seeds.map(e => {
    const chain = [e]

    let nextId_ = nextId[e.id],
      i = 0
    while (nextId_) {
      const entry = dict[nextId_]
      if (isNil(entry)) throw new Error('isNil(entry)')
      chain.push(entry)

      nextId_ = nextId[nextId_]
      i++
      if (i > 1000) throw new Error('Infinite loop')
    }
    return chain
  })

  const chainsEntries = flatten(chains)
  const orphans = differenceBy(entries, chainsEntries, 'id')

  return { chains, orphans }
}

//
// Repository
//
//
//
//
//
//

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

  chains$ = editorStore.pipe(select(state => state.chains))

  tab$ = editorStore.pipe(select(state => state.tab))

  getValue() {
    return editorStore.getValue()
  }

  getChainEntries(
    chains: NoteDraftEntryFragment[][],
    draftId: string,
  ): NoteDraftEntryFragment[] {
    const chain = chains.find(a => a.find(b => b.id === draftId) !== undefined)
    if (chain === undefined) {
      console.debug(draftId, chains)
      throw new Error('draftId not found in chains')
    }
    return chain
  }

  updateOpening(opening: EditorProps['opening']) {
    editorStore.update(setProp('opening', opening))
  }

  // updateTab_chain(chains: EditorProps['chains']) {
  //   const { tab } = this.getValue(),
  //     { openingDraftId } = tab
  //   if (openingDraftId) {
  //     try {
  //       const entries = this.getChainEntries(openingDraftId)
  //     } catch (err) {
  //       //
  //     }
  //   }
  // }

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

  setTab(tab: EditorProps['tab']) {
    editorStore.update(setProp('tab', tab))
  }
}

export const editorRepo = new EditorRepository()
