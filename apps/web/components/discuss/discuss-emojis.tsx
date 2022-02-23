import { EmojiCode, LikeChoice } from '@prisma/client'
import React, { useState } from 'react'
import { DiscussEmojiFragment, useDiscussEmojisQuery, useMyDiscussEmojiLikeQuery } from '../../apollo/query.graphql'
import EmojiIcon from '../emoji-up-down/emoji-icon'
import Tooltip from '../tooltip/tooltip'
import CreateDiscussEmoji from './discuss-create-emoji'

import UpdateDiscussEmoji from './discuss-update-emoji'
import EmojisSwitch from './emojis-switch'

const DiscussEmojis = ({ discussId }: { discussId: string }): JSX.Element | null => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { data: emojisData } = useDiscussEmojisQuery({ variables: { discussId } })
  const emojis: EmojiCode[] = ['UP', 'DOWN']
  // const pinEmojiData = emojiData?.cardEmojis.find(e => e.code === 'PIN')
  const shouldShowEmojiIcons = (data: DiscussEmojiFragment[] | undefined) => {
    return data && data.length > 0 && data.some(e => e.count.nUps > 0)
  }

  return (
    <div className="flex items-center">
      {shouldShowEmojiIcons(emojisData?.discussEmojis) &&
        emojis.map((code, i) => {
          const data = emojisData?.discussEmojis.find(e => e.code === code)
          if (data?.count.nUps === 0 || !data) {
            return null
          }
          return <UpdateDiscussEmoji key={i} discussEmoji={data} type="normal" />
        })}
      <EmojisSwitch showTooltip={showTooltip} onShowTooltip={() => setShowTooltip(!showTooltip)}>
        <Tooltip
          className="px-1 py-1 left-full -translate-x-full"
          direction="bottom"
          visible={showTooltip}
          onClose={() => setShowTooltip(false)}
        >
          {emojis.map((e, i) => {
            const data = emojisData?.discussEmojis.find(el => el.code === e)
            if (data) {
              return <UpdateDiscussEmoji key={i} discussEmoji={data} type="panel" />
            }
            return <CreateDiscussEmoji key={i} discussId={discussId} emojiCode={e} />
          })}
        </Tooltip>
      </EmojisSwitch>
    </div>
  )
}

export default DiscussEmojis
