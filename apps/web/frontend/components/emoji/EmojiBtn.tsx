import { EmojiCode } from '@prisma/client'
import React from 'react'
import { EmojiIcon } from './emoji-icon'

const EmojiBtn = ({
  onClick,
  emojiCode,
  liked,
  counts,
  disabled,
}: {
  onClick: () => void
  emojiCode: EmojiCode
  liked?: boolean
  counts?: number
  disabled?: boolean
}) => {
  if (disabled) {
    return (
      <span className={'group flex h-fit p-1 rounded'}>
        <EmojiIcon code={emojiCode} />
        {counts !== undefined && (
          <span
            className={`ml-1 text-xs ${
              liked ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {counts}
          </span>
        )}
      </span>
    )
  }
  return (
    <button
      className={`group flex h-fit p-1 rounded ${
        liked ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <EmojiIcon code={emojiCode} />
      {counts !== undefined && (
        <span
          className={`ml-1 text-xs ${
            liked ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          {counts}
        </span>
      )}
    </button>
  )
}

export default EmojiBtn
