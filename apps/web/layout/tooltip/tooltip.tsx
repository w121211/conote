import React, {
  ReactChild,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { TooltipContext } from './tooltip-provider'
import './tooltip.module.css'

export interface Tooltip {
  title: string | React.ReactNode
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactPortal
    | string
  visible?: boolean
  onClose?: () => void
  width?: number
  top?: number
  className?: string
  // direction?: 'top' | 'bottom' | 'left' | 'right'
  size?: 'sm' | 'md'
  darkMode?: boolean
  state?: 'warn'
}

//size
const sm = `px-2 py-1 text-xs shadow-md`
const md = `px-3 py-2 text-sm `

//theme
const dark = `border-gray-700 bg-gray-600 text-gray-50`
const light = `border-gray-200 bg-gray-100 text-gray-500`
const warn = `border-red-600 bg-red-600 text-white`

export const Tooltip: React.FC<Tooltip & React.HTMLAttributes<HTMLDivElement>> =
  ({ title, children, visible, onClose, className, size, darkMode, state }) => {
    const { current: childrenRef } = useRef<HTMLElement[]>([])
    // if (React.isValidElement(children)) {
    //   React.Children.map(children, (child, idx) =>
    //     React.cloneElement(child, {
    //       ...child.props,
    //       ref: (el: any) => {
    //         console.log(el)
    //         childrenRef[idx] = el
    //       },
    //     }),
    //   )
    //   // console.log(childrenRef)
    // } else {
    //   throw 'children is not valid ReactElement'
    // }
    const rendered = useRef<number>(0)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<any>(null)
    const [direction, setDirection] = useState<'top' | 'bottom'>('top')
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [mouseEnter, setMouseEnter] = useState(false)
    const [open, setOpen] = useState(false)
    const theme = state === 'warn' ? warn : darkMode ? dark : dark

    const tooltipRoot = useContext(TooltipContext)

    const renderEl = (
      <div
        className={`
        absolute 
        z-[100] 
        flex 
        
        whitespace-nowrap 
        border rounded 
        transition
        pointer-events-none

        before:content-['']
        before:absolute
        before:left-1/2
        before:-translate-x-1/2
        before:border-[7px]
        before:border-transparent
        ${
          direction === 'top'
            ? 'before:top-full before:border-t-inherit'
            : 'before:top-[-14px] before:border-b-inherit'
        }

        after:content-['']
        after:absolute
        after:left-1/2
        after:-translate-x-1/2
        after:border-[6px]
        after:border-transparent
        ${
          direction === 'top'
            ? `after:top-full ${
                state === 'warn'
                  ? 'after:border-t-inherit'
                  : 'after:border-t-gray-600'
              } `
            : `after:-top-3  ${
                state === 'warn'
                  ? 'after:border-b-inherit'
                  : 'after:border-b-gray-600'
              }`
        }

        ${size === 'sm' ? sm : md} 
        ${theme} 
        ${
          open
            ? 'visible opacity-100 scale-100'
            : 'invisible opacity-0 scale-75'
        }
        
        ${className ? className : ''}
        `}
        style={{ top: position.top + 'px', left: position.left + 'px' }}
        ref={tooltipRef}
      >
        {title}
      </div>
    )

    // const handleClickOutside = (e: MouseEvent) => {
    //   if (
    //     tooltipRef.current &&
    //     !tooltipRef.current.contains(e.target as Node)
    //   ) {
    //     onClose()
    //   }
    // }

    // const isOverHalfVh = () => {
    //   return (
    //     tooltipRef.current &&
    //     tooltipRef.current.getBoundingClientRect().top > window.innerHeight / 2
    //   )
    // }

    const checkOutOfViewport = (
      top: number,
      topDistance: number,
      // scrollTop: number,
      bottomDistance: number,
      height: number,
    ) => {
      let newTop = top

      if (top - topDistance <= window.scrollY) {
        newTop = top + bottomDistance
        setDirection('bottom')
        // console.log('first if', top)
      } else if (top + bottomDistance + height >= window.innerHeight) {
        newTop = top - topDistance
        setDirection('top')
      } else {
        newTop = top - topDistance
        setDirection('top')
      }
      return newTop
    }

    function getPageOffset(el: HTMLElement | null) {
      // console.log(el?.scrollTop)
      if (el !== null) {
        let topOffset = el.getBoundingClientRect().top
        while (el !== null && el !== document.documentElement) {
          el = el.parentElement
          // console.log(el, topOffset, el.scrollTop)

          if (el) {
            if (el === document.documentElement) {
              topOffset += el.scrollTop
            }
          }
          // console.log(topOffset, el)
        }
        // console.log(topOffset)
        return topOffset
      }
      return 0
    }

    const handlePosition = () => {
      if (childrenRef.length > 0 && tooltipRef.current) {
        let top = 0
        let left = 0
        let childrenHeight = 0

        childrenRef.forEach((child, idx) => {
          const childrenLeft = child.getBoundingClientRect().left
          const childHeight = child.getBoundingClientRect().height
          if (idx === 0) {
            left = childrenLeft
            childrenHeight = childHeight
            top = getPageOffset(child)
            return
          }
        })

        const tooltipElement = tooltipRef.current
        const height = tooltipElement.clientHeight
        const padding = 14
        const topDistance = height + padding
        const bottomDistance = childrenHeight + padding

        top = checkOutOfViewport(top, topDistance, bottomDistance, height)
        setPosition({ top: top, left: left })
      }
    }

    const onMouseEnter = () => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setMouseEnter(true)
      }, 300)
    }
    const onMouseLeave = () => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setMouseEnter(false)
      }, 300)
    }

    useLayoutEffect(() => {
      if (visible !== undefined) {
        if (visible) {
          // rendered.current = 1
          handlePosition()
          setOpen(true)
        } else {
          setOpen(false)
        }
      } else {
        if (mouseEnter) {
          // rendered.current = 1
          handlePosition()
          setOpen(true)
        } else {
          setOpen(false)
        }
      }
    }, [visible, mouseEnter])

    if (!tooltipRoot) {
      return null
    }
    return (
      <>
        {React.isValidElement(children) ? (
          React.Children.map(children, (child, idx) =>
            React.cloneElement(
              child,
              visible === undefined
                ? {
                    ...child.props,
                    ref: (el: any) => {
                      // console.log(el)
                      childrenRef[idx] = el
                    },
                    onMouseEnter: () => {
                      onMouseEnter()
                    },
                    onMouseLeave: () => {
                      onMouseLeave()
                    },
                  }
                : {
                    ...child.props,
                    ref: (el: any) => {
                      // console.log(el)
                      childrenRef[idx] = el
                    },
                  },
            ),
          )
        ) : (
          <span
            onMouseEnter={() => {
              onMouseEnter()
            }}
            onMouseLeave={() => {
              onMouseLeave()
            }}
            ref={el => {
              el && (childrenRef[0] = el)
            }}
          >
            {children}
          </span>
        )}
        {createPortal(renderEl, tooltipRoot)}
      </>
    )
  }

// export default Tooltip
