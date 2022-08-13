import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Modal from '../../modal/modal'
import DiscussModalPageEl from '../discuss-modal-page-el'

const DiscussModal = () => {
  const router = useRouter()
  // console.log(router.query)

  if (typeof router.query.discuss === 'string') {
    return (
      <Modal
        visible={
          router.query.discuss !== undefined &&
          typeof router.query.discuss === 'string'
        }
        onClose={() => {
          // setShowModal(false)
          router.push({
            pathname: router.pathname,
            query: { symbol: router.query.symbol },
          })
        }}
        topRightBtn={
          <Link
            href={{
              pathname: '/discuss/[discussId]',
              query: { discussId: router.query.discuss },
            }}
          >
            <a className="flex items-center text-sm text-gray-900 hover:text-gray-600">
              <span className="material-icons-outlined text-lg text-gray-500 hover:text-gray-700">
                open_in_full
              </span>
            </a>
          </Link>
        }
      >
        <div className="px-10">
          <DiscussModalPageEl id={router.query.discuss} />
        </div>
      </Modal>
    )
  }
  return null
}

export default DiscussModal
