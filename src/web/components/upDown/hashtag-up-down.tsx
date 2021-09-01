import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  useMyHashtagLikeQuery,
  useCreateHashtagLikeMutation,
  useUpdateHashtagLikeMutation,
  MyHashtagLikeQuery,
  MyHashtagLikeQueryVariables,
  MyHashtagLikeDocument,
  LikeChoice,
  HashtagsDocument,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import { hashtagTextToIcon } from '../../pages/card/[symbol]'
import classes from './upDown.module.scss'

const HashtagUpDown = ({
  // choice,
  // commentId,
  // bulletId,
  hashtagId,
  children,
  text,
}: {
  // choice: CommentCount | BulletCount
  // commentId?: string
  // bulletId?: string
  hashtagId: number
  children?: React.ReactNode
  text: string
}) => {
  const router = useRouter()
  const symbol = router.query['symbol'] as string
  const { data, loading, error } = useMyHashtagLikeQuery({
    variables: { hashtagId },
  })

  const [createHashtagLike] = useCreateHashtagLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.createHashtagLike) {
        cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
          query: MyHashtagLikeDocument,
          variables: { hashtagId: data.createHashtagLike.like.hashtagId },
          data: { myHashtagLike: data.createHashtagLike.like },
        })
      }
    },
    refetchQueries: [{ query: HashtagsDocument, variables: { symbol } }],
  })
  const [updateHashtagLike] = useUpdateHashtagLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.updateHashtagLike) {
        cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
          query: MyHashtagLikeDocument,
          variables: { hashtagId: data.updateHashtagLike.like.hashtagId },
          data: { myHashtagLike: data.updateHashtagLike.like },
        })
      }
    },
    refetchQueries: [{ query: HashtagsDocument, variables: { symbol } }],
  })

  function handleClickLike(choice: LikeChoice) {
    if (data === undefined) {
      return
    }
    const { myHashtagLike } = data
    if (myHashtagLike && myHashtagLike.choice === choice) {
      updateHashtagLike({
        variables: {
          id: myHashtagLike.id,
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myHashtagLike && myHashtagLike.choice !== choice) {
      updateHashtagLike({
        variables: {
          id: myHashtagLike.id,
          data: { choice },
        },
      })
    }
    if (myHashtagLike === null) {
      createHashtagLike({
        variables: {
          hashtagId: hashtagId.toString(),
          data: { choice },
        },
      })
    }
  }
  if (loading) {
    return null
  }
  if (error || data === undefined) {
    return <div>Error</div>
  }
  return (
    <>
      <button
        className={`${classes.button} ${data.myHashtagLike?.choice === 'UP' && classes.clicked}`}
        onClick={() => {
          handleClickLike('UP')
        }}
      >
        {hashtagTextToIcon(text)}{' '}
      </button>
      {/* <button
        onClick={() => {
          handleClickLike('UP')
        }}
      >
        {data.myHashtagLike?.choice === 'UP' ? 'up*' : 'up'}
      </button>
      <button
        onClick={() => {
          handleClickLike('DOWN')
        }}
      >
        {data.myHashtagLike?.choice === 'DOWN' ? 'down*' : 'down'}
      </button> */}
    </>
  )
}

export default HashtagUpDown
