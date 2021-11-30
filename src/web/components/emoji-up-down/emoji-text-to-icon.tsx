import { useState } from 'react'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import { CardEmoji, BulletEmoji, EmojiCode } from '../../apollo/query.graphql'
import classes from './emoji-text-to-icon.module.scss'

const EmojiCodeToIcon = ({
  emoji,
  emojiCode,
  count,
  liked,
  text,
  customClass,
}: {
  emoji?: CardEmoji | BulletEmoji
  emojiCode?: EmojiCode
  count?: number
  liked?: boolean
  text?: string
  customClass?: string
}): JSX.Element | null => {
  if (emoji) {
    switch (emoji.code) {
      case 'PIN':
        return (
          <span className={`${classes.container} ${customClass ? customClass : ''}`}>
            <span className={`material-icons-outlined ${classes.favoriteIcon}`}>
              {liked ? 'favorite' : 'favorite_border'}
            </span>
            {emoji.count.nUps}
            {text}
          </span>
        )
      case 'UP':
        return (
          <span className={`${classes.container} ${customClass ? customClass : ''}`}>
            <span className={`${liked ? 'material-icons' : 'material-icons-outlined'}`}>thumb_up</span>
            {emoji.count.nUps}
            {text}
          </span>
        )
      case 'DOWN':
        return (
          <span className={`${classes.container} ${customClass ? customClass : ''}`}>
            <span className={`${liked ? 'material-icons' : 'material-icons-outlined'}`}>thumb_down</span>
            {emoji.count.nUps}
            {text}
          </span>
        )
      default:
        return (
          <span className={`${classes.container} ${customClass ? customClass : ''}`}>
            {emoji.code}
            {emoji.count.nUps}
            {text}
          </span>
        )
    }
  }
  if (emojiCode) {
    switch (emojiCode) {
      case 'PIN':
        return (
          <span className={`${classes.container} ${customClass ? customClass : ''}`}>
            <span className={`material-icons-outlined ${classes.favoriteIcon}`}>
              {liked ? 'favorite' : 'favorite_border'}
            </span>
            {count}
            {text}
          </span>
        )
      case 'UP':
        return (
          <span className={`${classes.container} ${customClass ? customClass : ''}`}>
            <span className={`${liked ? 'material-icons' : 'material-icons-outlined'}`}>thumb_up</span>
            {count}
            {text}
          </span>
        )
      case 'DOWN':
        return (
          <span className={`${classes.container} ${customClass ? customClass : ''}`}>
            <span className={`${liked ? 'material-icons' : 'material-icons-outlined'}`}>thumb_down</span>
            {count}
            {text}
          </span>
        )
      default:
        return (
          <span className={`${classes.container} ${customClass ? customClass : ''}`}>
            {emojiCode}
            {count}
            {text}
          </span>
        )
    }
  }
  return null
}

export default EmojiCodeToIcon
