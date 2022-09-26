import React, { ReactNode, useState } from 'react'
import { getLoginPageURL } from '../../utils'
import Modal from '../modal/modal'
import { useMeContext } from './use-me-context'

const LoginRequireModal = ({ children }: { children?: ReactNode }) => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { me } = useMeContext()

  return (
    <>
      <div
        onClick={() => {
          if (!me) setShowLoginModal(true)
        }}
      >
        <div className={me ? 'pointer-events-auto' : 'pointer-events-none'}>
          {children}
        </div>
      </div>
      <Modal
        sectionClassName="!w-fit"
        visible={showLoginModal}
        buttons={
          <button className="btn-primary">
            <a href={getLoginPageURL()}>Login</a>
          </button>
        }
        onClose={() => setShowLoginModal(false)}
      >
        <div className="w-[200px] py-8 text-center">Login to proceed</div>
      </Modal>
    </>
  )
}

export default LoginRequireModal
