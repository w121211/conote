import React, { useState } from 'react'
import {
  DiscussPostEmojiFragment,
  useDiscussPostEmojisQuery,
} from '../../../apollo/query.graphql'
import CreateDiscussPostEmoji from './post-create-emoji'
import UpdateDiscussPostEmoji from './post-update-emoji'
import { EmojisDropdownBtn } from '../../emoji/emojis-dropdown-btn'
import ToggleMenu from '../../../layout/toggle-menu'
import { EmojiCode } from '@prisma/client'

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
        {emojis.map((code, i) => {
          const data = emojisData?.discussPostEmojis.find(
            el => el.code === code,
          )
          if (data) {
            return (
              <UpdateDiscussPostEmoji
                key={i}
                discussPostEmoji={data}
                type="panel"
              />
            )
          }
          return (
            <CreateDiscussPostEmoji
              key={i}
              discussPostId={discussPostId}
              emojiCode={code}
            />
          )
        })}
      </ToggleMenu>
      {shouldShowEmojiIcons(emojisData?.discussPostEmojis) &&
        emojis.map((code, i) => {
          const data = emojisData?.discussPostEmojis.find(e => e.code === code)
          if (data?.count.nUps === 0 || !data) {
            return null
          }
          return (
            <UpdateDiscussPostEmoji
              key={i}
              discussPostEmoji={data}
              type="normal"
            />
          )
        })}
    </div>
  )
}

export default DiscussPostEmojis
