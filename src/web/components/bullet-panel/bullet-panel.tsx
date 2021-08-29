import React, { ReactElement, useState } from 'react'
import MyTooltip from '../my-tooltip/my-tooltip'
import BulletPanelSvg from './bullet-panel-svg'
import classes from './bullet-panel.module.scss'

interface Child {
  icon: SVGComponentTransferFunctionElement | SVGElement | Element | string | ReactElement
  text: string | React.ReactNode
}

export interface BulletPanelType {
  children: Child[]
  visible: boolean
  handleVisibleState?: (state: boolean) => void
  className?: string
}

const BulletPanel = ({ children, visible, handleVisibleState, className }: BulletPanelType): JSX.Element => {
  const [showPanel, setShowPanel] = useState<boolean>(false)

  const handleShowPanel = (state: boolean) => {
    setShowPanel(state)
  }
  return (
    <div className={`${classes.container} ${className ? className : ''}`}>
      <BulletPanelSvg
        clicked={e => {
          e.stopPropagation()
          setShowPanel(prev => !prev)
          // console.log('panel clicked')
        }}
      />
      <MyTooltip className={classes.panelTooltip} visible={showPanel} handleVisibleState={handleShowPanel}>
        {children.map((e, i) => {
          return (
            <div className={classes.panelElement} key={i}>
              <span className={classes.panelIcon}>{e.icon}</span>
              {e.text}
            </div>
          )
        })}
      </MyTooltip>
    </div>
  )
}
export default BulletPanel
