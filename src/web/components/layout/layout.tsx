import React, { useRef, useState } from 'react'
import SideBar from '../sidebar/sidebar'
import classes from './layout.module.scss'
import MenuIcon from '../../assets/svg/menu.svg'

export default function Layout({
  children,
  navPath,
}: // handlePath,
// handleSymbol,
{
  children: React.ReactNode
  navPath: React.ReactNode
  // handlePath?: (i: number) => void
  // handleSymbol?: (e: string) => void
}): JSX.Element {
  const [showNav, setShowNav] = useState(true)

  const [showMenu, setShowMenu] = useState(false)

  const [scroll, setScroll] = useState(0)

  const layoutRef = useRef<HTMLDivElement>(null)

  const showMenuHandler = () => {
    setShowMenu(false)
  }

  const handleScroll = () => {
    if (layoutRef.current) {
      //getBoundingClientRect().top 總是<=0
      const clientRectTop = layoutRef.current.getBoundingClientRect().top
      // console.log(clientRectTop, scroll, clientRectTop > scroll)

      if (scroll < clientRectTop) {
        setShowNav(true)
        setScroll(clientRectTop)
      }
      if (scroll > clientRectTop) {
        setShowNav(false)
        setScroll(clientRectTop)
      }
      if (clientRectTop === 0) {
        setShowNav(true)
        setScroll(clientRectTop)
      }
    }
  }

  return (
    <div className={classes.layout} onScroll={handleScroll}>
      <div className={classes.children} ref={layoutRef}>
        {children}
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
        {navPath}
      </nav>

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
