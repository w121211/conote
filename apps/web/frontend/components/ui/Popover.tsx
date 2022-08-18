/**
 * Code borrow from floting-ui example.
 * Source: https://floating-ui.com/docs/react-dom-interactions -> Modal Popover
 *
 */

import React, { cloneElement, useState } from 'react'
import {
  Placement,
  offset,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useRole,
  useDismiss,
  useId,
  useClick,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react-dom-interactions'

interface Props {
  render: (data: {
    close: () => void
    labelId: string
    descriptionId: string
  }) => React.ReactNode
  placement?: Placement
  children: JSX.Element
}

const Popover = ({ children, render, placement }: Props) => {
  const [open, setOpen] = useState(false)

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(5),
      // flip(),
      shift({ padding: 20 }),
    ],
    placement,
    whileElementsMounted: autoUpdate,
  })

  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
  ])

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ ref: reference, ...children.props }),
      )}
      <FloatingPortal>
        {open && (
          <FloatingFocusManager context={context}>
            <div
              {...getFloatingProps({
                className: 'Popover',
                ref: floating,
                style: {
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                },
                // 'aria-labelledby': labelId,
                // 'aria-describedby': descriptionId,
              })}
            >
              {render({
                labelId,
                descriptionId,
                close: () => {
                  setOpen(false)
                },
              })}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  )
}

export default Popover
