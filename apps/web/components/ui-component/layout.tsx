import React, { useCallback, useEffect, useRef, useState } from 'react'
import SidebarEl from '../block-editor/src/components/sidebar/sidebar-el'
import LoginModal from '../login-modal'
import Navbar from '../navbar'

const Layout = ({
  children,
  buttonRight,
  backgroundColor,
  navColor,
}: {
  children: React.ReactNode
  buttonRight?: React.ReactNode
  backgroundColor?: string
  navColor?: string
}): JSX.Element => {
  const childrenRef = useRef<HTMLDivElement>(null)
  return (
    <div className="relative grid grid-cols-[auto_1fr] [grid-template-areas:'sider_children'] w-screen h-[calc(100vh_-_49px)] ">
      {/* // <div className="relative flex w-screen overscroll-contain"> */}
      <SidebarEl backgroundColor={backgroundColor} />
      <div
        className={`[grid-area:children] flex-grow pt-8 pb-[20vh]  
         scroll-smooth overflow-auto
         ${backgroundColor ? backgroundColor : 'bg-white dark:bg-gray-700'}`}
        ref={childrenRef}
      >
        <div className={`responsive-width mx-auto px-6 md:px-10`}>
          {children}
          {/* <LoginModal>{children}</LoginModal> */}
        </div>
      </div>
    </div>
  )
}

export default Layout
