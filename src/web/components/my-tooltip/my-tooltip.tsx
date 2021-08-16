import React, { useEffect, useRef, useState } from 'react'
import classes from './my-tooltip.module.scss'

interface Tooltip {
  children: React.ReactNode
  visible?: boolean
  handleVisibleState?: (state: boolean) => void
  width?: number
  top?: number
  className?: string
}

const MyTooltip: React.FC<Tooltip & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  visible,
  handleVisibleState,

  className,
}) => {
  // const [visibleState, setVisibleState] = useState(visible)
  const myRef = useRef<HTMLDivElement>(null)
  const [styleState, setStyleState] = useState<React.CSSProperties>()

  const customStyle = () => {
    const newStyle: React.CSSProperties = {}

    if (visible !== undefined) {
      newStyle.visibility = `${typeof visible === 'boolean' && visible === true ? 'visible' : 'hidden'}`
    }
    if (myRef.current) {
      myRef.current.getBoundingClientRect().top > window.innerHeight / 2
        ? (newStyle.top = 'auto')
        : (newStyle.bottom = 'auto')

      // console.log(myRef.current.getBoundingClientRect().top, window.innerHeight / 2)
    }

    return newStyle
  }

  const handleCustomStyle = () => {
    setStyleState(customStyle())

    // console.log(customStyle())
  }
  const handleClickOutside = (e: MouseEvent) => {
    if (myRef.current && !myRef.current.contains(e.target as Node)) {
      // setVisibleState(false)
      handleVisibleState && handleVisibleState(false)
      // setStyleState(customStyle())
    }
  }

  useEffect(() => {
    if (handleVisibleState) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    // handleCustomStyle()
    if (window) {
      window.addEventListener('scroll', handleCustomStyle, true)
    }
    return () => window.removeEventListener('scroll', handleCustomStyle, true)
  }, [])
  useEffect(() => {
    handleCustomStyle()
  }, [visible])

  return (
    <div className={`${classes.containerouter} ${className ? className : ''}`} style={styleState} ref={myRef}>
      {children}
    </div>
  )
}

export default MyTooltip
