import React from 'react'

const BulletSvg = ({ className }: { className?: string }) => {
  return (
    <span className={`flex justify-center flex-shrink-0 flex-grow-0 align-middle ${className ? className : ''}`}>
      <svg viewBox="0 0 18 18" className="w-3 h-3 fill-current text-gray-600 ">
        <circle cx="9" cy="9" r="4" />
      </svg>
    </span>
  )
}
export default BulletSvg
