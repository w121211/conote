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
  style,
  showMenuHandler,
  pinMenuHandler,
  isPined,
}: {
  style: React.CSSProperties
  showMenuHandler: (boo?: boolean) => void
  pinMenuHandler: (boo?: boolean) => void
  isPined: boolean
}): JSX.Element => {
  // const { user, error, isLoading } = useUser()
  // const { data, loading } = useMeQuery()
  const savedDocs = useObservable(() => workspace.savedDocs$)
  const committedDocs = useObservable(() => workspace.committedDocs$)

  return (
    <div
      className={classes.sidebar}
      style={style}
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
            } text-gray-600 opacity-0 hover:text-gray-500 cursor-pointer group-hover:opacity-100 transform rotate-45 `}
            onClick={() => {
              pinMenuHandler()
            }}
          >
            push_pin
          </span>
        </div>

        <div className={classes.searchBar}>
          <SearchAllForm small />
        </div>
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
