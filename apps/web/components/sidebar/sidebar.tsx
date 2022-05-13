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
import { ThemeType } from './theme-storage'
import { ThemeContext } from '../theme/theme-provider'
import { ThemeToggle } from '../theme/theme-toggle'

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
        {/* <DocIndexSection title="最近同步的筆記" indexArray={committedDocIndicies} /> */}
        <DocIndexSection title="暫存區" docIndicies={editingdDocIndicies} />
      </div>
    </>
  )
}

export default SideBar
