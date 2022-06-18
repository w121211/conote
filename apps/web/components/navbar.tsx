import React, { ReactNode } from 'react'
import Link from 'next/link'
import { CommitPanel } from './commit/commit-panel'
import SearchAllModal from './search-all-modal/search-all-modal'
import AuthItem from './auth/auth-el'
import { createStore, select, setProp, withProps } from '@ngneat/elf'
import { useMeContext } from './auth/use-me-context'

interface SiderUI {
  open: boolean
}

export const siderStore = createStore(
  { name: 'sider' },
  withProps<SiderUI>({ open: true }),
)

// export const persist = persistState(siderStore, {
//   key: 'sider',
//   storage: localStorageStrategy,
// })

const isOpen = siderStore.getValue()

const Navbar = ({
  rbtn,
}: // onClickMenu,
// backgroundColor,
{
  rbtn?: ReactNode
  // onClickMenu: (boo?: boolean ) => void
  // backgroundColor?: string
}) => {
  const { me, loading } = useMeContext()

  const onClickMenu = () => {
    siderStore.update(state => ({ ...state, open: !state.open }))
  }

  return (
    <nav
      className={`
       sticky z-50
       
        flex items-center justify-between 
        w-screen
        top-0 
        py-2 
        border-b border-gray-200
        bg-white dark:bg-gray-700}  
      `}
    >
      <div className={`flex items-center gap-2 ml-2 `}>
        <span
          className="material-icons p-1 rounded leading-none text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer"
          onClick={onClickMenu}
        >
          menu
        </span>
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className=" text-gray-800 dark:text-gray-200">Konote</a>
          </Link>
          <SearchAllModal />
        </div>
      </div>
      {/* {navPath} */}

      {/* --- right area --- */}
      <div className="flex items-center gap-2 mr-4 right-0">
        {rbtn}
        {me ? (
          <div className="flex items-center gap-4 text-sm">
            {/* <button className="btn-primary">Commit</button> */}
            <CommitPanel />
            <AuthItem />
          </div>
        ) : (
          <AuthItem />
        )}

        {/* <ThemeToggle /> */}

        <Link href="/setting">
          <a className="leading-none">
            <span className="material-icons text-xl leading-none p-1 rounded hover:bg-gray-100 text-gray-500 dark:text-gray-300">
              settings
            </span>
          </a>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
