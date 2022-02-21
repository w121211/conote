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

      <div
        className="relative  flex flex-col h-fit py-2 rounded bg-white shadow-2xl 
        w-[90vw] max-h-[90vh] sm:min-w-[20vw] sm:max-w-[80vw] sm:max-h-[90vh] mt-[5vh] 
      md:max-w-[65vw] lg:max-w-[55vw]"
      >
        <div className="flex items-center justify-between w-full h-6 px-4 sm:h-8 bg-white">
          <div className="flex items-center">
            <span
              className="sm:hidden material-icons-outlined hover:cursor-pointer text-gray-500 hover:text-gray-700 leading-none"
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
        <div className="scrollbar flex overflow-y-scroll mb-4 pl-4 pr-2 4md:px-9 lg:pl-[calc(3rem_+_10px)] lg:pr-12 sm:mb-8">
          <div className="flex-1 min-w-0">{children}</div>
        </div>
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
