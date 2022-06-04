import React from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import {
  DiscussEmojiFragment,
  useDiscussEmojisQuery,
} from '../../apollo/query.graphql'
import { EmojisDropdownBtn } from '../emoji/emojis-dropdown-btn'
import ToggleMenu from '../ui-component/toggle-menu'
import DiscussEmojiCreateBtn from './discuss-emoji-create-btn'
import DiscussEmojiUpdateBtn from './discuss-emoji-update-btn'

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
        {emojis.map((e, i) => {
          const data = emojisData?.discussEmojis.find(el => el.code === e)
          if (data) {
            return (
              <DiscussEmojiUpdateBtn key={i} discussEmoji={data} type="panel" />
            )
          }
          return (
            <DiscussEmojiCreateBtn
              key={i}
              discussId={discussId}
              emojiCode={e}
            />
          )
        })}
      </ToggleMenu>

      {shouldShowEmojiIcons(emojisData?.discussEmojis) &&
        emojis.map((code, i) => {
          const data = emojisData?.discussEmojis.find(e => e.code === code)
          if (data?.count.nUps === 0 || !data) {
            return null
          }
          return (
            <DiscussEmojiUpdateBtn key={i} discussEmoji={data} type="normal" />
          )
        })}
    </div>
  )
}

export default DiscussEmojis
