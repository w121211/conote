import Link from 'next/link'
import { useMe } from '../auth/use-me'

const UserLink = ({ userId }: { userId: string }) => {
  const { me } = useMe()
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
