import React, { ReactNode, useState } from 'react'
import { useMe } from './auth/use-me'
import Modal from './modal/modal'

const LoginModal = ({ children }: { children?: ReactNode }) => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { me } = useMe()
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
            <a href="/login">Login</a>
          </button>
        }
        onClose={() => setShowLoginModal(false)}
      >
        <div className="w-[200px] py-8 text-center">Login to proceed</div>
      </Modal>
    </>
  )
}

export default LoginModal
