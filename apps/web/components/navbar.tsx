import Link from 'next/link'
import React, { ReactNode } from 'react'
import { useMeQuery } from '../apollo/query.graphql'
import AuthItem from './auth/auth-Item'
import { useMe } from './auth/use-me'
import { SearchAll } from './search-all-modal/search-all-modal'
import { ThemeToggle } from './theme/theme-toggle'
// import { useMeQuery } from '../apollo/query.graphql'

const Navbar = ({
  rbtn,
  onClickMenu,

  backgroundColor,
}: {
  rbtn?: ReactNode
  onClickMenu: (boo?: boolean) => void

  backgroundColor?: string
}) => {
  // const { me, loading } = useMe()
  const { data: me } = useMeQuery()
  return (
    <nav
      className={`
        [grid-area:nav]
        flex items-center justify-between 
        w-screen
        top-0 
        py-2 
        border-b border-gray-200
        ${backgroundColor ? backgroundColor : 'bg-white dark:bg-gray-700'}  
        
      `}
    >
      <div className={`flex items-center gap-2 ml-2 `}>
        <span
          className="material-icons p-1 rounded leading-none text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer"
          onClick={() => {
            onClickMenu()
          }}
        >
          menu
        </span>
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className=" text-gray-800 dark:text-gray-200">Konote</a>
          </Link>
          <SearchAll />
        </div>
      </div>
      {/* {navPath} */}

      {/* --- right area --- */}
      <div className="flex items-center gap-2 mr-4 right-0">
        {rbtn}
        {me ? (
          <div className="flex items-center gap-4 text-sm">
            <button className="btn-primary">Commit</button>
            <AuthItem me={me} />
          </div>
        ) : (
          <AuthItem me={me} />
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
