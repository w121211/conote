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
  upDownClassName,
}: {
  code: EmojiCode
  nUps?: number
  liked?: boolean
  showText?: boolean
  className?: string
  isColumn?: boolean
  upDownClassName?: string
}): JSX.Element => {
  const text = emojiToChinese(code)
  switch (code) {
    case 'PIN':
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm leading-tight text-gray-600 ${
            isColumn ? 'flex-col' : 'flex-row'
          } ${className ?? ''}`}
        >
          <span className={`material-icons text-lg  ${liked ? 'favorite text-rose-600' : 'favorite_border  '} `}>
            {liked ? 'favorite' : 'favorite_border'}
          </span>
          {nUps}
          {showText && text}
        </span>
      )
    case 'UP':
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm leading-tight text-gray-600 ${
            isColumn ? 'flex-col' : 'flex-row'
          } ${className ?? ''}`}
        >
          <span
            className={` ${liked ? 'material-icons text-blue-600' : 'material-icons-outlined '} text-lg ${
              upDownClassName ? upDownClassName : ''
            } `}
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
          className={`inline-flex items-center gap-1 text-sm leading-tight text-gray-600 ${
            isColumn ? 'flex-col' : 'flex-row'
          } ${className ?? ''}`}
        >
          <span
            className={` ${liked ? 'material-icons text-blue-600' : 'material-icons-outlined '} text-lg ${
              upDownClassName ? upDownClassName : ''
            }`}
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
          className={`inline-flex items-center gap-1 text-sm leading-tight text-gray-600 ${
            isColumn ? 'flex-col' : 'flex-row'
          } ${className ?? ''}`}
        >
          {code}
          {nUps}
          {showText && text}
        </span>
      )
  }
}

export default EmojiIcon
