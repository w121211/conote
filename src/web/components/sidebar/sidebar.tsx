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

const SideBar = ({ style, showMenuHandler }: { style: React.CSSProperties; showMenuHandler: () => void }) => {
  // const { user, error, isLoading } = useUser()
  const { data, loading } = useMeQuery()

  return (
    <div className={classes.sidebar} style={style}>
      <div
        className={`${classes.menuIconWrapper}`}
        onClick={() => {
          showMenuHandler()
        }}
      >
        <MenuIcon className={classes.menuIcon} />
      </div>

      <div className="searchBar">
        <SearchAllForm />
      </div>
      <ul className={classes.sideList}>
        {/* <li>
            <Link to="/">
              <HomeIcon />
              首頁
            </Link>
          </li> */}
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
        {/* <li>
          <a href="https://www.notion.so/Work-Log-491e5e9bdff942cf96ab0e9dfbf86c4e">測試說明: 3/4 上線測試A1</a>
        </li> */}
      </ul>
      {/* <span className="logo">
        <Link href="/">COCARD</Link>
      </span> */}
      {data ? (
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
      )}
      {/* <Search
          className="search"
          placeholder="Search..."
          enterButton
          size="middle"
          // suffix={suffix}
          // onSearch={onSearch}
        /> */}
    </div>
  )
}

export default SideBar
