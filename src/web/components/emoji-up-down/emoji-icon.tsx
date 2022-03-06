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
  isColumn,
}: {
  code: EmojiCode
  nUps?: number
  liked?: boolean
  showText?: boolean
  className?: string
  isColumn?: boolean
}): JSX.Element => {
  const text = emojiToChinese(code)
  switch (code) {
    case 'PIN':
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm text-gray-600 ${isColumn ? 'flex-col' : 'flex-row'} ${
            className ?? ''
          }`}
        >
          <span className={`material-icons text-lg text-rose-600 ${liked ? 'text-rose-600' : 'text-gray-700'}`}>
            favorite
          </span>
          {nUps}
          {showText && text}
        </span>
      )
    case 'UP':
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm text-gray-600 ${isColumn ? 'flex-col' : 'flex-row'} ${
            className ?? ''
          }`}
        >
          <span
            className={`material-icons-outlined ${
              liked ? ' text-blue-600' : ' text-inherit'
            } text-lg group-hover:text-blue-600 `}
          >
            thumb_up_alt
          </span>
          {nUps}
          {showText && text}
        </span>
      )
    case 'DOWN':
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm text-gray-600 ${isColumn ? 'flex-col' : 'flex-row'} ${
            className ?? ''
          }`}
        >
          <span
            className={`material-icons-outlined ${
              liked ? ' text-blue-600' : 'text-inherit'
            } text-lg group-hover:text-blue-600`}
          >
            thumb_down_alt
          </span>
          {nUps}
          {showText && text}
        </span>
      )
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm text-gray-600 ${isColumn ? 'flex-col' : 'flex-row'} ${
            className ?? ''
          }`}
        >
          {code}
          {nUps}
          {showText && text}
        </span>
      )
  }
}

export default EmojiIcon