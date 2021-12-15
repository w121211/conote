import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import Modal from '../components/modal/modal'

const Account = () => {
  const router = useRouter()
  const mode = router.query.mode
  router.push({ pathname: '/login', query: { mode: 'login' } }, '/login')
  return (
    <div>
      {/* <Link href={{ pathname: '/account', query: { mode: 'login' } }} as="/login">
        <a>Login</a>
      </Link> */}
    </div>
  )
}

export default Account
