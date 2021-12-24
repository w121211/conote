import React from 'react'
import CancelIcon from '../../assets/svg/cancel.svg'

export interface PopoverProps {
  children: React.ReactNode
  hideBoard: () => void
  subTitle?: string
  mask?: boolean
  buttons?: React.ReactNode
  center?: boolean
}

const Popover = ({
  children,

  hideBoard,
  subTitle,
  mask,
  buttons,
  center,
}: PopoverProps): JSX.Element | null => {
  // console.log(mask)

  return (
    <div className="fixed flex justify-center top-0 left-0 w-screen h-screen z-50">
      <div
        className={`w-full h-full  ${mask ? 'bg-gray-500/50' : 'bg-none'}`}
        onClick={e => {
          e.stopPropagation()
          hideBoard()
        }}
      ></div>

      <div className="absolute flex flex-col w-[90vw] max-h-[70vh] sm:w-fit sm:max-h-[90vh] mt-[5vh] px-4 py-2 overflow-y-auto rounded bg-white shadow-2xl">
        <div className="flex items-center w-full h-8">
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
        <div className="pt-2 px-8 pb-8">{children}</div>
        {buttons && <div className="flex">{buttons}</div>}
      </div>
    </div>
  )
}

Popover.defaultProps = {
  mask: true,
  center: false,
}

export default Popover
