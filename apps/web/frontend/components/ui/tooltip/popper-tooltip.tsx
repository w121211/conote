import React, { ReactNode, useContext } from 'react'
import { createPortal } from 'react-dom'
import { usePopperTooltip } from 'react-popper-tooltip'
import { TooltipContext } from './tooltip-provider'
// import 'react-popper-tooltip/dist/styles.css'
import classes from './popper-tooltip.module.css'
import { detectOverflow } from '@popperjs/core'

/* size */
const sm = `px-2 py-1 text-xs shadow-md`
const md = `px-3 py-2 text-sm `

/* theme */
const dark = `border-gray-700 bg-gray-600 text-gray-50`
const light = `border-gray-200 bg-gray-100 text-gray-500`
const warning = `border-red-600 bg-red-600 text-white`

export const PopperTooltip = ({
  children,
  label,
  type,
  darkMode,

  size = 'md',
}: {
  children: ReactNode
  label: ReactNode
  darkMode?: boolean
  type?: 'warning'

  size?: 'sm' | 'md'
}) => {
  const tooltipRoot = useContext(TooltipContext)
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
    ...popperProps
  } =
    usePopperTooltip()
    // {},
    // {
    //   modifiers: [
    //     {
    //       name: 'flip',
    //       options: {
    //         boundary: ,
    //       },
    //     },
    //   ],
    // },

  const theme = type === 'warning' ? warning : darkMode ? dark : dark

  if (!tooltipRoot) {
    return null
  }

  return (
    <>
      {React.isValidElement(children) ? (
        React.Children.map(children, (child, idx) =>
          React.cloneElement(child, {
            ...child.props,
            ref: setTriggerRef,
          }),
        )
      ) : (
        <span ref={setTriggerRef}>{children}</span>
      )}
      {createPortal(
        visible && (
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className: `${
                classes.tooltipContainer
              } z-50 pointer-events-none whitespace-nowrap 
            border rounded ${theme} ${size === 'sm' ? sm : md} `,
            })}
          >
            <div
              {...getArrowProps({
                className: ` 
                ${classes.tooltipArrow}
                h-4 w-4
                border-inherit
                pointer-events-none

                before:content-['']
                before:block
                before:absolute
                before:left-1/2
                before:-translate-x-1/2
                before:border-[7px]
                before:border-transparent 
                
                after:content-['']
                after:block
                after:absolute
                
                after:left-1/2
                after:-translate-x-1/2
                after:border-[6px]
                after:border-transparent
                ${type === 'warning' ? classes.warning : ''}
               
                `,
              })}
            />
            {label}
          </div>
        ),
        tooltipRoot,
      )}
    </>
  )
}
