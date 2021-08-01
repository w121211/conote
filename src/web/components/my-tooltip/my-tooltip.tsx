import React from 'react'
import classes from './my-tooltip.module.scss'

const myTooltip = ({
  children,
  visible,

  width,
}: {
  children: React.ReactNode
  visible: boolean

  width?: number
}) => {
  return (
    <div
      className={classes.containerouter}
      style={{
        visibility: `${visible ? 'visible' : 'hidden'}`,
        width: `${typeof width === 'number' ? width + 'px' : undefined}`,
      }}
    >
      {children}
    </div>
  )
}

export default myTooltip
