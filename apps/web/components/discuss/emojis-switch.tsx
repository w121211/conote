import React, { ReactNode, useState } from 'react'
import Tooltip from '../../layout/tooltip/tooltip'

const EmojisSwitch = ({
  showTooltip,
  onShowTooltip,
  // children,
  disable,
}: {
  showTooltip: boolean
  // children: ReactNode
  onShowTooltip: () => void
  disable?: boolean
}) => {
  const [showDisable, setShowDisable] = useState(false)
  return (
    // <div
    //   // className={`relative flex items-center leading-none ${
    //   //   showTooltip
    //   //     ? "before:content-[''] before:fixed before:z-50  before:block before:right-0 before:bottom-0 before:left-0 before:top-0 before:cursor-default"
    //   //     : ''
    //   // } `}
    //   onMouseOver={() => {
    //     if (disable) {
    //       setShowDisable(true)
    //     }
    //   }}
    //   onMouseOut={() => {
    //     if (disable) {
    //       setShowDisable(false)
    //     }
    //   }}
    // >
    <div
      className={`btn-reset-style relative p-1 rounded text-gray-500    
        ${disable ? 'bg-transparent text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-gray-700'}`}
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
        className={`material-icons-outlined select-none text-base leading-none 
    mix-blend-multiply `}
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
        direction="bottom"
      >
        不能對自己按讚
      </Tooltip>
    </div>
    // {/* {children} */}
    // </div>
  )
}

export default EmojisSwitch
