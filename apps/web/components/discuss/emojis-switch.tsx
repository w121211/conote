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
      <button
        className="btn-reset-style p-1 hover:bg-gray-100 z-100 rounded"
        onClick={e => {
          e.stopPropagation()
          onShowTooltip()
        }}
      >
        <span
          className={`material-icons-outlined select-none leading-none 
  text-base text-gray-400 mix-blend-multiply `}
        >
          sentiment_satisfied_alt
        </span>
      </button>
      {children}
    </div>
  )
}

export default EmojisWrapper
