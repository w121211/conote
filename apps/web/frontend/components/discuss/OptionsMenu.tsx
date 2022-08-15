import React from 'react'
import ToggleMenu from '../ui/toggle-menu'

type Props = {
  isMeOwner: boolean
  // onClickDelete: () => void
  onClickEdit: () => void
  // onClickReport: () => void
}

const OptionsMenu = ({
  isMeOwner,
  // onClickDelete,
  onClickEdit,
}: // onClickReport,
Props) => {
  return (
    <ToggleMenu
      className="flex flex-col justify-center items-center w-max left-full -translate-x-full py-1 text-gray-600"
      summary={
        <span className="material-icons-outlined p-1 rounded text-base leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          more_horiz
        </span>
      }
    >
      {isMeOwner && (
        <button
          className="flex items-center  w-full px-3 py-1 text-xs hover:bg-gray-100"
          onClick={() => onClickEdit()}
        >
          <span className="material-icons-outlined mr-[2px] text-base leading-none">
            edit
          </span>
          <span className="flex-shrink-0">Edit</span>
        </button>
      )}
      {/* {!isMeOwner && (
          <button
            className="flex items-center  w-full px-3 py-1 text-xs hover:bg-gray-100"
            onClick={() => onClickReport()}
          >
            <span className="material-icons-outlined mr-[2px] text-base leading-none">
              flag
            </span>
            <span className="flex-shrink-0">Report</span>
          </button>
        )} */}
      {/* {isMeOwner && (
        <button
          className="flex items-center  w-full px-3 py-1 text-xs text-red-500 hover:bg-gray-100"
          onClick={() => onClickDelete()}
        >
          <span className="material-icons-outlined mr-[2px] text-base leading-none">
            delete
          </span>
          <span className="flex-shrink-0">Delete</span>
        </button>
      )} */}
    </ToggleMenu>
  )
}

export default OptionsMenu
