import Link from 'next/link'
import React, { ReactNode } from 'react'
// import { useMeQuery } from '../apollo/query.graphql'

const Navbar = ({
  rbtn,
  onClickMenu,
  pinedSider,
  backgroundColor,
}: {
  rbtn?: ReactNode
  onClickMenu: (boo: boolean) => void
  pinedSider: boolean
  backgroundColor?: string
}) => {
  // const { data: meData, error, loading } = useMeQuery()
  return (
    <nav
      className={`
        fixed 
        flex items-center justify-between 
        top-0 
        h-11 
        ${backgroundColor ? backgroundColor : 'bg-white dark:bg-gray-700'}  
        ${pinedSider ? 'left-72 right-0' : 'w-screen'}
      `}
    >
      {/* {!pinedSider && ( */}
      {/* <div> */}
      <div
        className={`flex items-center ml-2 ${pinedSider ? 'invisible' : ''}`}
      >
        <span
          className="material-icons p-1 rounded leading-none text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer"
          onClick={() => {
            onClickMenu(true)
          }}
        >
          menu
        </span>
        <Link href="/">
          <a className="ml-2 text-gray-800 dark:text-gray-200">Konote</a>
        </Link>
      </div>
      {/* </div> */}
      {/* )} */}
      {/* <div className="flex items-center justify-between w-full"> */}
      {/* {!pinedSider && ( */}

      {/* )} */}
      {/* {navPath} */}
      <div className="flex items-center mr-4 right-0">
        {rbtn}
        {/* {meData ? (
            <button className="btn-secondary">
              <a href="/login">Logout</a>
            </button>
          ) : (
            <button className="btn-primary">
              <a href="/login">Login</a>
            </button>
          )} */}
      </div>
      {/* </div> */}
    </nav>
  )
}

export default Navbar
