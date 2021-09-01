import React, { ReactElement, useRef, useState } from 'react'
import MyTooltip from '../my-tooltip/my-tooltip'
import BulletPanelSvg from './bullet-panel-svg'
import SrcIcon from '../../assets/svg/foreign.svg'
import classes from './bullet-panel.module.scss'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'

interface Child {
  icon?: SVGComponentTransferFunctionElement | SVGElement | Element | string | ReactElement
  text?: string | React.ReactNode
  sourceUrl?: string
  authorName?: string
}

export interface BulletPanelType {
  children?: Child[]
  visible?: boolean
  handleVisibleState?: (state: boolean) => void
  className?: string
  sourceUrl?: string
  authorName?: string
}

const BulletPanel = ({
  children,
  visible,
  handleVisibleState,
  className,
  sourceUrl,
  authorName,
}: BulletPanelType): JSX.Element => {
  const [showPanel, setShowPanel] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const myChildren: Child[] = [
    {
      icon: <PinIcon />,
      text: 'Pin',
    },
    {
      icon: <UpIcon />,
      text: 'Up',
    },
    {
      icon: <UpIcon style={{ transform: 'rotate(180deg)' }} />,
      text: 'Down',
    },
  ]
  if (authorName) {
    myChildren.unshift({ authorName: '@' + authorName.split(':')[0] })
  }
  if (sourceUrl) {
    myChildren.push({ icon: <SrcIcon />, text: '來源連結', sourceUrl })
  }

  const handleShowPanel = (state: boolean) => {
    setShowPanel(state)
  }
  return (
    <div
      className={`${classes.container} ${className ? className : ''}`}
      onMouseOver={e => {
        e.stopPropagation()
        // e.preventDefault()
        if (e.currentTarget.contains(containerRef.current)) {
          setShowPanel(true)
        }
        // console.log('hover')
      }}
      onMouseLeave={e => {
        e.stopPropagation()
        // e.preventDefault()

        // if (!e.currentTarget.contains(containerRef.current)) {
        setTimeout(
          () => {
            setShowPanel(false)
          },
          100,
          false,
        )
        // }
        // console.log('mouseout')
      }}
      ref={containerRef}
    >
      {/* <div className={classes.bulletPanelSibling}></div> */}
      <BulletPanelSvg
        className={classes.bulletPanel}
        // clicked={() => {
        //   setShowPanel(prev => !prev)
        //   // console.log('panel clicked')
        // }}

        style={showPanel || visible ? { visibility: 'visible' } : undefined}
      />

      {showPanel && (
        <MyTooltip className={classes.panelTooltip} visible={showPanel} handleVisibleState={handleShowPanel}>
          {myChildren.map((e, i) => {
            if (e.authorName)
              return (
                <div key={i} className={classes.title}>
                  <div className={`${classes.panelElement} ${classes.title}`}>{e.authorName}</div>
                  <div role="none" className={classes.divider}></div>
                </div>
              )
            if (e.sourceUrl)
              return (
                <div className={classes.panelElement} key={i}>
                  <a href={e.sourceUrl} data-type="ui">
                    <span className={classes.panelIcon}>{e.icon}</span>
                    {e.text}
                  </a>
                </div>
              )

            return (
              <div className={classes.panelElement} key={i}>
                <span className={classes.panelIcon}>{e.icon}</span>

                {e.text}
              </div>
            )
          })}
        </MyTooltip>
      )}
    </div>
  )
}
export default BulletPanel
