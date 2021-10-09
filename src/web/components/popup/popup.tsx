import React from 'react'
import CancelIcon from '../../assets/svg/cancel.svg'
import classes from './popup.module.scss'

const Popup = ({
  children,
  visible,
  hideBoard,
  subTitle,
  mask,
  buttons,
  noMask,
}: // center
// width,
{
  children: React.ReactNode
  visible: boolean
  hideBoard: () => void
  subTitle?: string
  mask?: boolean
  buttons?: React.ReactNode
  noMask?: boolean
  // center?:boolean
  // width?: number
}): JSX.Element => {
  // console.log(mask)
  return (
    <div
      className={classes.containerOuter}
      style={{
        visibility: `${visible ? 'visible' : 'hidden'}`,
        width: `${noMask ? 'fit-content' : '100vw'}`,
        height: `${noMask ? 'fit-content' : '100vh'}`,
        // width: `${typeof width === 'number' ? width + 'px' : 'initial'}`,
      }}
    >
      {!noMask && (
        <div
          className={classes.mask}
          onClick={e => {
            // e.preventDefault()
            e.stopPropagation()
            hideBoard()
          }}
          style={mask ? undefined : { background: 'none' }}
        ></div>
      )}

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

Popup.defaultProps = {
  mask: true,
  noMask: false,
  // center:false
}

export default Popup
