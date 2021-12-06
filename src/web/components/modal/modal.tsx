import React, { HtmlHTMLAttributes, ReactNode, useContext } from 'react'
import { createPortal } from 'react-dom'
import Popover, { PopoverProps } from '../popover/popover'
import { ModalContext } from './modalContext'

const Modal = ({
  children,
  visible,
  onClose,
  subTitle,
}: {
  children: ReactNode
  visible: boolean
  onClose: () => void
} & Omit<PopoverProps, 'hideBoard'>): JSX.Element | null => {
  // const el= document.createElement('div')
  const modalRoot = useContext(ModalContext)
  if (modalRoot && visible) {
    return createPortal(
      <Popover hideBoard={onClose} subTitle={subTitle}>
        {children}
      </Popover>,
      modalRoot,
    )
  } else {
    return null
  }
}

export default Modal
