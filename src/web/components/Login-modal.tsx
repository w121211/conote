import React, { ReactNode, useState } from 'react'
import { useMeQuery } from '../apollo/query.graphql'
import Modal from './modal/modal'

const LoginModal = ({ children }: { children: ReactNode }) => {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { data: meData, error, loading } = useMeQuery()
  return (
    <>
      <div
        onClick={() => {
          if (!meData) {
            setShowLoginModal(true)
          }
        }}
      >
        <div className={meData ? 'pointer-events-auto' : 'pointer-events-none'}>{children}</div>
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
