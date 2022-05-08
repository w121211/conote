import React, {
  forwardRef,
  ReactPropTypes,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import { SearchAllForm } from '../search-all-form'
import DocIndexSection from './doc-index-section'
import { workspace } from '../workspace/workspace'
import { useObservable } from 'rxjs-hooks'
import { TreeNode, TreeService } from '@conote/docdiff'
import { DocIndex } from '../workspace/doc-index'
import { Doc } from '../workspace/doc'
import { useApolloClient } from '@apollo/client'
// import { useMeQuery } from '../../apollo/query.graphql'
import { useRouter } from 'next/router'
import AuthItem from './_auth-Item'
import Select from 'react-select'
// import ChannelSelect from '../channel/channel-select'
import Theme, { ThemeType } from './theme-storage'
import ToggleMenu from '../../layout/toggle-menu'
import { ThemeContext } from '../theme/theme-provider'

const SideBar = ({
  showMenuHandler,
  pinMenuHandler,
  isPined,
  showSider,
}: {
  showMenuHandler: (boo?: boolean) => void
  pinMenuHandler: (boo?: boolean) => void
  isPined: boolean
  showSider: boolean
}): JSX.Element | null => {
  const { theme, setTheme, isSystem, setIsSystem } = useContext(ThemeContext)
  const editingdDocIndicies = useObservable(() => workspace.editingDocIndicies$)
  const ref = useRef<HTMLDivElement>(null)
  // const [theme, setTheme] = useState<ThemeType>('light')
  const [themeBtn, setThemeBtn] = useState<ThemeType | 'system'>('light')
  // const committedDocIndicies = useObservable(() => workspace.committedDocIndicies$)
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window && window.innerWidth < 769) {
        pinMenuHandler(false)
        showMenuHandler(false)
      }
    })
    window.addEventListener(
      'touchstart',
      e => {
        if (showSider && !ref.current?.contains(e.target as HTMLElement)) {
          showMenuHandler(false)
        }
      },
      false,
    )
  }, [])

  // useEffect(() => {

  // }, [])

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

  if (editingdDocIndicies === null) {
    return null
  }
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
              <ToggleMenu
                summary={
                  theme.theme === 'light' ? (
                    <span
                      className={`material-icons-outlined text-xl leading-none ${
                        isSystem ? 'text-gray-400 ' : 'text-blue-400'
                      } `}
                    >
                      light_mode
                    </span>
                  ) : (
                    <span
                      className={`material-icons-outlined text-xl leading-none ${
                        isSystem ? 'dark:text-gray-500' : ' dark:text-blue-300'
                      }`}
                    >
                      dark_mode
                    </span>
                  )
                }
              >
                <ul className="text-sm">
                  <li
                    className={`flex items-center gap-2 px-2 py-1 rounded-t hover:bg-gray-100 dark:hover:bg-gray-600/50 ${
                      theme.theme === 'light' && !isSystem
                        ? 'text-blue-500 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                    onClick={() => {
                      setTheme({ theme: 'light' })
                      setIsSystem(false)
                    }}
                  >
                    <span className="material-icons-outlined text-base ">
                      light_mode
                    </span>
                    Light
                  </li>
                  <li
                    className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600/50 ${
                      theme.theme === 'dark' && !isSystem
                        ? 'text-blue-500 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                    onClick={() => {
                      setTheme({ theme: 'dark' })
                      setIsSystem(false)
                    }}
                  >
                    <span className="material-icons-outlined text-base">
                      dark_mode
                    </span>
                    Dark
                  </li>
                  <li
                    className={`flex items-center gap-2 px-2 py-1 rounded-b hover:bg-gray-100 dark:hover:bg-gray-600/50 ${
                      isSystem
                        ? 'text-blue-500 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                    onClick={() => {
                      setIsSystem(true)
                    }}
                  >
                    <span className="material-icons-outlined text-base">
                      desktop_mac
                    </span>
                    System
                  </li>
                </ul>
              </ToggleMenu>

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
        {/* <DocIndexSection title="最近同步的筆記" indexArray={committedDocIndicies} /> */}
        <DocIndexSection title="暫存區" docIndicies={editingdDocIndicies} />
      </div>
    </>
  )
}

export default SideBar
