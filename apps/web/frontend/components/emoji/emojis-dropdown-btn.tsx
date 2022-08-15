import React from 'react'

export const EmojisDropdownBtn = ({ disabled }: { disabled?: boolean }) => {
  const dropdownBtn = (
    <span
      className={`
      material-icons-outlined p-1 rounded select-none text-base leading-none 
      ${
        disabled
          ? ' text-gray-300 bg-transparent cursor-not-allowed'
          : 'hover:bg-gray-100 hover:text-gray-700'
      }`}
    >
      sentiment_satisfied_alt
    </span>
  )

  return (
    <div
      className={'relative text-gray-500'}
      onClick={e => {
        if (disabled) e.preventDefault()
      }}
    >
      {dropdownBtn}
    </div>
  )
}
