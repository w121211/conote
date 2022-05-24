import React, { useContext, useEffect, useRef, useState } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { editorLeftSidebarRefresh } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import SidebarSection from './sidebar-section'
import { ThemeContext } from '../../../../theme/theme-provider'
import { ThemeType } from '../../../../theme/theme-storage'
import { ThemeToggle } from '../../../../theme/theme-toggle'

/**
 * Call 'editorLeftSidebarMount' event on component mount to query required data.
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

  const { theme, setTheme, isSystem, setIsSystem } = useContext(ThemeContext)

  // const ref = useRef<HTMLDivElement>(null)

  // const [theme, setTheme] = useState<ThemeType>('light')
  const [themeBtn, setThemeBtn] = useState<ThemeType | 'system'>('light')

  useEffect(() => {
    editorLeftSidebarRefresh()
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

  // useEffect(() => {
  //   const localTheme = Theme.getInstance()
  //   if (themeBtn === 'light' || themeBtn === 'dark') {
  //     if (localTheme) {
  //       localTheme.setTheme(themeBtn)
  //     } else {
  //       const newLocalTheme = Theme.newInstance()
  //       newLocalTheme.setTheme(themeBtn)
  //     }
  //   } else {
  //     if (localTheme) {
  //       if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  //         setTheme('dark')
  //       } else {
  //         setTheme('light')
  //       }
  //       localTheme.clear()
  //     }
  //   }
  // }, [themeBtn])

  return (
    <>
      <div
        className={`absolute left-0 
          flex flex-col flex-shrink-0  
          w-72 h-screen 
          pt-0 
          border-gray-200 
          transition-all 
          shadow-l2xl
          ${
            showSider
              ? ' translate-x-0 translate-y-0 '
              : '-translate-x-full translate-y-0 '
          } 
          ${
            isPined
              ? 'sm:relative bg-gray-100 dark:bg-gray-800'
              : 'z-50 bg-white dark:bg-gray-700'
          } 
          ${isPined || !showSider ? 'shadow-transparent' : ''}
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
            <div className="flex items-center gap-1 ">
              <a href="/" className="py-1 rounded dark:text-gray-200  ">
                Konote
              </a>

              <ThemeToggle />

              {/* <ChannelSelect /> */}
            </div>
            <span
              className={`hidden md:block 
                ${isPined ? 'material-icons' : 'material-icons-outlined'} 
                rounded-full 
                bg-transparent 
                text-gray-500 dark:text-gray-500 
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
        </div>
        <div className="mt-2 mb-3 mx-4">{/* <SearchAllForm small /> */}</div>

        {/* <DocIndexSection title="Committed" indexArray={committedDocIndicies} /> */}

        <SidebarSection title="EDIT" items={sidebar.items} />
      </div>
    </>
  )
}

export default SidebarEl
