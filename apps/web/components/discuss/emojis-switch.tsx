import React, { ReactNode, useState } from 'react'
import Tooltip from '../../layout/tooltip/popup'

const EmojisSwitch = ({ disable }: { disable?: boolean }) => {
  const [showDisable, setShowDisable] = useState(false)
  return (
    <div
      className={` relative text-gray-500    
        `}
      onClick={e => {
        if (disable) {
          e.preventDefault()
        }
      }}
      onMouseOver={() => {
        if (disable) {
          setShowDisable(true)
        }
      }}
      onMouseOut={() => {
        if (disable) {
          setShowDisable(false)
        }
      }}
      // disabled={disable}
    >
      <span
        className={`material-icons-outlined p-1 rounded select-none text-base leading-none 
    mix-blend-multiply ${
      disable
        ? 'bg-transparent text-gray-300 cursor-not-allowed'
        : 'hover:bg-gray-100 hover:text-gray-700'
    }`}
      >
        sentiment_satisfied_alt
      </span>
      <Tooltip
        className="left-1/2 -translate-x-1/2 z-50"
        visible={showDisable}
        onClose={() => {
          setShowDisable(false)
        }}
        size="sm"
        darkMode
        direction="top"
      >
        不能對自己按讚
      </Tooltip>
    </div>
  )
}

export default EmojisSwitch
