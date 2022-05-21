import { EmojiCode } from '@prisma/client'
import React from 'react'
import {
  DiscussEmojiFragment,
  useDiscussEmojisQuery,
} from '../../apollo/query.graphql'
import CreateDiscussEmoji from './discuss-create-emoji'
import UpdateDiscussEmoji from './discuss-update-emoji'
import { EmojisDropdownBtn } from '../emoji/emojis-dropdown-btn'
import ToggleMenu from '../ui-component/toggle-menu'

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
  const emojis: EmojiCode[] = ['UP', 'DOWN']
  const shouldShowEmojiIcons = (data: DiscussEmojiFragment[] | undefined) => {
    return data && data.length > 0 && data.some(e => e.count.nUps > 0)
  }

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
              <UpdateDiscussEmoji key={i} discussEmoji={data} type="panel" />
            )
          }
          return (
            <CreateDiscussEmoji key={i} discussId={discussId} emojiCode={e} />
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
            <UpdateDiscussEmoji key={i} discussEmoji={data} type="normal" />
          )
        })}
    </div>
  )
}

export default DiscussEmojis
