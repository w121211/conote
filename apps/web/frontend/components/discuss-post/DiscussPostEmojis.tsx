import React, { useState } from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  DiscussPostEmojiFragment,
  useDiscussPostEmojisQuery,
} from '../../../apollo/query.graphql'
import { EmojisDropdownBtn } from '../emoji/emojis-dropdown-btn'
import ToggleMenu from '../ui/toggle-menu'
import DiscussPostEmojiUpsertBtn from './DiscussPostEmojiUpsertBtn'

const DiscussPostEmojis = ({
  discussPostId,
  disabled,
}: {
  discussPostId: string
  disabled?: boolean
}): JSX.Element | null => {
  const { data: emojisData, refetch } = useDiscussPostEmojisQuery({
    variables: { discussPostId },
  })
  const emojis: EmojiCode[] = ['UP', 'DOWN']

  function shouldShowEmojiIcons(data: DiscussPostEmojiFragment[] | undefined) {
    return data && data.length > 0 && data.some(e => e.count.nUps > 0)
  }
  function onMutationCreateCompleted() {
    refetch()
  }

  return (
    <div className="flex items-center">
      <ToggleMenu
        className="flex p-1"
        summary={<EmojisDropdownBtn disabled={disabled} />}
        disabled={disabled}
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
              disabled={disabled}
              onMutationCreateCompleted={onMutationCreateCompleted}
            />
          )
        })}
      </ToggleMenu>

      {shouldShowEmojiIcons(emojisData?.discussPostEmojis) &&
        emojis.map(code => {
          const data = emojisData?.discussPostEmojis.find(e => e.code === code)
          if (data === undefined || data.count.nUps === 0) {
            return null
          }
          return (
            <DiscussPostEmojiUpsertBtn
              key={code}
              discussPostEmoji={data}
              discussPostId={discussPostId}
              emojiCode={code}
              type="normal"
              disabled={disabled}
              onMutationCreateCompleted={onMutationCreateCompleted}
            />
          )
        })}
    </div>
  )
}

export default DiscussPostEmojis
