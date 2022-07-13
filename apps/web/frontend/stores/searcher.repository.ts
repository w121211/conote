import { createStore, select, setProp, withProps } from '@ngneat/elf'

export interface SearcherProps {
  showModal: boolean
  searcher: {
    // Not support 'all' yet
    // TODO
    searchRange: 'all' | 'symbol'

    // If provide, the hit will be a button instead of a link
    onClickHit?: (hit: { str: string; id: string }) => void

    // If provide, the symbol-create will be a button instead of a link
    onClickSymbolCreate?: (symbol: string) => void
  }
}

const store = createStore(
  { name: 'SearcherStore' },
  withProps<SearcherProps>({
    showModal: false,
    searcher: { searchRange: 'symbol' },
  }),
)

class SearcherRepository {
  showModal$ = store.pipe(select(state => state.showModal))

  searcher$ = store.pipe(select(state => state.searcher))

  getValue() {
    return store.getValue()
  }

  setShowModal(value: SearcherProps['showModal']) {
    store.update(setProp('showModal', value))
  }

  setSearcher(value: SearcherProps['searcher']) {
    store.update(setProp('searcher', value))
  }
}

export const searcherRepo = new SearcherRepository()
