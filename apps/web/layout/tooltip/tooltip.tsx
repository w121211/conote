import React, { useEffect, useRef, useState } from 'react'

export interface Tooltip {
  children: React.ReactNode
  visible: boolean
  onClose: () => void
  width?: number
  top?: number
  className?: string
  direction?: 'top' | 'bottom' | 'left' | 'right'
  size?: 'sm' | 'md'
  darkMode?: boolean
}

//size
const sm = `p-1 text-xs shadow-md`
const md = `p-3 text-sm shadow-lg`

//theme
const dark = `border-gray-700 bg-gray-600 text-gray-50`
const light = `border-gray-200 bg-white text-500`

const Tooltip: React.FC<Tooltip & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  visible,
  onClose,
  className,
  direction,
  size,
  darkMode,
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [directionState, setDirectionState] = useState<string>('')

  const handleClickOutside = (e: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  const isOverHalfVh = () => {
    return divRef.current && divRef.current.getBoundingClientRect().top > window.innerHeight / 2
  }

  const adjustDirection = () => {
    const isOverHalf =
      divRef.current &&
      divRef.current.parentElement &&
      divRef.current.parentElement.getBoundingClientRect().top > window.innerHeight / 2
    switch (direction) {
      case 'top':
        return setDirectionState(`bottom-full`)
      case 'bottom': {
        return setDirectionState(`top-full`)
      }
      case 'left': {
        return setDirectionState('-left-1 -translate-x-full -top-full translate-y-1/2')
      }
      case 'right': {
        return setDirectionState('left-[calc(100%_+_4px)] -top-full translate-y-1/2')
      }
      default: {
        return setDirectionState(`${isOverHalf ? 'bottom-full' : 'top-full'}`)
      }
    }
  }

  useEffect(() => {
    adjustDirection()
  })

  // useEffect(() => {
  //   document.addEventListener('click', handleClickOutside)

  //   return () => document.removeEventListener('click', handleClickOutside)
  // }, [])

  // useEffect(() => {
  //   if (window) {
  //     document.addEventListener('scroll', adjustDirection)
  //   }
  //   return () => document.removeEventListener('scroll', adjustDirection)
  // }, [])

  // useEffect(()=>{

  // })

  return (
    <div
      className={`absolute flex overflow-auto whitespace-nowrap 
      border rounded z-50 transition-all ease-[cubic-bezier(0.21,0.02,0.28,1.58)]
      ${size === 'sm' ? sm : md} ${darkMode ? dark : light} ${
        visible ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-75'
      }
     ${directionState} ${className ? className : ''}`}
      ref={divRef}
    >
      {children}
    </div>
  )
}

export default Tooltip
