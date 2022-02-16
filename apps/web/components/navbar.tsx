import Link from 'next/link'
import React, { ReactNode } from 'react'
import { useMeQuery } from '../apollo/query.graphql'

const Navbar = ({ rbtn, onClickMenu }: { rbtn: ReactNode; onClickMenu: (boo: boolean) => void }) => {
  const { data: meData, error, loading } = useMeQuery()
  return (
    <nav className="fixed top-0 flex items-center justify-start w-screen h-11 bg-white z-40">
      <span className="px-2">
        <span
          className="material-icons flex items-center p-1 rounded hover:bg-gray-200/70 hover:cursor-pointer"
          onClick={() => {
            onClickMenu(true)
          }}
        >
          menu
        </span>
      </span>
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <a>Konote</a>
        </Link>
        {/* {navPath} */}
        <div className="mr-4">
          {rbtn}
          {meData ? (
            <button className="btn-secondary">
              <a href="/login">Logout</a>
            </button>
          ) : (
            <button className="btn-primary">
              <a href="/login">Login</a>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
