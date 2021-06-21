import React, { useEffect, useRef, useState } from 'react'
import SideBar from '../sidebar/sidebar'
import classes from './layout.module.scss'
import MenuIcon from '../../assets/svg/menu.svg'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useMeQuery } from '../../apollo/query.graphql'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState(false)
  const showMenuHandler = () => {
    setShowMenu(false)
  }
  return (
    <div className={classes.layout}>
      {children}
      <div
        className={classes.menuIconWrapper}
        onClick={() => {
          setShowMenu(prev => !prev)
        }}
      >
        <MenuIcon className={classes.menuIcon} />
      </div>
      {/* <div className={classes.sideBarContainer} style={showMenu ? { visibility: 'visible' } : { visibility: 'hidden' }}> */}
      <div
        className={classes.mask}
        style={showMenu ? { opacity: 1, visibility: 'visible' } : { opacity: 0, visibility: 'hidden' }}
        onClick={() => {
          setShowMenu(false)
        }}
      ></div>
      <SideBar
        showMenuHandler={showMenuHandler}
        style={showMenu ? { transform: 'translate3d(0,0,0)' } : { transform: 'translate3d(-100%,0,0)' }}
      />
      {/* </div> */}
    </div>
  )
}
