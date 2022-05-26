import React, { useEffect, useRef } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { editorLeftSidebarMount } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import SidebarSection from './sidebar-section'

/**
 * When the component mount, call sidebr-load event when first enter the component
 *
 * TODOS:
 * [] draft-entries sort by ?
 */
const SidebarEl = ({
  showMenuHandler,
  pinMenuHandler,
  isPined,
  showSider,
}: {
  showMenuHandler: (bool?: boolean) => void
  pinMenuHandler: (bool?: boolean) => void
  isPined: boolean
  showSider: boolean
}): JSX.Element | null => {
  const [sidebar] = useObservable(editorRepo.leftSidebar$, {
    initialValue: null,
  })
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<any>(null)

  function hideSidebarWhenResize() {
    if (window && window.innerWidth < 769) {
      pinMenuHandler(false)
      showMenuHandler(false)
    }
  }

  function onTouchStart(e: TouchEvent) {
    if (showSider && !ref.current?.contains(e.target as HTMLElement)) {
      showMenuHandler(false)
    }
  }

  useEffect(() => {
    editorLeftSidebarMount()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', hideSidebarWhenResize)
    window.addEventListener('touchstart', onTouchStart, false)

    return () => {
      window.removeEventListener('resize', hideSidebarWhenResize)
      window.removeEventListener('touchstart', onTouchStart)
    }
  }, [])

  if (sidebar === null) {
    return null
  }

  return (
    <>
      <div
        className={`
          group
          absolute left-0 
          flex flex-col flex-shrink-0  
          w-72 
          pt-8
          border-r 
          transition-all 
          ${
            showSider
              ? ' translate-x-0 translate-y-0 '
              : '-translate-x-full translate-y-0 '
          } 
          ${
            isPined
              ? 'top-11 h-[calc(100vh_-_44px)] sm:relative  border-gray-200  bg-gray-50 dark:bg-gray-800'
              : 'top-14 h-[calc(100vh_-_68px)]  border-t rounded-r border-gray-100 bg-white '
          } 
          ${isPined || !showSider ? 'shadow-transparent' : 'shadow-2xl'}
            `}
        onMouseEnter={() => {
          if (!isPined) {
            clearTimeout(timeoutRef.current)
          }
        }}
        onMouseLeave={() => {
          if (!isPined) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = setTimeout(() => {
              showMenuHandler(false)
              pinMenuHandler(false)
            }, 500)
          }
        }}
        ref={ref}
      >
        <div className="absolute justify-end flex-shrink-0 top-0 right-0 mr-2 mt-2">
          <span
            className={`
              hidden md:inline-block 
              ${isPined ? 'material-icons' : 'material-icons-outlined'} 
              bg-transparent 
              text-gray-400 dark:text-gray-500 
              cursor-pointer 
              hover:text-gray-600 dark:hover:text-gray-400
              opacity-0 group-hover:opacity-100 
              rotate-45 
              select-none`}
            onClick={() => {
              pinMenuHandler()
            }}
          >
            push_pin
          </span>
          <span
            className={`material-icons md:hidden text-gray-6  00 rounded-full bg-transparent
            cursor-pointer select-none`}
            onClick={() => {
              showMenuHandler(false)
            }}
          >
            close
          </span>
        </div>

        {/* <DocIndexSection title="Committed" indexArray={committedDocIndicies} /> */}

        <SidebarSection title="EDIT" items={sidebar.items} />
      </div>
    </>
  )
}

export default SidebarEl
