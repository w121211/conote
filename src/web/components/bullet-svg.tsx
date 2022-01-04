import React from 'react'

const BulletSvg = ({ className }: { className?: string }) => {
  return (
    <span className={`flex items-center justify-center flex-shrink-0 flex-grow-0 ${className ? className : ''}`}>
      <span className="flex items-center flex-grow-0 flex-shrink-0 h-full">
        <svg viewBox="0 0 18 18" className="w-3 h-3 fill-current text-gray-600 ">
          <circle cx="9" cy="9" r="4" />
        </svg>
      </span>
    </span>
  )
}
export default BulletSvg
