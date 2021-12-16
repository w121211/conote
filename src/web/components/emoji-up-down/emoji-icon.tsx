import { EmojiCode } from 'graphql-let/__generated__/__types__'

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
  showText,
  className,
}: {
  code: EmojiCode
  nUps?: number
  liked?: boolean
  showText?: boolean
  className?: string
}): JSX.Element => {
  const text = emojiToChinese(code)
  switch (code) {
    case 'PIN':
      return (
        <span className={`inline-flex items-center gap-1 text-gray-700 ${className ?? ''}`}>
          <span className={`material-icons-outlined text-lg text-rose-600`}>
            {liked ? 'favorite' : 'favorite_border'}
          </span>
          {nUps}
          {showText && text}
        </span>
      )
    case 'UP':
      return (
        <span className={`inline-flex items-center gap-1 text-gray-700 ${className ?? ''}`}>
          <span
            className={`${liked ? 'material-icons text-blue-500' : 'material-icons-outlined text-gray-600'} text-lg`}
          >
            thumb_up
          </span>
          {nUps}
          {showText && text}
        </span>
      )
    case 'DOWN':
      return (
        <span className={`inline-flex items-center gap-1 text-gray-700 ${className ?? ''}`}>
          <span
            className={`${liked ? 'material-icons text-blue-500' : 'material-icons-outlined text-gray-600'} text-lg`}
          >
            thumb_down
          </span>
          {nUps}
          {showText && text}
        </span>
      )
    default:
      return (
        <span className={`inline-flex items-center gap-1 text-gray-700 ${className ?? ''}`}>
          {code}
          {nUps}
          {showText && text}
        </span>
      )
  }
}

export default EmojiIcon
