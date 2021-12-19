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
        <span
          className={`inline-flex items-center gap-1 ${liked ? 'text-gray-500' : 'text-gray-400'} ${className ?? ''}`}
        >
          <span className={`material-icons text-lg text-rose-600 ${liked ? 'text-rose-600' : 'text-gray-400'}`}>
            favorite
          </span>
          {nUps}
          {showText && text}
        </span>
      )
    case 'UP':
      return (
        <span
          className={`inline-flex items-center gap-1 ${liked ? 'text-gray-500' : 'text-gray-400'} ${className ?? ''}`}
        >
          <span className={`material-icons ${liked ? ' text-blue-500' : ' text-gray-400'} text-lg`}>thumb_up_alt</span>
          {nUps}
          {showText && text}
        </span>
      )
    case 'DOWN':
      return (
        <span
          className={`inline-flex items-center gap-1 ${liked ? 'text-gray-500' : 'text-gray-400'} ${className ?? ''}`}
        >
          <span className={`material-icons ${liked ? ' text-blue-500' : ' text-gray-400'} text-lg`}>
            thumb_down_alt
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
