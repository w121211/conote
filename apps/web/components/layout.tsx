import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  const [pinMenu, setPinMenu] = useState(true)
  // const [scroll, setScroll] = useState(0)
  const layoutRef = useRef<HTMLDivElement>(null)

  // const childrenWithCallback = useCallback(() => children, [children])
  useEffect(() => {
    if (window) {
      if (window.innerWidth < 768) {
        setShowMenu(false)
        setPinMenu(false)
      }
    }
  }, [])

  useEffect(() => {
    const storageMenu = localStorage.getItem('showMenu')
    const storagePin = localStorage.getItem('pinMenu')
    if (window.innerWidth < 769) {
      if (storageMenu !== null && storagePin !== null) {
        setShowMenu(false)
        setPinMenu(false)
      } else {
        localStorage.setItem('showMenu', 'false')
        localStorage.setItem('pinMenu', 'false')
      }
    } else {
      if (storageMenu !== null && storagePin !== null) {
        setShowMenu(storageMenu === 'true' ? true : false)
        setPinMenu(storagePin === 'true' ? true : false)
      } else {
        console.log('bigger', showMenu)
        localStorage.setItem('showMenu', 'true')
        localStorage.setItem('pinMenu', 'true')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('showMenu', `${showMenu}`)
  }, [showMenu])

  useEffect(() => {
    localStorage.setItem('pinMenu', `${pinMenu}`)
  }, [pinMenu])

  const triggerMenuHandler = (boo?: boolean) => {
    if (boo === undefined) {
      setShowMenu(!showMenu)
    } else {
      setShowMenu(boo)
    }
  }
  const pinMenuHandler = (boo?: boolean) => {
    if (boo === undefined) {
      setPinMenu(!pinMenu)
    } else {
      setPinMenu(boo)
    }
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
    <div className="flex w-screen h-screen   ">
      <SideBar
        showMenuHandler={triggerMenuHandler}
        pinMenuHandler={pinMenuHandler}
        showMenu={showMenu}
        isPined={pinMenu}
      />
      <div
        className={`flex-grow pt-11 pb-[20vh] pl-2  ${
          pinMenu ? 'xl:px-[10%] lg:px-[4%] ' : 'sm:px-[10%] md:px-[15%] lg:px-[20%]'
        }  overflow-y-scroll  scroll-smooth  scrollbar`}
      >
        {/* <div className="w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl scroll-smooth"> */}
        <div className="">
          {/* {children} */}
          <LoginModal>{children}</LoginModal>
        </div>
      </div>
      <Navbar rbtn={buttonRight} onClickMenu={triggerMenuHandler} />
    </div>
  )
}
