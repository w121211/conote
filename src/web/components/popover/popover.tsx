import React from 'react'
import CancelIcon from '../../assets/svg/cancel.svg'

export interface PopoverProps {
  children: React.ReactNode
  hideBoard: () => void
  subTitle?: string | React.ReactNode
  mask?: boolean
  buttons?: React.ReactNode
  topRightBtn?: React.ReactNode
}

const Popover = ({ children, hideBoard, subTitle, mask, buttons, topRightBtn }: PopoverProps): JSX.Element | null => {
  // console.log(mask)

  return (
    <div className="fixed flex justify-center top-0 left-0 w-screen h-screen z-50" role="dialog">
      <div
        className={`absolute w-full h-full  ${mask ? 'bg-gray-900/50' : 'bg-none'}`}
        onClick={e => {
          e.stopPropagation()
          hideBoard()
        }}
      ></div>

      <div className="relative  flex flex-col w-[90vw] h-fit max-h-[70vh] sm:w-fit sm:min-w-[20vw] sm:max-w-[60vw] sm:max-h-[80vh] mt-[5vh] px-4 py-2  rounded bg-white shadow-2xl">
        <div className="flex items-center justify-between w-full h-8 bg-white">
          <div>
            <span
              className="material-icons-outlined hover:cursor-pointer hover:text-gray-600"
              onClick={(e: any) => {
                e.stopPropagation()
                hideBoard()
              }}
            >
              close
            </span>

            {subTitle && (
              <span className="ml-5 overflow-hidden whitespace-nowrap text-ellipsis text-gray-600">{subTitle}</span>
            )}
          </div>
          {topRightBtn}
        </div>
        <div className="overflow-y-auto mt-2 px-8 pb-8">{children}</div>
        {buttons && <div className="flex items-center justify-center mb-4">{buttons}</div>}
      </div>
    </div>
  )
}

Popover.defaultProps = {
  mask: true,
  center: false,
}

export default Popover
