import React from 'react'

const BulletPanelSvg = ({
  clicked,
  className,
}: { clicked?: () => void; className?: string } & React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  return (
    <div
      className={`relative flex items-center justify-center h-7 w-4 invisible z-10 ${className}`}
      onClick={e => {
        e.stopPropagation()
      }}
    >
      <svg viewBox="0 0 30 30" fill="text-gray-300">
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
