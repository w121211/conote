import { EmojiCode } from '@prisma/client'

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
    default: {
      return code
    }
  }
  // throw `Unkown emoji code ${code}`
}

export const EmojiIcon = ({
  code,
  liked,
  showText,
  className,
  isColumn,
  upDownClassName,
  pinClassName,
}: {
  code: EmojiCode
  liked?: boolean
  showText?: boolean
  className?: string
  isColumn?: boolean
  upDownClassName?: string
  pinClassName?: string
}): JSX.Element => {
  const text = emojiToChinese(code)
  switch (code) {
    case 'PIN':
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm leading-none text-gray-600 ${
            isColumn ? 'flex-col' : 'flex-row'
          } ${className ?? ''}`}
        >
          <span
            className={`material-icons-outlined text-lg leading-none ${
              liked ? 'favorite text-rose-600' : 'favorite_border  '
            } ${pinClassName ?? ''}`}
          >
            {liked ? 'favorite' : 'favorite_border'}
          </span>
          {showText && text}
        </span>
      )
    case 'UP':
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm leading-none text-gray-600 ${
            isColumn ? 'flex-col' : 'flex-row'
          } ${className ?? ''}`}
        >
          <span
            className={`leading-none ${
              upDownClassName ? upDownClassName : ''
            } `}
          >
            👍
          </span>
          {showText && text}
        </span>
      )
    case 'DOWN':
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm leading-none text-gray-600 ${
            isColumn ? 'flex-col' : 'flex-row'
          } ${className ?? ''}`}
        >
          <span
            className={`
            leading-none ${upDownClassName ? upDownClassName : ''}`}
          >
            👎
          </span>
          {showText && text}
        </span>
      )
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 text-sm leading-none text-gray-600 ${
            isColumn ? 'flex-col' : 'flex-row'
          } ${className ?? ''}`}
        >
          {code}
          {showText && text}
        </span>
      )
  }
}
