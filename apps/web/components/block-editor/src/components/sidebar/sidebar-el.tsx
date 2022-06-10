import React, { useEffect, useRef } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { editorLeftSidebarRefresh } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import SidebarSection from './sidebar-section'

/**
 * Call 'editorLeftSidebarRefresh' event on component mount to query required data.
 *
 * TODOS:
 * [] draft-entries sort by ?
 */
const SidebarEl = ({
  showMenuHandler,
  pinMenuHandler,
  isPined,
  showSider,
  backgroundColor,
}: {
  showMenuHandler: (bool?: boolean) => void
  pinMenuHandler: (bool?: boolean) => void
  isPined: boolean
  showSider: boolean
  backgroundColor?: string
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
    editorLeftSidebarRefresh()
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
          [grid-area:sider]
          group
          absolute left-0 
          z-50
          flex flex-col flex-shrink-0  
          w-72 
          h-full
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
              ? `sm:relative  border-gray-200  dark:bg-gray-800 ${
                  backgroundColor ? backgroundColor : 'bg-gray-50'
                }`
              : ' my-2 h-[calc(100%_-_16px)] border-t rounded-r border-gray-100 bg-white '
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
