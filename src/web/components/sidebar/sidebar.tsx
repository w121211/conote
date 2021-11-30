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
      <div className={classes.sidebarTop}>
        <div className={`${classes.menuIconWrapper}`}>
          <MenuIcon
            className={classes.menuIcon}
            onClick={() => {
              showMenuHandler(false)
              pinMenuHandler(false)
            }}
          />
          <span
            className={`${isPined ? 'material-icons' : 'material-icons-outlined'} ${classes.pushPin}`}
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
        <ul className={classes.sideList}>
          <li>
            {/* <HomeIcon /> */}
            <a href="/">
              <span>首頁</span>
            </a>
          </li>
          <li>
            <a href="#">
              {/* <CocardIcon /> */}
              <span>社群卡</span>
            </a>
          </li>
          <li>
            <a href="#">
              {/* <HeartIcon /> */}
              <span>收藏</span>
            </a>
          </li>
        </ul>
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
