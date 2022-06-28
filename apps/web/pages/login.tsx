import React, { useEffect } from 'react'
import Link from 'next/link'
import LoginPanel from '../components/auth/login-panel'
import LogoutButton from '../components/auth/logout-button'
import { StatusDisplay } from '../components/status-display'
import { useMeContext } from '../components/auth/use-me-context'
import { useRouter } from 'next/router'

const Page = (): JSX.Element | null => {
  const { me, loading } = useMeContext()
  const router = useRouter()

  // useEffect(() => {
  //   if (typeof router.query.from === 'string') {
  //     location.assign(router.query.from)
  //   }
  // }, [router])

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
      <LoginPanel
        redirectPathAfterLogin={
          typeof router.query.from === 'string' ? router.query.from : undefined
        }
      />
    </div>
  )
}

export default Page
