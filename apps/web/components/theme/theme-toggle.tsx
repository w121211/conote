import React, { useContext } from 'react'
import ToggleMenu from '../../layout/toggle-menu'
import { ThemeContext } from './theme-provider'

export const ThemeToggle = () => {
  const { theme, setTheme, isSystem, setIsSystem } = useContext(ThemeContext)
  return (
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
          <span className="material-icons-outlined text-base ">light_mode</span>
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
          <span className="material-icons-outlined text-base">dark_mode</span>
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
          <span className="material-icons-outlined text-base">desktop_mac</span>
          System
        </li>
      </ul>
    </ToggleMenu>
  )
}
