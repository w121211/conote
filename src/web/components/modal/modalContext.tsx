import React, { useEffect, useRef, useState } from 'react'
import Modal from './modal'
import useModal from './useModal'

export const ModalContext = React.createContext<any>(null)
const { Provider } = ModalContext

const ModalProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [context, setContext] = useState<HTMLElement | null>()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setContext(modalRef.current)
  }, [])

  return (
    <>
      <Provider value={context}>{children}</Provider>
      <div ref={modalRef}></div>
    </>
  )
}

export default ModalProvider
