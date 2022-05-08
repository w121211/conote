import React, { createContext, ReactNode, useEffect, useState } from 'react'
import Theme, { ThemeType } from './theme-storage'

type ThemeState = { theme: 'light' | 'dark' }

const getInitialTheme = (): ThemeState => {
  const localTheme = Theme.getInstance()
  if (localTheme) {
    const value = localTheme.getTheme() as ThemeType
    return { theme: value }
  } else {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    console.log(window.matchMedia('(prefers-color-scheme: dark)'))
    if (isDark) {
      return { theme: 'dark' }
    }
    return { theme: 'light' } //light theme as the default
  } // // On page load or when changing themes, best to add inline in "head" to avoid FOUC
  // if ((localTheme&&localTheme.getTheme() === 'dark' )|| (!localTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  //     if(localTheme){
  //         return
  //     }
  //     document.documentElement.classList.add('dark')
  //   } else {
  //     document.documentElement.classList.remove('dark')
  //   }
}

const getIsSystem = (): boolean => {
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
    const localTheme = Theme.getInstance()
    if (theme.theme === 'dark') {
      if (!localTheme) {
        const newLocalTheme = Theme.newInstance()
        newLocalTheme.setTheme('dark')
      } else {
        localTheme.setTheme('dark')
      }
      document.documentElement.classList.add('dark')
    } else {
      if (!localTheme) {
        const newLocalTheme = Theme.newInstance()
        newLocalTheme.setTheme('light')
      } else {
        localTheme.setTheme('light')
      }
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const localTheme = Theme.getInstance()
    if (isSystem) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDark) {
        console.log(window.matchMedia('(prefers-color-scheme: dark)'))
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
