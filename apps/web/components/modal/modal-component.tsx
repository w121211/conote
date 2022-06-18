import React from 'react'
import CancelIcon from '../../assets/svg/cancel.svg'

export interface ModalComponentProps {
  children: React.ReactNode
  onClose: () => void
  subTitle?: string | React.ReactNode
  mask?: boolean
  buttons?: React.ReactNode
  topRightBtn?: React.ReactNode
  topLeftBtn?: React.ReactNode
  sectionClassName?: string
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  children,
  onClose,
  subTitle,
  mask,
  buttons,
  topRightBtn,
  topLeftBtn,
  sectionClassName,
}) => {
  return (
    <div
      className="fixed flex justify-center top-0 left-0 w-screen h-screen z-50"
      role="dialog"
    >
      <div
        className={`absolute w-full h-full  ${
          mask ? 'bg-gray-900/50' : 'bg-none'
        }`}
        onClick={e => {
          e.stopPropagation()
          onClose()
        }}
      ></div>

      <div
        className={`
        relative  
        flex flex-col 
        h-fit
        bg-white 
        
        mt-[5vh] 
        rounded  
        shadow-2xl 
       `}
      >
        {(topLeftBtn || subTitle || topRightBtn) && (
          <div
            className={`flex items-center justify-between w-full h-6 px-4 sm:h-8 ${
              sectionClassName ? sectionClassName : 'bg-transparent'
            }`}
          >
            <div className="flex items-center">
              {/* <span
              className="sm:hidden material-icons-outlined hover:cursor-pointer text-xl text-gray-500 hover:text-gray-700 leading-none"
              onClick={(e: any) => {
                e.stopPropagation()
                onClose()
              }}
            >
              close
            </span> */}
              {topLeftBtn}

              {subTitle && (
                <span className="ml-5 overflow-hidden whitespace-nowrap text-ellipsis text-gray-600">
                  {subTitle}
                </span>
              )}
            </div>
            {topRightBtn}
          </div>
        )}
        <section
          className={`flex scrollbar overflow-y-auto  
          w-[80vw] 
          
        sm:min-w-[20vw] 
        sm:max-w-[80vw] md:max-w-[65vw] lg:max-w-[600px]
        h-fit 
        max-h-[80vh] sm:max-h-[90vh]
      
         
       ${sectionClassName ? sectionClassName : ''}`}
        >
          <div className="flex-1 min-w-0 min-h-0">{children}</div>
        </section>
        {buttons && (
          <div className="flex items-center justify-center mb-4">{buttons}</div>
        )}
      </div>
    </div>
  )
}

ModalComponent.defaultProps = {
  mask: true,
}

export default ModalComponent
