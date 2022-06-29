import React from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  DiscussEmojiFragment,
  useDiscussEmojisQuery,
} from '../../apollo/query.graphql'
import { EmojisDropdownBtn } from '../emoji/emojis-dropdown-btn'
import ToggleMenu from '../ui-component/toggle-menu'
import DiscussEmojiUpsertBtn from './discuss-emoji-upsert-btn'

const DiscussEmojis = ({
  discussId,
  disable,
}: {
  discussId: string
  disable?: boolean
}): JSX.Element | null => {
  const { data: emojisData } = useDiscussEmojisQuery({
    variables: { discussId },
  })
  const shouldShowEmojiIcons = (data: DiscussEmojiFragment[] | undefined) => {
    return data && data.length > 0 && data.some(e => e.count.nUps > 0)
  }
  const emojis: EmojiCode[] = ['UP', 'DOWN']

  return (
    <div className="flex items-center">
      <ToggleMenu
        className="flex p-1"
        summary={<EmojisDropdownBtn disable={disable} />}
        disabled={disable}
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
            />
          )
        })}
    </div>
  )
}

export default DiscussEmojis
