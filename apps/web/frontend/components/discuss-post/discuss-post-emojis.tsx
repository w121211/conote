import React, { useState } from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  DiscussPostEmojiFragment,
  useDiscussPostEmojisQuery,
} from '../../../apollo/query.graphql'
import { EmojisDropdownBtn } from '../emoji/emojis-dropdown-btn'
import ToggleMenu from '../ui/toggle-menu'
import DiscussPostEmojiUpsertBtn from './discuss-post-emoji-upsert-btn'

const DiscussPostEmojis = ({
  discussPostId,
  disable,
}: {
  discussPostId: string
  disable?: boolean
}): JSX.Element | null => {
  const { data: emojisData } = useDiscussPostEmojisQuery({
    variables: { discussPostId },
  })

  const emojis: EmojiCode[] = ['UP', 'DOWN']

  const shouldShowEmojiIcons = (
    data: DiscussPostEmojiFragment[] | undefined,
  ) => {
    return data && data.length > 0 && data.some(e => e.count.nUps > 0)
  }
  return (
    <div className="flex items-center">
      <ToggleMenu
        className="flex p-1"
        summary={<EmojisDropdownBtn disable={disable} />}
        disabled={disable}
      >
        {emojis.map(code => {
          const data = emojisData?.discussPostEmojis.find(
            el => el.code === code,
          )
          return (
            <DiscussPostEmojiUpsertBtn
              key={code}
              discussPostEmoji={data}
              discussPostId={discussPostId}
              emojiCode={code}
              type="panel"
            />
          )
        })}
      </ToggleMenu>
      {shouldShowEmojiIcons(emojisData?.discussPostEmojis) &&
        emojis.map(code => {
          const data = emojisData?.discussPostEmojis.find(e => e.code === code)
          if (data?.count.nUps === 0 || !data) {
            return null
          }
          return (
            <DiscussPostEmojiUpsertBtn
              key={code}
              discussPostEmoji={data}
              discussPostId={discussPostId}
              emojiCode={code}
              type="normal"
            />
          )
        })}
    </div>
  )
}

export default DiscussPostEmojis
