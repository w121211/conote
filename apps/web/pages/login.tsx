import React, { useState } from 'react'
import Link from 'next/link'
import LoginPanel from '../components/auth/login-panel'
import LogoutButton from '../components/auth/logout-button'
import { useMe } from '../components/auth/use-me'

const Page = (): JSX.Element | null => {
  const { me, loading } = useMe()

  if (loading) {
    return null
  }
  if (me) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <section className="text-center mx-6 lg:w-2/3">
          <h1 className="mt-2 mb-3 text-2xl lg:text-3xl">Login succesffuly!</h1>
          <div>
            <Link href="/">
              <a className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Go to Home
              </a>
            </Link>
            <LogoutButton />
          </div>
        </section>
      </div>
    )
  }
  return (
    <div>
      <LoginPanel />
    </div>
  )
}

export default Page
