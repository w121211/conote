import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const AccountPage = () => {
  const router = useRouter()
  const mode = router.query.mode
  // router.push({ pathname: '/login', query: { mode: 'login' } }, '/login')
  return (
    <div>
      Account
      {/* <Link href={{ pathname: '/account', query: { mode: 'login' } }} as="/login">
        <a>Login</a>
      </Link> */}
    </div>
  )
}

export default AccountPage
