import React, { ReactNode, useContext } from 'react'
import { createPortal } from 'react-dom'
import Popover, { PopoverProps } from '../popover'
import { ModalContext } from './modal-context'

const Modal = ({
  children,
  visible,
  onClose,
  subTitle,
  buttons,
  topRightBtn,
  mask,
  topLeftBtn,
  sectionClassName,
}: {
  children: ReactNode
  visible: boolean
  onClose: () => void
} & Omit<PopoverProps, 'hideBoard'>): JSX.Element | null => {
  // const el= document.createElement('div')
  const modalRoot = useContext(ModalContext)
  if (modalRoot && visible) {
    return createPortal(
      <Popover
        onClose={onClose}
        subTitle={subTitle}
        buttons={buttons}
        topRightBtn={topRightBtn}
        mask={mask}
        topLeftBtn={topLeftBtn}
        sectionClassName={sectionClassName}
      >
        {children}
      </Popover>,
      modalRoot,
    )
  } else {
    return null
  }
}

export default Modal
