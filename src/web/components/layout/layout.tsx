import React, { useCallback, useRef, useState } from 'react'
import SideBar from '../sidebar/sidebar'
import classes from './layout.module.scss'
import MenuIcon from '../../assets/svg/menu.svg'
import Link from 'next/link'
import { useMeQuery } from '../../apollo/query.graphql'

export default function Layout({
  children,
  // navPath,
  buttonRight,
}: // handlePath,
// handleSymbol,
{
  children: React.ReactNode
  // navPath?: React.ReactNode
  buttonRight?: React.ReactNode
  // handlePath?: (i: number) => void
  // handleSymbol?: (e: string) => void
}): JSX.Element {
  const { data: meData, error, loading } = useMeQuery()
  const [showNav, setShowNav] = useState(true)
  const [showMenu, setShowMenu] = useState(true)
  const [pinSideBar, setPinSideBar] = useState(true)
  const [scroll, setScroll] = useState(0)

  const layoutRef = useRef<HTMLDivElement>(null)

  const childrenWithCallback = useCallback(() => children, [children])

  const showMenuHandler = (boo?: boolean) => {
    if (boo === undefined) {
      setShowMenu(!showMenu)
    } else setShowMenu(boo)
  }
  const pinMenuHandler = (boo?: boolean) => {
    if (boo === undefined) {
      setPinSideBar(!pinSideBar)
    } else setPinSideBar(boo)
  }

  const handleScroll = (e: any) => {
    // console.log(e.target.scrollTop)
    // if (e.target) {
    //   //getBoundingClientRect().top 總是<=0
    //   const clientRectTop = e.target.scrollTop
    //   // console.log(clientRectTop, scroll, clientRectTop > scroll)
    //   if (scroll > clientRectTop && clientRectTop > 45) {
    //     setShowNav(true)
    //     setScroll(clientRectTop)
    //   }
    //   if (scroll < clientRectTop) {
    //     setShowNav(false)
    //     setScroll(clientRectTop)
    //   }
    //   if (clientRectTop === 0) {
    //     setShowNav(true)
    //     setScroll(clientRectTop)
    //   }
    // }
  }

  return (
    <div className={classes.layout} onScroll={handleScroll}>
      <SideBar
        showMenuHandler={showMenuHandler}
        pinMenuHandler={pinMenuHandler}
        style={{
          transform: showMenu ? 'translate3d(0,0,0)' : 'translate3d(-100%,0,0)',
          position: pinSideBar ? 'relative' : 'absolute',
          background: pinSideBar ? 'rgb(247 246 246)' : 'white',
          boxShadow: pinSideBar || !showMenu ? '0 0 50px transparent' : '0 0 50px #322f2f36',
        }}
        isPined={pinSideBar}
      />
      <div className={classes.children} ref={layoutRef} style={{ padding: pinSideBar ? '0 15% 0' : '0 20vw 0' }}>
        {children}
        {/* {childrenWithCallback()} */}
        {/* <footer>footer</footer> */}
      </div>
      <nav
        className={classes.navBar}
        style={showNav ? { transform: 'translateY(0)' } : { transform: 'translateY(-45px)' }}
      >
        <div
          className={classes.menuIconWrapper}
          onClick={() => {
            setShowMenu(prev => !prev)
          }}
        >
          <MenuIcon className={classes.menuIcon} />
        </div>
        <div className={classes.navLinks}>
          <Link href="/">
            <a>Conote</a>
          </Link>
          {/* {navPath} */}
          <div className={classes.left}>
            {buttonRight}
            {meData ? (
              <button className="secondary">
                <a href="/api/auth/logout">Logout</a>{' '}
              </button>
            ) : (
              <button className="primary">
                <a href="/login">Login</a>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* <div className={classes.sideBarContainer} style={showMenu ? { visibility: 'visible' } : { visibility: 'hidden' }}> */}
      {/* <div
        className={classes.mask}
        style={showMenu ? { opacity: 1, visibility: 'visible' } : { opacity: 0, visibility: 'hidden' }}
        onClick={() => {
          setShowMenu(false)
        }}
      ></div> */}

      {/* </div> */}
    </div>
  )
}
