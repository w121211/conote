import React from 'react'
import classes from './bullet-svg.module.scss'

const BulletSvg = ({ className }: { className?: string }) => {
  return (
    <span className={`flex items-center justify-center flex-shrink-0 flex-grow-0 ${className ? className : ''}`}>
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
          className="w-3 h-3 fill-current text-gray-800 "
        >
          <circle cx="9" cy="9" r="4" />
        </svg>
        {/* • */}
      </span>
    </span>
  )
}
export default BulletSvg
