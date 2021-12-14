import {
  BulletEmojiFragment,
  BulletEmojiLikeFragment,
  MyBulletEmojiLikeDocument,
  MyBulletEmojiLikeQuery,
  MyBulletEmojiLikeQueryVariables,
  useMyBulletEmojiLikeQuery,
  useUpsertBulletEmojiLikeMutation,
} from '../../apollo/query.graphql'
import EmojiIcon from './emoji-icon'
import classes from './emoji-up-down.module.scss'
// import Popup from '../popup/popup'

const BulletEmojiButton = ({
  emoji,
  className,
  iconClassName,
}: {
  emoji: BulletEmojiFragment
  className?: string
  iconClassName?: string
} & React.HTMLAttributes<HTMLElement>): JSX.Element | null => {
  const { data, loading, error } = useMyBulletEmojiLikeQuery({ variables: { bulletEmojiId: emoji.id } })
  const [upsertBulletEmojiLike, { error: upsertBulletEmojiError }] = useUpsertBulletEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.upsertBulletEmojiLike) {
        cache.writeQuery<MyBulletEmojiLikeQuery, MyBulletEmojiLikeQueryVariables>({
          query: MyBulletEmojiLikeDocument,
          variables: { bulletEmojiId: data.upsertBulletEmojiLike.like.bulletEmojiId },
          data: { myBulletEmojiLike: data.upsertBulletEmojiLike.like },
        })
      }
    },
    onError(error) {
      console.log(error.message)
    },
  })

  const onLikeBulletEmoji = (myLike: BulletEmojiLikeFragment | null) => {
    if (myLike && myLike.choice === 'UP') {
      upsertBulletEmojiLike({
        variables: {
          bulletEmojiId: emoji.id,
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myLike && myLike.choice !== 'UP') {
      upsertBulletEmojiLike({
        variables: {
          bulletEmojiId: emoji.id,
          data: { choice: 'UP' },
        },
      })
    }
    if (myLike === null) {
      upsertBulletEmojiLike({
        variables: {
          bulletEmojiId: emoji.id,
          data: { choice: 'UP' },
        },
      })
    }
  }

  if (loading) {
    return null
  }
  if (error || upsertBulletEmojiError || data === undefined) {
    console.log(error)
    return <p>Unexpected error</p>
  }
  return (
    <button
      className={`noStyle ${classes.bulletEmojiDefaultBtn} ${className ? className : ''} `}
      onClick={e => {
        e.stopPropagation()
        onLikeBulletEmoji(data.myBulletEmojiLike ?? null)
      }}
    >
      <EmojiIcon
        code={emoji.code}
        nUps={emoji.count.nUps}
        liked={data && data.myBulletEmojiLike?.choice === 'UP'}
        className={iconClassName}
      />
    </button>
  )
}

export default BulletEmojiButton
