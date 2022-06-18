import Link from 'next/link'
import { useMeContext } from '../auth/use-me-context'

const UserLink = ({ userId }: { userId: string }) => {
  const { me } = useMeContext()
  return (
    <span>
      <Link href={`/user/${userId}`}>
        <a>@{userId.slice(-6)}</a>
      </Link>
      {me ? '(you)' : null}
    </span>
  )
}

export default UserLink
