import React, { ReactNode, useContext } from 'react'
import { createPortal } from 'react-dom'
import { usePopperTooltip } from 'react-popper-tooltip'
import { TooltipContext } from './tooltip-provider'
import 'react-popper-tooltip/dist/styles.css'

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
  placement = 'top',
  size = 'md',
}: {
  children: ReactNode
  label: ReactNode
  darkMode?: boolean
  type?: 'warning'
  placement?: 'top'
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
  } = usePopperTooltip({ placement: placement })

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
              className: `z-50 pointer-events-none whitespace-nowrap 
            border rounded ${theme} ${size === 'sm' ? sm : md} `,
            })}
          >
            <div
              {...getArrowProps({
                className: ` 
                h-4 w-4
                border-inherit
                pointer-events-none
                ${
                  placement === 'top'
                    ? 'bottom-0 left-0 -mb-4'
                    : 'left-0 right-0 -mt-[17px]'
                }

                before:content-['']
                before:block
                before:absolute
                before:left-1/2
                before:-translate-x-1/2
                before:border-[7px]
                before:border-transparent 
                ${
                  placement === 'top'
                    ? ' before:border-t-inherit'
                    : '  before:border-b-inherit'
                }
                after:content-['']
                after:block
                after:absolute
                
                after:left-1/2
                after:-translate-x-1/2
                after:border-[6px]
                after:border-transparent
                ${
                  placement === 'top'
                    ? ` ${
                        type === 'warning'
                          ? 'after:border-t-inherit'
                          : 'after:border-t-gray-600'
                      } `
                    : `${
                        type === 'warning'
                          ? 'after:border-b-inherit'
                          : 'after:border-b-gray-600'
                      }`
                }`,
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
