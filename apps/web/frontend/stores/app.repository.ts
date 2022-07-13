import { createStore, select, setProp, withProps } from '@ngneat/elf'
import type { ReactNode } from 'react'

export interface AppProps {
  alertModal: {
    show: boolean
    children?: ReactNode
  }
  announceBar: {
    show: boolean
  }
}

const store = createStore(
  { name: 'AppStore' },
  withProps<AppProps>({
    alertModal: {
      show: false,
    },
    announceBar: {
      show: false,
    },
  }),
)

class AppRepository {
  // showModal$ = store.pipe(select(state => state.showModal))
  // searcher$ = store.pipe(select(state => state.searcher))
  // getValue() {
  //   return store.getValue()
  // }
  // setShowModal(value: SearcherProps['showModal']) {
  //   store.update(setProp('showModal', value))
  // }
  // setSearcher(value: SearcherProps['searcher']) {
  //   store.update(setProp('searcher', value))
  // }
}

export const appRepo = new AppRepository()
