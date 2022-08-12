import React from 'react'
import ToggleMenu from '../ui/toggle-menu'

const OptionsMenu = ({ isMyPost }: { isMyPost: boolean }) => {
  return (
    <ToggleMenu
      className="flex flex-col justify-center items-center w-max left-full -translate-x-full py-1 text-gray-600"
      summary={
        <span className="material-icons-outlined p-1 rounded text-base leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          more_horiz
        </span>
      }
    >
      <>
        {isMyPost && (
          <button className="flex items-center  w-full px-3 py-1 text-xs hover:bg-gray-100 ">
            <span className="material-icons-outlined mr-[2px] text-base leading-none">
              edit
            </span>
            <p className="flex-shrink-0 ">編輯</p>
          </button>
        )}
        {!isMyPost && (
          <button className="flex items-center  w-full px-3 py-1 text-xs hover:bg-gray-100 ">
            <span className="material-icons-outlined mr-[2px] text-base leading-none">
              flag
            </span>
            <p className="flex-shrink-0 ">檢舉</p>
          </button>
        )}
        {isMyPost && (
          <button className="flex items-center  w-full px-3 py-1 text-xs text-red-500 hover:bg-gray-100 ">
            <span className="material-icons-outlined mr-[2px] text-base leading-none">
              delete
            </span>
            <p className="flex-shrink-0 ">刪除</p>
          </button>
        )}
      </>
    </ToggleMenu>
  )
}

export default OptionsMenu
