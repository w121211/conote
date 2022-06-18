import React, { useState } from 'react'
import Link from 'next/link'
import LoginPanel from '../components/auth/login-panel'
import LogoutButton from '../components/auth/logout-button'
import { StatusDisplay } from '../components/status-display'
import { useMeContext } from '../components/auth/use-me-context'

const Page = (): JSX.Element | null => {
  const { me, loading } = useMeContext()

  if (loading) {
    return null
  }
  if (me) {
    return (
      <StatusDisplay
        str="Login succesffuly!"
        btn={
          <>
            <Link href="/">
              <a className="btn-primary-lg inline-block mr-6 font-medium ">
                Go to Home
              </a>
            </Link>
            <LogoutButton />
          </>
        }
      />
    )
  }
  return (
    <div>
      <LoginPanel />
    </div>
  )
}

export default Page
