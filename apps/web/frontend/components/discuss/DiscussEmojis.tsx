import React from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  DiscussEmojiFragment,
  useDiscussEmojisQuery,
} from '../../../apollo/query.graphql'
import { EmojisDropdownBtn } from '../emoji/emojis-dropdown-btn'
import ToggleMenu from '../ui/toggle-menu'
import DiscussEmojiUpsertBtn from './DiscussEmojiUpsertBtn'

const DiscussEmojis = ({
  discussId,
  disabled,
}: {
  discussId: string
  disabled?: boolean
}): JSX.Element | null => {
  const { data: emojisData, refetch } = useDiscussEmojisQuery({
    variables: { discussId },
  })
  const emojis: EmojiCode[] = ['UP', 'DOWN']

  function shouldShowEmojiIcons(data: DiscussEmojiFragment[] | undefined) {
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
          const data = emojisData?.discussEmojis.find(el => el.code === code)
          return (
            <DiscussEmojiUpsertBtn
              key={code}
              discussId={discussId}
              emojiCode={code}
              discussEmoji={data}
              type="panel"
              disabled={disabled}
              onMutationCreateCompleted={onMutationCreateCompleted}
            />
          )
        })}
      </ToggleMenu>

      {shouldShowEmojiIcons(emojisData?.discussEmojis) &&
        emojis.map(code => {
          const data = emojisData?.discussEmojis.find(e => e.code === code)
          if (data?.count.nUps === 0 || !data) {
            return null
          }
          return (
            <DiscussEmojiUpsertBtn
              key={code}
              discussId={discussId}
              emojiCode={code}
              discussEmoji={data}
              type="normal"
              disabled={disabled}
              onMutationCreateCompleted={onMutationCreateCompleted}
            />
          )
        })}
    </div>
  )
}

export default DiscussEmojis
