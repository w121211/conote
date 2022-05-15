import { useObservable } from '@ngneat/react-rxjs'
import React, { useEffect, useRef } from 'react'
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
    }),
    ref = useRef<HTMLDivElement>(null)

  function hideSidebarWhenResize() {
    if (window && window.innerWidth < 769) {
      pinMenuHandler(false)
      showMenuHandler(false)
    }
  }

  useEffect(() => {
    editorLeftSidebarMount()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', hideSidebarWhenResize)

    // TODO: Remove listener when component unmount
    window.addEventListener(
      'touchstart',
      e => {
        if (showSider && !ref.current?.contains(e.target as HTMLElement)) {
          showMenuHandler(false)
        }
      },
      false,
    )

    return () => {
      window.removeEventListener('resize', hideSidebarWhenResize)
    }
  }, [])

  if (sidebar === null) {
    return null
  }
  return (
    <>
      <div
        className={`absolute left-0 w-72 h-screen pt-0  border-gray-200 flex flex-col flex-shrink-0  transition-all shadow-l2xl
      ${
        showSider
          ? ' translate-x-0 translate-y-0 '
          : '-translate-x-full translate-y-0 '
      } ${isPined ? 'sm:relative bg-gray-100' : 'z-50 bg-white'} ${
          isPined || !showSider ? 'shadow-transparent' : ''
        }
      `}
        onMouseLeave={() => {
          if (isPined) {
            return
          } else {
            showMenuHandler(false)
            pinMenuHandler(false)
          }
        }}
        ref={ref}
      >
        <div className="group flex-shrink-0 px-4">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center gap-1">
              <a href="/" className="py-1  rounded mix-blend-multiply ">
                Konote
              </a>
              {/* <ChannelSelect /> */}
            </div>
            <span
              className={`hidden md:block ${
                isPined ? 'material-icons' : 'material-icons-outlined'
              } text-gray-500 opacity-0 rounded-full bg-transparent hover:text-gray-600 
            cursor-pointer group-hover:opacity-100 rotate-45 select-none`}
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
        </div>
        <div className="mt-2 mb-3 mx-4">{/* <SearchAllForm small /> */}</div>

        {/* <DocIndexSection title="Committed" indexArray={committedDocIndicies} /> */}

        <SidebarSection title="EDIT" items={sidebar.items} />
      </div>
    </>
  )
}

export default SidebarEl
