import React from 'react'
import classes from './bullet-svg.module.scss'

const BulletSvg = () => {
  return (
    <span className={classes.bulletWrapper}>
      <span
        className={classes.bullet}
        // onClick={() => {
        //   setShowChildren(prev => !prev)
        // }}
      >
        <svg
          viewBox="0 0 18 18"
          // className={`${classes.bulletSvg} ${
          //   showChildren || (node.children.length === 0 && node.children) ? '' : classes.bulletSvgBg
          // }`}
          className={classes.bulletSvg}
        >
          <circle cx="9" cy="9" r="4" />
        </svg>
        {/* • */}
      </span>
    </span>
  )
}
export default BulletSvg
