import { setProp } from '@ngneat/elf'
import { useObservable } from '@ngneat/react-rxjs'
import React, { useEffect, useRef, useState } from 'react'
import SidebarEl from '../../block-editor/src/components/sidebar/sidebar-el'
import Navbar from '../../navbar'
import { siderRepo } from '../../../stores/sider.repository'

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
  const [siderIsOpen] = useObservable(siderRepo.isOpen$),
    [siderIsPinned] = useObservable(siderRepo.isPinned$)

  const childrenRef = useRef<HTMLDivElement>(null),
    siderRef = useRef<HTMLDivElement>(null),
    timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  function onMouseMove(e: React.MouseEvent) {
    if (e.clientX < 45 && !siderIsOpen) {
      siderRepo.update(setProp('isOpen', true))
    } else if (
      e.clientX >= 45 &&
      !siderIsPinned &&
      siderIsOpen &&
      !siderRef.current?.contains(e.currentTarget)
    ) {
      clearTimeout(timeoutRef?.current)
      timeoutRef.current = setTimeout(() => {
        siderRepo.update(setProp('isOpen', false))
      }, 200)
    }
  }

  return (
    <div className="flex-1 relative min-h-0 grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] [grid-template-areas:'nav_nav''sider_children'] w-screen">
      <SidebarEl
        backgroundColor={backgroundColor}
        ref={siderRef}
        onMouseEnter={() => {
          if (!siderIsPinned) clearTimeout(timeoutRef?.current)
        }}
      />
      <div
        id="layout-children-container"
        className={`
          flex-1  
          [grid-area:children] 
          flex justify-center 
          overflow-auto 
         ${backgroundColor ? backgroundColor : 'bg-gray-50 dark:bg-gray-700'}`}
        onMouseMove={onMouseMove}
        ref={childrenRef}
      >
        {children}
      </div>
      <Navbar />
      {/* <button
        className="fixed z-50"
        onClick={() => {
          console.log(childrenRef.current?.scrollTop)
          childrenRef.current?.scrollTo({ top: 0 })
        }}
      >
        click
      </button> */}
    </div>
  )
}

export default Layout
