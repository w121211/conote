import React, { useEffect, useRef, useState } from 'react'

export interface Tooltip {
  children: React.ReactNode
  visible?: boolean
  handleVisibleState?: (state: boolean) => void
  width?: number
  top?: number
  className?: string
}

const Tooltip: React.FC<Tooltip & React.HTMLAttributes<HTMLDivElement>> = ({
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

    newStyle.opacity = `${visible === true ? 1 : 0}`
    if (myRef.current) {
      if (myRef.current.getBoundingClientRect().top > window.innerHeight / 2) {
        newStyle.bottom = '120%'
        newStyle.transform = 'translateY(8px)'
        // newStyle.maxHeight = window.innerHeight - myRef.current.getBoundingClientRect().top + 'px'
      } else {
        // newStyle.maxHeight = window.innerHeight - myRef.current.getBoundingClientRect().top + 'px'
        newStyle.top = 'max(110%,30px)'

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
      window.addEventListener('scroll', handleCustomStyle)
    }
    return () => {
      window.removeEventListener('scroll', handleCustomStyle)
    }
  }, [])
  useEffect(() => {
    handleCustomStyle()
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`absolute flex flex-col p-3 overflow-auto whitespace-nowrap border border-gray-100 rounded bg-white shadow-md z-50 transition-all ${
        className ? className : ''
      }`}
      style={styleState}
      ref={myRef}
    >
      {children}
    </div>
  )
}

export default Tooltip
