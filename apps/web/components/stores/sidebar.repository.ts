import { createStore, select, setProp, withProps } from '@ngneat/elf'

interface SidebarProps {
  isPinned: boolean
}

const sidebarStore = createStore(
  { name: 'sidebarStore' },
  withProps<SidebarProps>({ isPinned: false }),
)

class SidebarRepository {
  isPinned$ = sidebarStore.pipe(select(state => state.isPinned))

  getValue() {
    return sidebarStore.getValue()
  }

  updateIsPinned(isPinned: SidebarProps['isPinned']) {
    sidebarStore.update(setProp('isPinned', isPinned))
  }
}

export const sidebarRepo = new SidebarRepository()
