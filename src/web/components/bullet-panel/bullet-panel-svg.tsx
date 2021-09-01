import React from 'react'
import classes from './bullet-panel-svg.module.scss'

const BulletPanelSvg = ({
  clicked,
  className,
  style,
}: { clicked?: () => void; className?: string } & React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  return (
    <div
      className={`${classes.svgContainer} ${className}`}
      onClick={e => {
        e.stopPropagation()
        // clicked()
      }}
      style={style}
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
