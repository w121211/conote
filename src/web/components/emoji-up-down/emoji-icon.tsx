import { EmojiCode } from 'graphql-let/__generated__/__types__'
import classes from './emoji-icon.module.scss'

const emojiToChinese = (code: EmojiCode): string => {
  switch (code) {
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
  throw `Unkown emoji code ${code}`
}

const EmojiIcon = ({
  code,
  nUps,
  liked,
  className,
}: {
  code: EmojiCode
  nUps?: number
  liked?: boolean
  className?: string
}): JSX.Element => {
  const text = emojiToChinese(code)
  switch (code) {
    case 'PIN':
      return (
        <span className={`${classes.container} ${className ?? ''}`}>
          <span className={`material-icons-outlined ${classes.favoriteIcon}`}>
            {liked ? 'favorite' : 'favorite_border'}
          </span>
          {nUps}
          {text}
        </span>
      )
    case 'UP':
      return (
        <span className={`${classes.container} ${className ?? ''}`}>
          <span className={`${liked ? 'material-icons' : 'material-icons-outlined'}`}>thumb_up</span>
          {nUps}
          {text}
        </span>
      )
    case 'DOWN':
      return (
        <span className={`${classes.container} ${className ?? ''}`}>
          <span className={`${liked ? 'material-icons' : 'material-icons-outlined'}`}>thumb_down</span>
          {nUps}
          {text}
        </span>
      )
    default:
      return (
        <span className={`${classes.container} ${className ?? ''}`}>
          {code}
          {nUps}
          {text}
        </span>
      )
  }
}

export default EmojiIcon
