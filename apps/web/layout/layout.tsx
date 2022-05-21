import React, { useCallback, useEffect, useRef, useState } from 'react'
import SidebarEl from '../components/block-editor/src/components/sidebar/sidebar-el'
import LoginModal from '../components/login-modal'
import Navbar from '../components/navbar'

const Layout = ({
  children,
  buttonRight,
  backgroundColor,
}: {
  children: React.ReactNode
  buttonRight?: React.ReactNode
  backgroundColor?: string
}): JSX.Element => {
  const [showSider, setShowSider] = useState(true)
  const [pinSider, setPinMenu] = useState(true)
  // const [scroll, setScroll] = useState(0)
  const layoutRef = useRef<HTMLDivElement>(null)

  function handleLocalSiderState() {
    const storageMenu = localStorage.getItem('showSider')
    const storagePin = localStorage.getItem('pinSider')
    if (window.innerWidth < 769) {
      if (storageMenu !== null && storagePin !== null) {
        setShowSider(false)
        setPinMenu(false)
      } else {
        localStorage.setItem('showSider', 'false')
        localStorage.setItem('pinSider', 'false')
      }
    } else {
      if (storageMenu !== null && storagePin !== null) {
        setShowSider(storageMenu === 'true' ? true : false)
        setPinMenu(storagePin === 'true' ? true : false)
      } else {
        // console.log('bigger', showSider)
        localStorage.setItem('showSider', 'true')
        localStorage.setItem('pinSider', 'true')
      }
    }
  }

  useEffect(() => {
    if (window) {
      if (window.innerWidth < 768) {
        setShowSider(false)
        setPinMenu(false)
      }
    }
  }, [])

  useEffect(() => {
    handleLocalSiderState()
  }, [])

  useEffect(() => {
    localStorage.setItem('showSider', `${showSider}`)
  }, [showSider])

  useEffect(() => {
    localStorage.setItem('pinSider', `${pinSider}`)
  }, [pinSider])

  const triggerMenuHandler = (boo?: boolean) => {
    if (boo === undefined) {
      setShowSider(!showSider)
    } else {
      setShowSider(boo)
    }
  }
  const pinMenuHandler = (boo?: boolean) => {
    if (boo === undefined) {
      setPinMenu(!pinSider)
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

  // ${
  //   pinSider
  //     ? 'xl:px-[10%] lg:px-[4%]'
  //     : 'md:w-[720px] md:px-2 lg:w-[900px] lg:px-24'
  // }

  return (
    <div className="flex w-screen h-screen  ">
      <SidebarEl
        showMenuHandler={triggerMenuHandler}
        pinMenuHandler={pinMenuHandler}
        showSider={showSider}
        isPined={pinSider}
      />
      <div
        className={`flex-grow  mt-11 pb-[20vh]  
        overflow-auto scroll-smooth scrollbar
        bg-white dark:bg-gray-700`}
      >
        {/* <div className="w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl scroll-smooth"> */}
        <div
          className=" mx-auto px-2 w-[425px] md:max-w-[720px] md:w-full lg:max-w-[900px] lg:px-24
                        "
        >
          {children}
          {/* <LoginModal>{children}</LoginModal> */}
        </div>
      </div>
      <Navbar
        pinedSider={pinSider}
        rbtn={buttonRight}
        backgroundColor={backgroundColor}
        onClickMenu={triggerMenuHandler}
      />
    </div>
  )
}

export default Layout
