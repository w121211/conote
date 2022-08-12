import React from 'react'
import { Tooltip } from '../ui/tooltip/tooltip'

export const EmojisDropdownBtn = ({ disable }: { disable?: boolean }) => {
  const dropdownBtn = (
    <span
      className={`
      material-icons-outlined p-1 rounded select-none text-base leading-none 
      ${
        disable
          ? ' text-gray-300 bg-transparent cursor-not-allowed'
          : 'hover:bg-gray-100 hover:text-gray-700'
      }`}
    >
      sentiment_satisfied_alt
    </span>
  )

  return (
    <div
      className={`relative text-gray-500    
        `}
      onClick={e => {
        if (disable) {
          e.preventDefault()
        }
      }}
    >
      {dropdownBtn}
      {/* {disable ? (
        <Tooltip title="不能對自己按讚" size="sm" darkMode align="middle">
          {dropdownBtn}
        </Tooltip>
      ) : (
        dropdownBtn
      )} */}
    </div>
  )
}
