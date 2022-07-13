import { setProps } from '@ngneat/elf'
import React, { ReactNode } from 'react'
import Link from 'next/link'
import { siderRepo } from '../stores/sider.repository'
import { CommitPanel } from './commit/commit-panel'
import AuthItem from './auth/auth-el'
import { useMeContext } from './auth/use-me-context'
import SearcherModal from './search-all-modal/searcher-modal'

const Navbar = ({ rbtn }: { rbtn?: ReactNode }) => {
  const { me } = useMeContext()

  // const onClickMenu = () => {
  //   siderStore.update(state => ({ ...state, open: !state.open }))
  // }

  return (
    <nav
      className={`
       sticky z-50
       [grid-area:nav]
        flex items-center justify-between 
        w-screen
        top-0 
        py-2 
        border-b border-gray-200
        bg-gray-50 dark:bg-gray-700}  
      `}
    >
      <div className={`flex items-center gap-2 ml-2 `}>
        <span
          className="material-icons p-1 rounded leading-none text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:cursor-pointer"
          onClick={() => {
            const { isPinned } = siderRepo.getValue()
            if (isPinned) {
              siderRepo.update(setProps({ isOpen: false, isPinned: false }))
            } else {
              siderRepo.update(setProps({ isOpen: true, isPinned: true }))
            }
          }}
        >
          menu
        </span>
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className=" text-gray-800 dark:text-gray-200">Konote</a>
          </Link>
          <SearcherModal searcher={{ searchRange: 'symbol' }} />
          {/* <SearchAllModal /> */}
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
            <span className="material-icons text-xl leading-none p-1 rounded hover:bg-gray-200 text-gray-500 dark:text-gray-300">
              settings
            </span>
          </a>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
