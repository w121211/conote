import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
  useMyEmojiLikeQuery,
  // useCreateHashtagLikeMutation,
  // useUpdateHashtagLikeMutation,
  MyEmojiLikeQuery,
  MyEmojiLikeQueryVariables,
  MyEmojiLikeDocument,
  LikeChoice,
  EmojisDocument,
  Emoji,
} from '../../apollo/query.graphql'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import classes from './upDown.module.scss'
// import { Hashtag, HashtagGroup } from '../../lib/hashtag/types'
import EmojiTextToIcon from './emoji-text-to-icon'
import MyEmojiGroup from './poll-group'

const hashtagTextToIcon = (emoji: Emoji): JSX.Element | null => {
  if (emoji) {
    switch (emoji.text) {
      case '#pin':
        return <PinIcon width="1em" height="1em" />
      case '#up':
        return <UpIcon width="1em" height="1em" />
      case '#down':
        return <UpIcon width="1em" height="1em" style={{ transform: 'rotate(180deg)' }} />
    }
  }

  // if (emoji.type === 'emoji-group') {
  //   const newText = emoji.text.substring(1, emoji.text.length - 1)
  //   const textArr = newText.split(' ')
  //   return (
  //     <>
  //       {textArr.map((e, i) => {
  //         //first child
  //         if (i === 0) {
  //           return (
  //             <span
  //               key={i}
  //               onClick={ev => {
  //                 ev.stopPropagation()
  //                 // console.log(e)
  //               }}
  //             >
  //               {e}
  //             </span>
  //           )
  //         }
  //         //others
  //         return (
  //           <span
  //             className={classes.HashtagGroupChildren}
  //             key={i}
  //             onClick={ev => {
  //               ev.stopPropagation()
  //               // console.log(e)
  //             }}
  //           >
  //             {e}
  //           </span>
  //         )
  //       })}
  //     </>
  //   )
  // }
  return <span>{emoji.text}</span>
}

// const HashtagUpDown = ({
//   // choice,
//   // commentId,
//   // bulletId,
//   hashtag,
//   children,
//   // text,
//   inline,
// }: {
//   // choice: CommentCount | BulletCount
//   // commentId?: string
//   // bulletId?: string
//   hashtag: Hashtag | HashtagGroup
//   children?: React.ReactNode
//   // text: string
//   inline?: boolean
// }): JSX.Element => {
//   const router = useRouter()
//   const symbol = router.query['symbol'] as string
//   const { data, loading, error } = useMyHashtagLikeQuery({
//     variables: { hashtagId: typeof hashtag.id === 'string' ? parseInt(hashtag.id) : hashtag.id },
//   })

//   const [createHashtagLike] = useCreateHashtagLikeMutation({
//     update(cache, { data }) {
//       // TODO: 這裡忽略了更新 count
//       if (data?.createHashtagLike) {
//         cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
//           query: MyHashtagLikeDocument,
//           variables: { hashtagId: data.createHashtagLike.like.hashtagId },
//           data: { myHashtagLike: data.createHashtagLike.like },
//         })
//       }
//     },
//     // refetchQueries: [{ query: HashtagsDocument, variables: { symbol } }],
//   })
//   const [updateHashtagLike] = useUpdateHashtagLikeMutation({
//     update(cache, { data }) {
//       // TODO: 這裡忽略了更新 count
//       if (data?.updateHashtagLike) {
//         cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
//           query: MyHashtagLikeDocument,
//           variables: { hashtagId: data.updateHashtagLike.like.hashtagId },
//           data: { myHashtagLike: data.updateHashtagLike.like },
//         })
//       }
//     },
//     // refetchQueries: [{ query: HashtagsDocument, variables: { symbol } }],
//   })

//   function handleClickLike(choice: LikeChoice) {
//     if (data === undefined) {
//       return
//     }
//     const { myHashtagLike } = data
//     if (myHashtagLike && myHashtagLike.choice === choice) {
//       updateHashtagLike({
//         variables: {
//           id: myHashtagLike.id,
//           data: { choice: 'NEUTRAL' },
//         },
//       })
//     }
//     if (myHashtagLike && myHashtagLike.choice !== choice) {
//       updateHashtagLike({
//         variables: {
//           id: myHashtagLike.id,
//           data: { choice },
//         },
//       })
//     }
//     if (myHashtagLike === null) {
//       createHashtagLike({
//         variables: {
//           hashtagId: typeof hashtag.id === 'string' ? hashtag.id : hashtag.id.toString(),
//           data: { choice },
//         },
//       })
//     }
//   }
//   // if (loading) {
//   //   return <span>Loading...</span>
//   // }
//   // if (error || data === undefined) {
//   //   return <div>Error</div>
//   // }
//   return (
//     // <div>
//     <>
//       {hashtag.type === 'hashtag' ? (
//         <button
//           className={`${classes.button} ${inline && 'inline'} ${
//             data?.myHashtagLike?.choice === 'UP' && classes.clicked
//           }`}
//           onClick={() => {
//             handleClickLike('UP')
//           }}
//         >
//           <HashtagTextToIcon hashtag={hashtag} />
//         </button>
//       ) : (
//         // <button
//         //   className={`${classes.button} ${inline && 'inline'} ${
//         //     data?.myHashtagLike?.choice === 'UP' && classes.clicked
//         //   }`}
//         // onClick={() => {
//         //   // handleClickLike('UP')
//         //   console.log('group')
//         // }}
//         // >
//         <MyHashtagGroup
//           className={`${classes.button} ${inline && 'inline'} ${
//             data?.myHashtagLike?.choice === 'UP' && classes.clicked
//           }`}
//           hashtag={hashtag}
//         />
//         // {/* </button> */}
//       )}
//     </>
//     //   {/* <button
//     //     onClick={() => {
//     //       handleClickLike('UP')
//     //     }}
//     //   >
//     //     {data.myHashtagLike?.choice === 'UP' ? 'up*' : 'up'}
//     //   </button>
//     //   <button
//     //     onClick={() => {
//     //       handleClickLike('DOWN')
//     //     }}
//     //   >
//     //     {data.myHashtagLike?.choice === 'DOWN' ? 'down*' : 'down'}
//     //   </button> */}
//     // {/* </div> */}
//   )
// }

// export default HashtagUpDown
