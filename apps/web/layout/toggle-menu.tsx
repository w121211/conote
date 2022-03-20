import React, { ReactNode, useState } from 'react'

const ToggleMenu = ({
  summary,
  children,
  className = '',
  disabled,
}: {
  summary: ReactNode
  children: ReactNode
  className?: string
  disabled?: boolean
}) => {
  const [open, setOpen] = useState(false)

  return (
    <details
      className="group relative h-fit cursor-pointer select-none "
      open={false}
      // onClick={e => {
      //   if (disabled) {
      //     e.preventDefault()
      //   }
      // }}
    >
      <summary
        className={`inline-block h-fit   w-fit rounded list-none leading-none
         before:content-[''] ${
           open ? 'before:fixed' : 'before:hidden'
         } before:block  before:top-0 before:left-0 before:right-0 before:bottom-0 before:z-10 before:bg-transparent before:cursor-default`}
        onClick={e => {
          if (disabled) {
            e.preventDefault
            return
          }
          setOpen(o => !o)
        }}
      >
        {summary}
      </summary>
      <div className={`details-menu group-open:opacity-100 group-open:scale-100 ${className}`}>{children}</div>
    </details>
  )
}

export default ToggleMenu
