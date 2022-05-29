import React, { ReactNode, useState } from 'react'
import { useMe } from './auth/use-me'
import Modal from './modal/modal'

const LoginModal = ({ children }: { children: ReactNode }) => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { me, loading } = useMe()
  // const { data: meData, error, loading } = useMeQuery()
  return (
    <>
      <div
        onClick={() => {
          if (!me) {
            setShowLoginModal(true)
          }
        }}
      >
        <div className={me ? 'pointer-events-auto' : 'pointer-events-none'}>
          {children}
        </div>
      </div>
      <Modal
        visible={showLoginModal}
        buttons={
          <button className="btn-primary">
            <a href="/login">Login</a>
          </button>
        }
        onClose={() => setShowLoginModal(false)}
      >
        <div className="text-center">請先登入!</div>
      </Modal>
    </>
  )
}

export default LoginModal
