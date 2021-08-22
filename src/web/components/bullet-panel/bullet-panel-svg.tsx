import React from 'react'
import classes from './bullet-panel-svg.module.scss'

const BulletPanelSvg = ({ clicked }: { clicked: (e: MouseEvent) => void }): JSX.Element => {
  return (
    <div
      className={classes.svgContainer}
      onClick={(e: MouseEvent) => {
        clicked(e)
      }}
    >
      <svg viewBox="0 0 30 30">
        <circle cx="10" cy="5" r="3"></circle>
        <circle cx="10" cy="15" r="3"></circle>
        <circle cx="10" cy="25" r="3"></circle>
        <circle cx="20" cy="5" r="3"></circle>
        <circle cx="20" cy="15" r="3"></circle>
        <circle cx="20" cy="25" r="3"></circle>
      </svg>
    </div>
  )
}
export default BulletPanelSvg
