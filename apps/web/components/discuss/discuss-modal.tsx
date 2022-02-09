import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Discuss from './discuss'
import Modal from '../modal/modal'

const DiscussModal = () => {
  const router = useRouter()
  return (
    <Modal
      visible={router.query.discuss !== undefined && typeof router.query.discuss === 'string'}
      onClose={() => {
        // setShowModal(false)
        router.push({ pathname: router.pathname, query: { symbol: router.query.symbol } })
      }}
      topRightBtn={
        <Link href={{ pathname: '/discuss/[discussId]', query: { discussId: router.query.discuss } }}>
          <a className="flex items-center text-sm text-gray-900 hover:text-gray-600">
            <span className="material-icons text-lg text-gray-500 hover:text-gray-700">open_in_full</span>
          </a>
        </Link>
      }
    >
      <Discuss title={router.query.discuss as string} />
    </Modal>
  )
}

export default DiscussModal
