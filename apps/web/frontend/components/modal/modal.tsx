import React, { useContext } from 'react'
import { createPortal } from 'react-dom'
import ModalComponent, { ModalComponentProps } from './modal-component'
import { ModalContext } from './modal-context'

interface ModalProps extends ModalComponentProps {
  visible: boolean
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({
  children,
  visible,
  onClose,
  subTitle,
  buttons,
  topRightBtn,
  mask,
  topLeftBtn,
  sectionClassName,
}) => {
  // const el= document.createElement('div')
  const modalRoot = useContext(ModalContext)

  if (modalRoot && visible) {
    return createPortal(
      <ModalComponent
        onClose={onClose}
        subTitle={subTitle}
        buttons={buttons}
        topRightBtn={topRightBtn}
        mask={mask}
        topLeftBtn={topLeftBtn}
        sectionClassName={sectionClassName}
      >
        {children}
      </ModalComponent>,
      modalRoot,
    )
  }
  return null
}

export default Modal
