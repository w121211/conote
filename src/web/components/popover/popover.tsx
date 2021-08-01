import React from 'react'
import CancelIcon from '../../assets/svg/cancel.svg'
import classes from './popover.module.scss'

const Popover = ({
  children,
  visible,
  hideBoard,
  subTitle,
}: // width,
{
  children: React.ReactNode
  visible: boolean
  hideBoard: () => void
  subTitle?: string
  // width?: number
}) => {
  return (
    <div
      className={classes.containerOuter}
      style={{
        visibility: `${visible ? 'visible' : 'hidden'}`,
        // width: `${typeof width === 'number' ? width + 'px' : 'initial'}`,
      }}
    >
      <div className={classes.topBar}>
        <span
          className={classes.cancelIconWrapper}
          onClick={(e: any) => {
            e.stopPropagation()
            hideBoard()
          }}
        >
          <CancelIcon />
        </span>
        <span className={classes.subTitle}>{subTitle && subTitle} </span>
      </div>
      <div className={classes.children}>{children}</div>
    </div>
  )
}

export default Popover
