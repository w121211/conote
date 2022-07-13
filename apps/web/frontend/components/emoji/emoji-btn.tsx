import { EmojiCode } from '@prisma/client'
import React from 'react'
import { EmojiIcon } from './emoji-icon'

export const EmojiBtn = ({
  onClick,
  emojiCode,
  liked,
  counts,
}: {
  onClick: () => void
  emojiCode: EmojiCode
  liked?: boolean
  counts?: number
}) => {
  return (
    <button
      className={` group flex h-fit p-1 rounded ${
        emojiCode === 'PIN'
          ? 'hover:bg-red-50'
          : liked
          ? 'bg-blue-50 hover:bg-blue-100'
          : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <EmojiIcon code={emojiCode} />
      {counts !== undefined && (
        <span
          className={`ml-1 text-xs  ${
            liked ? 'text-blue-500' : 'text-gray-500'
          }`}
        >
          {counts}
        </span>
      )}
    </button>
  )
}
