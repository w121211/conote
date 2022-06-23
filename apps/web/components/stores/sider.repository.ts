import { createStore, Reducer, select, withProps } from '@ngneat/elf'

interface SiderProps {
  isOpen: boolean
  isPinned: boolean
}

const store = createStore(
  { name: 'sidebarStore' },
  withProps<SiderProps>({ isOpen: true, isPinned: true }),
)

class SiderRepository {
  isOpen$ = store.pipe(select(state => state.isOpen))

  isPinned$ = store.pipe(select(state => state.isPinned))

  getValue() {
    return store.getValue()
  }

  // updateIsPinned(
  //   value:
  //     | SiderProps['isPinned']
  //     | ((current: SiderProps['isPinned']) => SiderProps['isPinned']),
  // ) {
  //   store.update(setProp('isPinned', value))
  // }

  update(reducer: Reducer<SiderProps>) {
    store.update(reducer)
  }
}

export const siderRepo = new SiderRepository()
