import { setProp, setProps } from '@ngneat/elf'
import { useObservable } from '@ngneat/react-rxjs'
import React, { useEffect, useRef } from 'react'
import Sidebar from '../../sidebar/Sidebar'
import Navbar from '../../Navbar'
import { siderRepo } from '../../../stores/sider.repository'
import { throttle } from 'lodash'

const Layout = ({
  children,
  backgroundColor,
  sidebarPinned,
}: {
  children: React.ReactNode
  buttonRight?: React.ReactNode
  backgroundColor?: string
  navColor?: string
  sidebarPinned?: boolean
}): JSX.Element => {
  const [siderIsOpen] = useObservable(siderRepo.isOpen$)
  const [siderIsPinned] = useObservable(siderRepo.isPinned$)
  const childrenRef = useRef<HTMLDivElement>(null)
  const siderRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const toOpenSidebarTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  let isMouseOver = true

  function onMouseMove(e: React.MouseEvent) {
    if (e.clientX < 40 && !siderIsOpen) {
      clearTimeout(toOpenSidebarTimeoutRef?.current)
      toOpenSidebarTimeoutRef.current = setTimeout(() => {
        if (isMouseOver) {
          siderRepo.update(setProp('isOpen', true))
        }
      }, 300)
    } else if (
      e.clientX >= 40 &&
      !siderIsPinned &&
      siderIsOpen &&
      !siderRef.current?.contains(e.currentTarget)
    ) {
      clearTimeout(timeoutRef?.current)
      timeoutRef.current = setTimeout(() => {
        siderRepo.update(setProp('isOpen', false))
      }, 50)
    }
  }

  useEffect(() => {
    if (sidebarPinned === false) {
      siderRepo.update(setProps({ isPinned: false, isOpen: false }))
    }
    // Else: Do nothing, sidebar is pinned by default
  }, [])

  return (
    <div
      className="flex-1 w-screen relative min-h-0 grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] [grid-template-areas:'nav_nav''sider_children']"
      onMouseEnter={() => {
        isMouseOver = true
      }}
      onMouseLeave={() => {
        isMouseOver = false
      }}
    >
      <Sidebar
        ref={siderRef}
        backgroundColor={backgroundColor}
        onMouseEnter={() => {
          if (!siderIsPinned) clearTimeout(timeoutRef?.current)
        }}
      />
      <div
        id="layout-children-container"
        ref={childrenRef}
        className={`flex flex-1 [grid-area:children] justify-center overflow-auto ${
          backgroundColor ? backgroundColor : 'bg-gray-50 dark:bg-gray-700'
        }`}
        onMouseMove={throttle(onMouseMove, 100)}
      >
        <div className="w-[720px] lg:min-w-[900px] px-8 pt-8">{children}</div>
        {/* {children} */}
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
