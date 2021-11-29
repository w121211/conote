// import { BulletLike } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
  BulletEmoji,
  BulletEmojisDocument,
  BulletEmojisQuery,
  BulletEmojisQueryVariables,
  EmojiCode,
  LikeChoice,
  MyBulletEmojiLikeDocument,
  MyBulletEmojiLikeQuery,
  MyBulletEmojiLikeQueryVariables,
  useBulletEmojisQuery,
  useCreateBulletEmojiMutation,
  useMyBulletEmojiLikeLazyQuery,
  useMyBulletEmojiLikeQuery,
  useUpsertBulletEmojiLikeMutation,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import Popup from '../popup/popup'
import EmojiCodeToIcon from './emoji-text-to-icon'
import classes from './emoji-up-down.module.scss'

function emojiToChinese(emojiCode?: string) {
  if (!emojiCode) {
    return ''
  }
  switch (emojiCode) {
    case 'PIN': {
      return '收藏'
    }
    case 'UP': {
      return '讚'
    }
    case 'DOWN': {
      return '倒讚'
    }
  }
}

const BulletEmojiBtn = ({
  // choice,
  bulletId,
  // children,
  // foundEmoji,
  emojiCode,
  // onEmojiCreated,
  className,
  bulletEmojis,
  count,
  showText,
  iconClass,
}: {
  // choice: CommentCount | BulletCount
  // commentId?: string
  className?: string
  bulletId: string
  children?: React.ReactNode
  bulletEmojis?: BulletEmoji
  // foundEmoji?: BulletEmoji
  emojiCode: EmojiCode
  count?: number
  showText?: boolean
  iconClass?: string
  // onEmojiCreated: (emoji: Emoji, myEmojiLike: EmojiLike) => void
} & React.HTMLAttributes<HTMLElement>): JSX.Element => {
  const [myChoice, setMyChoice] = useState<any>()
  const { refetch: refetchBulletEmojis } = useBulletEmojisQuery({
    fetchPolicy: 'network-only',
    skip: true,
    variables: { bulletId },
  })
  const [createBulletEmoji, { error: createBulletEmojiError }] = useCreateBulletEmojiMutation({
    // variables: { bulletId, emojiText },

    // TODO: 避免使用 @see https://www.apollographql.com/blog/apollo-client/caching/when-to-use-refetch-queries/
    update(cache, { data }) {
      const res = cache.readQuery<BulletEmojisQuery>({
        query: BulletEmojisDocument,
      })
      if (res?.bulletEmojis && data?.createBulletEmoji) {
        cache.writeQuery<BulletEmojisQuery, BulletEmojisQueryVariables>({
          query: BulletEmojisDocument,
          variables: { bulletId },
          data: { bulletEmojis: res.bulletEmojis.concat(data.createBulletEmoji.emoji) },
        })
      }
      if (!res?.bulletEmojis && data?.createBulletEmoji) {
        refetchBulletEmojis()
      }
    },
    onError(error) {
      console.log(error.message)
    },
    // refetchQueries: _ => [{ query: BulletEmojisDocument, variables: { bulletId } }],
  })
  const [upsertBulletEmojiLike, { error: upsertBulletEmojiError }] = useUpsertBulletEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      const res = cache.readQuery<BulletEmojisQuery>({
        query: BulletEmojisDocument,
      })
      // if (res?.bulletEmojis && data?.upsertBulletEmojiLike) {
      //   const findIndex = res.bulletEmojis.findIndex(e => e.id === data.upsertBulletEmojiLike.like.bulletEmojiId)
      //   let findEmoji= res.bulletEmojis.find(e => e.id === data.upsertBulletEmojiLike.like.bulletEmojiId)

      //   cache.writeQuery<BulletEmojisQuery, BulletEmojisQueryVariables>({
      //     query: BulletEmojisDocument,
      //     variables: { bulletId },
      //     data: { bulletEmojis: res.bulletEmojis },
      //   })
      // }
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

  const {
    data: myBulletEmojiData,
    loading,
    error,
  } = useMyBulletEmojiLikeQuery(bulletEmojis ? { variables: { bulletEmojiId: bulletEmojis?.id } } : { skip: true })

  // const handleMyChoice = () => {
  //   if (commentId) {
  //     return myCommentLikeData?.myCommentLikes.find(e => e.commentId === parseInt(commentId))
  //   }
  //   // if (bulletId) {
  //   //   return myBulletLikeData?.myBulletLikes.find(e => e.bulletId === parseInt(bulletId))
  //   // }
  //   return undefined
  // }
  // useEffect(() => {
  //   const res = handleMyChoice()
  //   setMyChoice(res)
  // }, [myCommentLikeData, myBulletLikeData])

  const handleLike = (choice: LikeChoice = 'UP') => {
    // if (bulletId) {
    // const findEmoji = emoji?.find(el => el.text === e.emojiText)
    //   console.log(findEmoji?.id)
    if (bulletEmojis) {
      const myLike = myBulletEmojiData?.myBulletEmojiLike
      if (myLike && myLike.choice === choice) {
        upsertBulletEmojiLike({
          variables: {
            bulletEmojiId: bulletEmojis.id,
            data: { choice: 'NEUTRAL' },
          },
        })
      }
      if (myLike && myLike.choice !== choice) {
        upsertBulletEmojiLike({
          variables: {
            bulletEmojiId: bulletEmojis.id,
            data: { choice },
          },
        })
      }
      if (myLike === null) {
        upsertBulletEmojiLike({
          variables: {
            bulletEmojiId: bulletEmojis.id,
            data: { choice },
          },
        })
      }
      // upsertEmojiLike({variables:{hashtagId:foundEmoji.id,data:{choice:}}})
    } else {
      createBulletEmoji({ variables: { bulletId, code: emojiCode } })
    }
    // }
  }
  // if (createBulletEmojiError || upsertBulletEmojiError) {
  //   if (
  //     createBulletEmojiError?.graphQLErrors.find(e => e.extensions.code === 'UNAUTHENTICATED') ||
  //     upsertBulletEmojiError?.graphQLErrors.find(e => e.extensions.code === 'UNAUTHENTICATED')
  //   )
  //     return (
  //       <Popup
  //         visible={true}
  //         hideBoard={() => {
  //           //
  //         }}
  //       >
  //         尚未登入
  //       </Popup>
  //     )
  // }

  return (
    <>
      <button
        className={`noStyle ${classes.bulletEmojiDefaultBtn} ${className ? className : ''} `}
        onClick={e => {
          e.stopPropagation()
          handleLike()
        }}
        // style={{ width: '100%' }}
      >
        {/* <span className={classes.upDownWrapper}> */}

        <>
          <EmojiCodeToIcon
            customClass={iconClass ? iconClass : ''}
            emojiCode={emojiCode}
            count={count}
            liked={myBulletEmojiData && myBulletEmojiData?.myBulletEmojiLike?.choice === 'UP'}
            text={showText ? emojiToChinese(emojiCode) : ''}
          />
          {/* {showText && emojiToChinese(emojiCode)} */}
        </>
      </button>
      {/* {(createBulletEmojiError?.graphQLErrors.find(e => e.extensions.code === 'UNAUTHENTICATED') ||
        upsertBulletEmojiError?.graphQLErrors.find(e => e.extensions.code === 'UNAUTHENTICATED')) && (
        <Popup
          visible={true}
          hideBoard={() => {
            //
          }}
        >
          尚未登入
        </Popup>
      )} */}
    </>
  )
}

export default BulletEmojiBtn
