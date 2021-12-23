import React, { useCallback, useRef, useState } from 'react'
import SideBar from '../sidebar/sidebar'
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
    <div className="flex h-screen bg-gray-50" onScroll={handleScroll}>
      <SideBar
        showMenuHandler={showMenuHandler}
        pinMenuHandler={pinMenuHandler}
        showMenu={showMenu}
        isPined={pinSideBar}
      />
      <div className={`mt-11 flex-1 overflow-y-auto ${pinSideBar ? 'px-[15%]' : 'px-[20vw]'}`} ref={layoutRef}>
        {children}
        {/* {childrenWithCallback()} */}
        {/* <footer>footer</footer> */}
      </div>
      <nav
        className="fixed flex items-center justify-start w-screen h-11 bg-gray-50"
        // style={showNav ? { transform: 'translateY(0)' } : { transform: 'translateY(-45px)' }}
      >
        <div
          className="flex px-6"
          onClick={() => {
            setShowMenu(prev => !prev)
          }}
        >
          <MenuIcon className="w-5 h-5" />
        </div>
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <a>Conote</a>
          </Link>
          {/* {navPath} */}
          <div>
            {buttonRight}
            {meData ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                // className="btn-secondary"
              >
                <a href="/login">Logout</a>
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                // className="btn-primary"
              >
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
