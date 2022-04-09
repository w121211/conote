import LoginPanel from '../../components/auth/login-panel'
import LogoutButton from '../../components/auth/logout-button'
import { useMe } from '../../components/auth/use-me'

const Page = (): JSX.Element | null => {
  const { me, loading } = useMe()

  if (loading) {
    return null
  }
  if (me) {
    return (
      <div>
        <div>You are logged In</div>
        <LogoutButton />
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
