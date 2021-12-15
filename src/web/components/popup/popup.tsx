import React from 'react'
import CancelIcon from '../../assets/svg/cancel.svg'

const Popup = ({
  children,
  visible,
  hideBoard,
  subTitle,
  mask,
  buttons,
  noMask,
}: // center
// width,
{
  children: React.ReactNode
  visible: boolean
  hideBoard: () => void
  subTitle?: string
  mask?: boolean
  buttons?: React.ReactNode
  noMask?: boolean
  // center?:boolean
  // width?: number
}): JSX.Element => {
  // console.log(mask)
  return (
    <div
      className="fixed flex items-center justify-center w-screen h-screen top-0 left-0 z-50"
      style={{
        visibility: `${visible ? 'visible' : 'hidden'}`,
        width: `${noMask ? 'fit-content' : '100vw'}`,
        height: `${noMask ? 'fit-content' : '100vh'}`,
        // width: `${typeof width === 'number' ? width + 'px' : 'initial'}`,
      }}
    >
      {!noMask && (
        <div
          className={`absolute w-full h-full  ${mask ? 'bg-gray-500/50' : 'bg-none'}`}
          onClick={e => {
            // e.preventDefault()
            e.stopPropagation()
            hideBoard()
          }}
        ></div>
      )}

      <div className="absolute flex flex-col w-[90vw] max-h-[70vh] sm:w-[60vw] sm:max-h-[90vh] mt-[5vh] p-6 pt-2 overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center w-full h-8">
          <span
            onClick={(e: any) => {
              e.stopPropagation()
              hideBoard()
            }}
          >
            <CancelIcon className="flex items-center justify-center w-4 h-4" />
          </span>
          <span className="ml-5 overflow-hidden whitespace-nowrap text-ellipsis text-gray-600">
            {subTitle && subTitle}{' '}
          </span>
        </div>
        <div className="my-3 mx-auto">{children}</div>
        {buttons && <div className="flex justify-center">{buttons}</div>}
      </div>
    </div>
  )
}

Popup.defaultProps = {
  mask: true,
  noMask: false,
  // center:false
}

export default Popup
