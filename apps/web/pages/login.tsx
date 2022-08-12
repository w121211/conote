import React, { useEffect } from 'react'
import Link from 'next/link'
import LoginPanel from '../frontend/components/auth/login-panel'
import LogoutButton from '../frontend/components/auth/logout-button'
import { StatusDisplay } from '../frontend/components/ui/status-display'
import { useMeContext } from '../frontend/components/auth/use-me-context'
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
      <StatusDisplay str="Login succesffuly!">
        <Link href="/">
          <a className="btn-primary-lg inline-block mr-6 font-medium ">
            Go to Home
          </a>
        </Link>
        <LogoutButton />
      </StatusDisplay>
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
