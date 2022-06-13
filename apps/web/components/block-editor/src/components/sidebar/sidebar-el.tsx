import React, { useEffect, useRef, useState } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { editorLeftSidebarRefresh } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import SidebarSection from './sidebar-section'
import { siderStore } from '../../../../navbar'

/**
 * Call 'editorLeftSidebarRefresh' event on component mount to query required data.
 *
 * TODOS:
 * [] draft-entries sort by ?
 */
const SidebarEl = ({
  backgroundColor,
}: {
  backgroundColor?: string
}): JSX.Element | null => {
  const [sidebar] = useObservable(editorRepo.leftSidebar$, {
    initialValue: null,
  })
  const [isOpen, setIsOpen] = useState(true)
  const [isPined, setIsPined] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<any>(null)

  function hideSidebarWhenResize() {
    if (window && window.innerWidth < 769) {
      setIsPined(false)
      setIsOpen(false)
    }
  }

  function onTouchStart(e: TouchEvent) {
    if (isOpen && !ref.current?.contains(e.target as HTMLElement)) {
      setIsOpen(false)
    }
  }

  const pinMenuHandler = () => {
    setIsPined(prev => !prev)
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

  useEffect(() => {
    siderStore.subscribe(state => {
      setIsOpen(state.open)
      if (state.open === false) {
        setIsPined(false)
      }
    })
  }, [])

  useEffect(() => {
    siderStore.update(state => ({ ...state, open: isOpen }))
  }, [isOpen])

  if (sidebar === null) {
    return null
  }

  return (
    <div
      id="sider"
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
            isOpen
              ? ' translate-x-0 translate-y-0 '
              : '-translate-x-full translate-y-0 '
          } 
          ${
            isPined
              ? `sm:relative border-gray-200  dark:bg-gray-800 ${
                  backgroundColor ? backgroundColor : 'bg-gray-50'
                }`
              : ' my-2 h-[calc(100vh_-_81px)] border-t rounded-r border-gray-100 bg-white '
          } 
          ${isPined || !isOpen ? 'shadow-transparent' : 'shadow-2xl'}
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
            setIsOpen(false)
            setIsPined(false)
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
            setIsOpen(false)
          }}
        >
          close
        </span>
      </div>

      {/* <DocIndexSection title="Committed" indexArray={committedDocIndicies} /> */}

      <SidebarSection title="EDIT" items={sidebar.items} />
    </div>
  )
}

export default SidebarEl
