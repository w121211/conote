import React, { useState } from 'react'
import MyTooltip from '../my-tooltip/my-tooltip'
import BulletPanelSvg from './bullet-panel-svg'
import classes from './bullet-panel.module.scss'

const BulletPanel = ({
  children,
  visible,
  handleVisibleState,
  className,
}: {
  children: React.ReactNode
  visible: boolean
  handleVisibleState?: (state: boolean) => void
  className?: string
}): JSX.Element => {
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
        {children}
      </MyTooltip>
    </div>
  )
}
export default BulletPanel
