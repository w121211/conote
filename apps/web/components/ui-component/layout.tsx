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
    <div className="relative grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] [grid-template-areas:'nav_nav''sider_children'] w-screen h-screen ">
      {/* // <div className="relative flex w-screen overscroll-contain"> */}
      <SidebarEl backgroundColor={backgroundColor} />
      <div
        className={`
          flex-1  
          [grid-area:children] 
          flex justify-center 
          scroll-smooth overflow-auto 
         ${backgroundColor ? backgroundColor : 'bg-gray-50 dark:bg-gray-700'}`}
        ref={childrenRef}
      >
        <div className={`flex-1 responsive-width px-10 pt-8`}>
          {children}
          {/* <LoginModal>{children}</LoginModal> */}
        </div>
      </div>
      <Navbar />
    </div>
  )
}

export default Layout
