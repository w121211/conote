import React, { useEffect, useRef, useState } from 'react'

export interface Tooltip {
  children: React.ReactNode
  visible: boolean
  onClose: () => void
  width?: number
  top?: number
  className?: string
}

const Tooltip: React.FC<Tooltip & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  visible,
  onClose,
  top,
  className,
}) => {
  // const [visibleState, setVisibleState] = useState(visible)
  const myRef = useRef<HTMLDivElement>(null)
  // const [styleState, setStyleState] = useState<React.CSSProperties>()
  const [styleState, setStyleState] = useState<string[]>()

  const customStyle = () => {
    // const newStyle: React.CSSProperties = {}
    const customClass: string[] = []

    if (myRef.current) {
      if (myRef.current.getBoundingClientRect().top > window.innerHeight / 2) {
        // customClass.push('translate-y-2')
        // newStyle.bottom = '120%'
        // newStyle.transform = 'translateY(8px)'
        // newStyle.maxHeight = window.innerHeight - myRef.current.getBoundingClientRect().top + 'px'
      } else {
        // newStyle.maxHeight = window.innerHeight - myRef.current.getBoundingClientRect().top + 'px'
        // newStyle.top = 'max(110%,30px)'
        // newStyle.transform = 'translateY(-8px)'
        // customClass.push('translate-y-1')
      }

      // console.log(myRef.current.getBoundingClientRect().top, window.innerHeight / 2)
    }
    // if (top && top >= 0) {
    //   newStyle.top = top + 'px'
    // }

    // return newStyle
    return customClass
  }

  const handleCustomStyle = () => {
    setStyleState(customStyle())
    // console.log(customStyle())
  }
  const handleClickOutside = (e: MouseEvent) => {
    if (myRef.current && !myRef.current.contains(e.target as Node)) {
      // setVisibleState(false)
      onClose()
      // setStyleState(customStyle())
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

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
  // useEffect(() => {
  //   handleCustomStyle()
  // }, [visible])

  return (
    <div
      className={`absolute flex p-3 overflow-auto whitespace-nowrap 
      border border-gray-200 rounded bg-white shadow-lg z-50 transition-all ease-[cubic-bezier(0.21,0.02,0.28,1.58)]
      ${visible ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-75'}
     ${
       myRef.current
         ? myRef.current.getBoundingClientRect().top > window.innerHeight / 2
           ? 'bottom-full'
           : 'top-full'
         : ''
     } 
     ${className ? className : ''}`}
      // style={styleState}
      ref={myRef}
    >
      {children}
    </div>
  )
}

export default Tooltip
