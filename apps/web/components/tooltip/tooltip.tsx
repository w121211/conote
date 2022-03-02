import React, { useEffect, useRef, useState } from 'react'

export interface Tooltip {
  children: React.ReactNode
  visible: boolean
  onClose: () => void
  width?: number
  top?: number
  className?: string
  direction?: 'top' | 'bottom' | 'left' | 'right'
}

const Tooltip: React.FC<Tooltip & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  visible,
  onClose,
  className,
  direction,
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

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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
      className={`absolute flex p-3 overflow-auto whitespace-nowrap 
      border border-gray-200 rounded bg-white shadow-lg z-50 transition-all ease-[cubic-bezier(0.21,0.02,0.28,1.58)]
      ${visible ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-75'}
     ${directionState} ${className ? className : ''}`}
      ref={divRef}
    >
      {children}
    </div>
  )
}

export default Tooltip
