import React from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  BulletEmojiFragment,
  MyCardEmojiLikeDocument,
  MyCardEmojiLikeQuery,
  MyCardEmojiLikeQueryVariables,
  useBulletEmojisQuery,
  useCardEmojisQuery,
  useMyCardEmojiLikeQuery,
  useUpsertCardEmojiLikeMutation,
} from '../../apollo/query.graphql'
import BulletEmojiBtn from './bullet-emoji-btn'
import EmojiTextToIcon from './emoji-text-to-icon'

import classes from './emoji-up-down.module.scss'

interface DefaultEmojs {
  emojiCode: EmojiCode
  text: string
}

const defaultEmojis: DefaultEmojs[] = [
  {
    // icon: <span className="material-icons-outlined">favorite_border</span>,
    emojiCode: 'PIN',
    text: 'Pin',
  },
  {
    // icon: <UpIcon />,
    emojiCode: 'UP',
    text: 'Up',
  },
  {
    // icon: <UpIcon style={{ transform: 'rotate(180deg)' }} />,
    emojiCode: 'DOWN',
    text: 'Down',
  },
]

// export const BulletEmojiDisplay = ({ bulletEmoji }: { bulletEmoji: BulletEmoji }): JSX.Element | null => {
//   const {
//     data: myEmojiLikeData,
//     loading,
//     error,
//   } = useMyCardEmojiLikeQuery({
//     variables: { cardEmojiId: bulletEmoji.id },
//   })

//   if (bulletEmoji.count.nUps === 0) return null
//   return (
//     <button
//       className={`noStyle ${
//         myEmojiLikeData && myEmojiLikeData?.myCardEmojiLike?.choice === 'UP' ? classes.clicked : classes.hashtag
//       }`}
//     >
//       {/* {data.myHashtagLike?.choice && hashtag.text} */}
//       {/* {hashtag.text} */}
//       <EmojiUpDown bulletEmojis={bulletEmoji} />
//       {/* <span style={{ marginLeft: '3px' }}>{bulletEmoji.count.nUps}</span> */}
//     </button>
//   )
// }

const BulletPointEmojis = ({
  bulletId,
  bulletEmojis,
}: {
  bulletId: string
  bulletEmojis?: BulletEmojiFragment
}): JSX.Element | null => {
  const { data: bulletEmojisData } = useBulletEmojisQuery({ variables: { bulletId } })
  if (
    !bulletEmojisData ||
    bulletEmojisData?.bulletEmojis.length <= 0 ||
    bulletEmojisData.bulletEmojis.every(e => e.count.nUps === 0)
  ) {
    return null
  }
  return (
    <span className={classes.bulletPointEmojisContainer} contentEditable={false}>
      {bulletEmojisData.bulletEmojis.map((e, i) => {
        if (e.count.nUps === 0) {
          return null
        }
        return (
          <BulletEmojiBtn
            key={i}
            bulletId={bulletId}
            emojiCode={e.code}
            bulletEmojis={bulletEmojisData?.bulletEmojis.find(el => el.code === e.code)}
            count={bulletEmojisData?.bulletEmojis.find(el => el.code === e.code)?.count.nUps ?? 0}
          />
        )
        // return <BulletEmojiDisplay key={i} bulletEmoji={e} />
      })}
    </span>
  )
}
export default BulletPointEmojis
