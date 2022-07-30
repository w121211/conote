import Link from 'next/link'
import { useMeContext } from '../auth/use-me-context'

const UserLink = ({ userId }: { userId: string }) => {
  const { me } = useMeContext()
  return (
    <span>
      <Link href={`/user/${userId}`}>
        <a className="link">@{userId.slice(-6)}</a>
      </Link>
      {me && me.id === userId ? '(you)' : null}
    </span>
  )
}

export default UserLink
