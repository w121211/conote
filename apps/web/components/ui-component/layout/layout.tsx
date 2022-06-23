import React, { useCallback, useEffect, useRef, useState } from 'react'
import SidebarEl from '../../block-editor/src/components/sidebar/sidebar-el'
import LoginModal from '../../login-modal'
import Navbar, { siderStore } from '../../navbar'

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
  const [isOpen, setIsOpen] = useState(true)
  const [isPined, setIsPined] = useState(true)
  const childrenRef = useRef<HTMLDivElement>(null)
  const siderRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<any>(null)
  const onMouseMove = (e: React.MouseEvent) => {
    if (e.clientX < 45 && !siderStore.getValue().open) {
      siderStore.update(state => ({ ...state, open: true }))
    } else if (
      e.clientX >= 45 &&
      !isPined &&
      siderStore.getValue().open &&
      !siderRef.current?.contains(e.currentTarget)
    ) {
      clearTimeout(timeoutRef?.current)
      timeoutRef.current = setTimeout(() => {
        siderStore.update(state => ({ ...state, open: false }))
        setIsOpen(false)
        setIsPined(false)
      }, 200)
    }
  }

  useEffect(() => {
    siderStore.subscribe(state => {
      setIsOpen(state.open)
      if (!state.open) {
        setIsPined(false)
      }
    })
  }, [])

  useEffect(() => {
    siderStore.update(state => ({ ...state, open: isOpen }))
  }, [isOpen])

  return (
    <div className="flex-1 relative min-h-0 grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] [grid-template-areas:'nav_nav''sider_children'] w-screen">
      <SidebarEl
        backgroundColor={backgroundColor}
        ref={siderRef}
        isOpen={isOpen}
        isPined={isPined}
        setIsOpen={setIsOpen}
        setIsPined={setIsPined}
        timeoutRef={timeoutRef}
      />
      <div
        className={`
          flex-1  
          [grid-area:children] 
          flex justify-center 
          scroll-smooth overflow-auto 
         ${backgroundColor ? backgroundColor : 'bg-gray-50 dark:bg-gray-700'}`}
        onMouseMove={onMouseMove}
        ref={childrenRef}
      >
        {children}
        {/* <LoginModal>{children}</LoginModal> */}
      </div>
      <Navbar />
    </div>
  )
}

export default Layout
