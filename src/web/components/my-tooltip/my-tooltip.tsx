import React, { useEffect, useRef, useState } from 'react'
import classes from './my-tooltip.module.scss'

export interface Tooltip {
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
  top,
  className,
}) => {
  // const [visibleState, setVisibleState] = useState(visible)
  const myRef = useRef<HTMLDivElement>(null)
  const [styleState, setStyleState] = useState<React.CSSProperties>()

  const customStyle = () => {
    const newStyle: React.CSSProperties = {}

    if (visible !== undefined) {
      newStyle.visibility = `${visible === true ? 'visible' : 'hidden'}`
      newStyle.opacity = `${visible === true ? 1 : 0}`
      // newStyle.transform = `${ visible === true ? 'visible' : 'hidden'}`
    }
    if (myRef.current) {
      if (myRef.current.getBoundingClientRect().top > window.innerHeight / 2) {
        newStyle.bottom = '120%'
        newStyle.transform = 'translateY(8px)'
      } else {
        newStyle.top = '120%'

        newStyle.transform = 'translateY(-8px)'
      }

      // console.log(myRef.current.getBoundingClientRect().top, window.innerHeight / 2)
    }
    if (top && top >= 0) {
      newStyle.top = top + 'px'
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
    <div className={`${classes.containerOuter} ${className ? className : ''}`} style={styleState} ref={myRef}>
      {children}
    </div>
  )
}

export default MyTooltip
