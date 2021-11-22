import { useState } from 'react'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import { CardEmoji, BulletEmoji, EmojiCode } from '../../apollo/query.graphql'
// import classes from './upDown.module.scss'

const EmojiCodeToIcon = ({
  emoji,
  emojiCode,
}: {
  emoji?: CardEmoji | BulletEmoji
  emojiCode?: EmojiCode
}): JSX.Element | null => {
  if (emoji) {
    switch (emoji.code) {
      case 'PIN':
        return <span>❤️</span>
      case 'UP':
        return <span>👍</span>
      case 'DOWN':
        return <span>👎</span>
      default:
        return <span>{emoji.code}</span>
    }
  }
  if (emojiCode) {
    switch (emojiCode) {
      case 'PIN':
        return <span>❤️</span>
      case 'UP':
        return <span>👍</span>
      case 'DOWN':
        return <span>👎</span>
      default:
        return <span>{emojiCode}</span>
    }
  }
  return null
}

export default EmojiCodeToIcon
