import React, { useCallback, useRef, useState } from 'react'
import SideBar from './sidebar/sidebar'
import LoginModal from './login-modal'
import Navbar from './navbar'

export default function Layout({
  children,
  buttonRight,
}: {
  children: React.ReactNode
  buttonRight?: React.ReactNode
}): JSX.Element {
  const [showMenu, setShowMenu] = useState(true)
  const [pinSideBar, setPinSideBar] = useState(true)
  // const [scroll, setScroll] = useState(0)

  const layoutRef = useRef<HTMLDivElement>(null)

  // const childrenWithCallback = useCallback(() => children, [children])

  const triggerMenuHandler = (boo?: boolean) => {
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
    <div className="flex h-screen ">
      <SideBar
        showMenuHandler={triggerMenuHandler}
        pinMenuHandler={pinMenuHandler}
        showMenu={showMenu}
        isPined={pinSideBar}
      />
      <div
        className={`flex-1 overflow-y-auto mt-11 pb-[20vh] scroll-smooth ${
          pinSideBar ? 'pl-[10%] pr-[10%] ' : 'pl-[20vw] pr-[15vw]'
        } `}
      >
        <LoginModal>{children}</LoginModal>
      </div>
      <Navbar rbtn={buttonRight} onClickMenu={triggerMenuHandler} />
    </div>
  )
}
