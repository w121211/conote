import React, { useCallback, useRef, useState } from 'react'
import SideBar from '../sidebar/sidebar'
import MenuIcon from '../../assets/svg/menu.svg'
import Link from 'next/link'
import { useMeQuery } from '../../apollo/query.graphql'
import Modal from '../modal/modal'

export default function Layout({
  children,
  buttonRight,
}: {
  children: React.ReactNode
  buttonRight?: React.ReactNode
}): JSX.Element {
  const { data: meData, error, loading } = useMeQuery()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showMenu, setShowMenu] = useState(true)
  const [pinSideBar, setPinSideBar] = useState(true)
  // const [scroll, setScroll] = useState(0)

  const layoutRef = useRef<HTMLDivElement>(null)

  // const childrenWithCallback = useCallback(() => children, [children])

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
    <div className="flex h-screen " onScroll={handleScroll}>
      <SideBar
        showMenuHandler={showMenuHandler}
        pinMenuHandler={pinMenuHandler}
        showMenu={showMenu}
        isPined={pinSideBar}
      />
      <div
        className={`mt-11 pb-20 flex-1 overflow-y-auto ${pinSideBar ? 'px-[15%]' : 'px-[20vw]'} `}
        ref={layoutRef}
        onClick={e => {
          if (!meData) {
            setShowLoginModal(true)
          }
        }}
      >
        <div className={!meData ? 'pointer-events-none' : 'pointer-events-auto'}>{children}</div>
      </div>
      <nav className="fixed flex items-center justify-start w-screen h-11 ">
        <span
          className="material-icons px-4 hover:text-gray-500 hover:cursor-pointer"
          onClick={() => {
            setShowMenu(prev => !prev)
          }}
        >
          menu
        </span>
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <a>Conote</a>
          </Link>
          {/* {navPath} */}
          <div className="mr-4">
            {buttonRight}
            {meData ? (
              <button className="btn-secondary">
                <a href="/login">Logout</a>
              </button>
            ) : (
              <button className="btn-primary">
                <a href="/login">Login</a>
              </button>
            )}
          </div>
        </div>
      </nav>
      <Modal
        visible={showLoginModal}
        buttons={
          <button className="btn-primary">
            <a href="/login">Login</a>
          </button>
        }
        onClose={() => setShowLoginModal(false)}
      >
        <div className="text-center">請先登入!</div>
      </Modal>
    </div>
  )
}
