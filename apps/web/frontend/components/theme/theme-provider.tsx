import React, { createContext, ReactNode, useEffect, useState } from 'react'
import Theme, { ThemeType } from './theme-storage'

type ThemeState = { theme: 'light' | 'dark' }

const getInitialTheme = (): ThemeState => {
  // console.log('getInitialTheme')
  const localTheme = Theme.getInstance()
  if (localTheme) {
    const value = localTheme.getTheme() as ThemeType
    return { theme: value }
  } else {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    // console.log(window.matchMedia('(prefers-color-scheme: dark)'))
    if (isDark) {
      return { theme: 'dark' }
    }
    return { theme: 'light' } //light theme as the default
  }
}

const getIsSystem = (): boolean => {
  // console.log('getIsSystem')
  const localTheme = Theme.getInstance()
  if (localTheme) {
    return false
  }
  return true
}

export const ThemeContext = createContext<{
  theme: ThemeState
  setTheme: React.Dispatch<React.SetStateAction<ThemeState>>
  isSystem: boolean
  setIsSystem: React.Dispatch<React.SetStateAction<boolean>>
}>({
  theme: { theme: 'light' },
  setTheme: () => {
    //
  },
  isSystem: false,
  setIsSystem: () => {
    //
  },
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { Provider } = ThemeContext
  const [theme, setTheme] = useState<ThemeState>(getInitialTheme())
  const [isSystem, setIsSystem] = useState(getIsSystem())

  useEffect(() => {
    // console.log('theme useeffect')
    const localTheme = Theme.getInstance()
    if (theme.theme === 'dark') {
      if (!isSystem) {
        if (!localTheme) {
          const newLocalTheme = Theme.newInstance()
          newLocalTheme.setTheme('dark')
        } else {
          localTheme.setTheme('dark')
        }
      }
      document.documentElement.classList.add('dark')
    } else {
      if (!isSystem) {
        if (!localTheme) {
          const newLocalTheme = Theme.newInstance()
          newLocalTheme.setTheme('light')
        } else {
          localTheme.setTheme('light')
        }
      }
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    // console.log('isSystem useEffect')
    const localTheme = Theme.getInstance()
    if (isSystem) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        // console.log(window.matchMedia('(prefers-color-scheme: dark)'))
        localTheme?.clear()
        setTheme({ theme: 'dark' })
        // document.documentElement.classList.add('dark')
      } else {
        localTheme?.clear()
        setTheme({ theme: 'light' })
        //   document.documentElement.classList.remove('dark')
      }
    }
  }, [isSystem])

  return (
    <Provider value={{ theme, setTheme, isSystem, setIsSystem }}>
      {children}
    </Provider>
  )
}
