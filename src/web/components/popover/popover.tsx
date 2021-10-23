import React from 'react'
import CancelIcon from '../../assets/svg/cancel.svg'
import classes from './popover.module.scss'

const Popover = ({
  children,
  visible,
  hideBoard,
  subTitle,
  mask,
  buttons,
  center,
}: // width,
{
  children: React.ReactNode
  visible: boolean
  hideBoard: () => void
  subTitle?: string
  mask?: boolean
  buttons?: React.ReactNode
  center?: boolean
  // width?: number
}): JSX.Element | null => {
  // console.log(mask)
  if (!visible) {
    return null
  }
  return (
    <div
      className={classes.containerOuter}
      style={
        {
          // visibility: `${visible ? 'visible' : 'hidden'}`,
          // width: `${typeof width === 'number' ? width + 'px' : 'initial'}`,
        }
      }
    >
      <div
        className={classes.mask}
        onClick={e => {
          // e.preventDefault()
          e.stopPropagation()
          hideBoard()
        }}
        style={mask ? undefined : { background: 'none' }}
      ></div>

      <div className={classes.containerInner}>
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
        {buttons && <div className={classes.buttons}>{buttons}</div>}
      </div>
    </div>
  )
}

Popover.defaultProps = {
  mask: true,
  center: false,
}

export default Popover
