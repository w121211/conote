import React, { useState } from 'react'
import {
  BulletEmojiFragment,
  BulletEmojiLikeFragment,
  MyBulletEmojiLikeDocument,
  MyBulletEmojiLikeQuery,
  MyBulletEmojiLikeQueryVariables,
  useMyBulletEmojiLikeQuery,
  useUpsertBulletEmojiLikeMutation,
} from '../../apollo/query.graphql'
import Modal from '../modal/modal'
import EmojiIcon from './emoji-icon'
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
  const [showLoginModal, setShowLoginModal] = useState(false)
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
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(e => {
          if (e.extensions.code === 'UNAUTHENTICATED') {
            setShowLoginModal(true)
          }
        })
      }

      console.log(error.graphQLErrors)
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

  return (
    <>
      <button
        className={`btn-reset-style flex ${className ? className : ''} `}
        onClick={e => {
          e.stopPropagation()
          onLikeBulletEmoji(data?.myBulletEmojiLike ?? null)
        }}
      >
        <EmojiIcon
          code={emoji.code}
          nUps={emoji.count.nUps}
          liked={data && data.myBulletEmojiLike?.choice === 'UP'}
          className={iconClassName}
        />
      </button>
      <Modal visible={showLoginModal} onClose={() => setShowLoginModal(false)}>
        請先登入
      </Modal>
    </>
  )
}

export default BulletEmojiButton
