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
      className={` group p-1 rounded ${
        emojiCode === 'PIN' ? 'hover:bg-red-50' : 'hover:bg-gray-100'
      }`}
      onClick={() => {
        onClick()
      }}
    >
      <EmojiIcon
        className={'text-gray-500'}
        code={emojiCode}
        liked={liked}
        upDownClassName="!text-lg !leading-none "
        pinClassName="!text-xl !leading-none group-hover:text-red-600"
      />
      {counts !== undefined && (
        <span className={`ml-[2px] text-sm`}>{counts}</span>
      )}
    </button>
  )
}
