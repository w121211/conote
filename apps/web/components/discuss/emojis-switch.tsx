import React, { ReactNode } from 'react'

const EmojisWrapper = ({
  showTooltip,
  onShowTooltip,
  children,
}: {
  showTooltip: boolean
  children: ReactNode
  onShowTooltip: () => void
}) => {
  return (
    <div
      className={`relative flex items-center leading-none ${
        showTooltip
          ? "before:content-[''] before:fixed before:z-50  before:block before:right-0 before:bottom-0 before:left-0 before:top-0 before:cursor-default"
          : ''
      } `}
    >
      <span
        className={`material-icons-outlined rounded-full cursor-pointer select-none leading-none 
  text-xl text-gray-400 mix-blend-multiply hover:bg-gray-200/70 z-100

`}
        onClick={e => {
          e.stopPropagation()
          onShowTooltip()
        }}
      >
        sentiment_satisfied_alt
      </span>
      {children}
    </div>
  )
}

export default EmojisWrapper
