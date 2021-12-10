import React, { forwardRef, ReactPropTypes, useState } from 'react'
import Link from 'next/link'
import { SearchAllForm } from '../search-all-form'
import HomeIcon from '../../assets/svg/home.svg'
import CocardIcon from '../../assets/svg/app.svg'
import HeartIcon from '../../assets/svg/heart.svg'
import classes from './sidebar.module.scss'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useMeQuery } from '../../apollo/query.graphql'
import MenuIcon from '../../assets/svg/menu.svg'
import layoutClasses from '../layout/layout.module.scss'
import SidebarList from './sidebar-list'
import { workspace } from '../workspace/workspace'
import { useObservable } from 'rxjs-hooks'

const SideBar = ({
  showMenuHandler,
  pinMenuHandler,
  isPined,
  showMenu,
}: {
  showMenuHandler: (boo?: boolean) => void
  pinMenuHandler: (boo?: boolean) => void
  isPined: boolean
  showMenu: boolean
}): JSX.Element => {
  // const { user, error, isLoading } = useUser()
  // const { data, loading } = useMeQuery()
  const savedDocs = useObservable(() => workspace.savedDocs$)
  const committedDocs = useObservable(() => workspace.committedDocs$)

  return (
    <div
      className={`absolute w-72 h-screen pt-0 px-6 pb-4 border-r border-gray-200 flex flex-col flex-shrink-0 bg-white z-50 transition-all 
      ${showMenu ? 'transform-gpu translate-x-0 translate-y-0' : 'transform-gpu -translate-x-full translate-y-0 '} ${
        isPined ? 'relative bg-gray-100' : 'absolute bg-white'
      } ${isPined || !showMenu ? 'shadow-none' : 'shadow-l2xl'}
      `}
      onMouseLeave={() => {
        if (isPined) return
        showMenuHandler(false)
        pinMenuHandler(false)
      }}
    >
      <div className="group flex-shrink-0">
        <div className={`${classes.menuIconWrapper}`}>
          <a href="/">Conote</a>
          {/* <MenuIcon
            className={classes.menuIcon}
            onClick={() => {
              showMenuHandler(false)
              pinMenuHandler(false)
            }}
          /> */}
          <span
            className={`${
              isPined ? 'material-icons' : 'material-icons-outlined'
            } text-gray-600 opacity-0 hover:text-gray-500 cursor-pointer group-hover:opacity-100 transform rotate-45 select-none`}
            onClick={() => {
              pinMenuHandler()
            }}
          >
            push_pin
          </span>
        </div>
      </div>
      <div className="mt-2 mb-5">
        <SearchAllForm small />
      </div>
      <SidebarList title="最近同步的筆記" entries={committedDocs} />
      <SidebarList title="暫存區" entries={savedDocs} />

      {/* {data ? (
        <>
          {window.location.protocol.includes('extension') ? (
            <>
              Welcome {data.me.id}! <a href="http://localhost:3000/api/auth/logout">Logout</a>
            </>
          ) : (
            <>
              Welcome ! <a href="/api/auth/logout">Logout</a>
            </>
          )}
        </>
      ) : (
        <a href="/api/auth/login">Login</a>
      )} */}
    </div>
  )
}

export default SideBar
