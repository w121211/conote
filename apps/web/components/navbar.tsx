import Link from 'next/link'
import React, { ReactNode } from 'react'
import { useMeQuery } from '../apollo/query.graphql'

const Navbar = ({
  rbtn,
  onClickMenu,
  pinedSider,
}: {
  rbtn?: ReactNode
  onClickMenu: (boo: boolean) => void
  pinedSider: boolean
}) => {
  const { data: meData, error, loading } = useMeQuery()
  return (
    <nav
      className={`fixed top-0 flex items-center justify-between h-11 bg-white  ${
        pinedSider ? 'left-72 right-0' : 'w-screen'
      }`}
    >
      {/* {!pinedSider && ( */}
      {/* <div> */}
      <div className={`flex items-center ml-2 ${pinedSider ? 'invisible' : ''}`}>
        <span
          className="material-icons p-1 rounded leading-none hover:bg-gray-100 hover:cursor-pointer"
          onClick={() => {
            onClickMenu(true)
          }}
        >
          menu
        </span>
        <Link href="/">
          <a className="ml-2">Konote</a>
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
