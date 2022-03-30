import { EmojiCode, LikeChoice } from '@prisma/client'
import React, { useState } from 'react'
import {
  DiscussPostEmojiFragment,
  useDiscussPostEmojisQuery,
  useMeQuery,
  useMyDiscussPostEmojiLikeLazyQuery,
  useMyDiscussPostEmojiLikeQuery,
} from '../../../apollo/query.graphql'
import Tooltip from '../../../layout/tooltip/tooltip'
import CreateDiscussPostEmoji from './post-create-emoji'
import UpdateDiscussPostEmoji from './post-update-emoji'
import EmojisSwitch from '../emojis-switch'
import ToggleMenu from '../../../layout/toggle-menu'

const DiscussPostEmojis = ({
  discussPostId,
  disable,
}: {
  discussPostId: string
  disable?: boolean
}): JSX.Element | null => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [liked, setLiked] = useState('')
  const { data: emojisData } = useDiscussPostEmojisQuery({ variables: { discussPostId } })
  const [queryMyEmoji, { data: myEmojiLikeData }] = useMyDiscussPostEmojiLikeLazyQuery()
  const emojis: EmojiCode[] = ['UP', 'DOWN']

  const shouldShowEmojiIcons = (data: DiscussPostEmojiFragment[] | undefined) => {
    return data && data.length > 0 && data.some(e => e.count.nUps > 0)
  }
  return (
    <div className="flex items-center">
      <ToggleMenu
        className="flex  p-1"
        summary={
          <EmojisSwitch
            showTooltip={showTooltip}
            onShowTooltip={() => setShowTooltip(!showTooltip)}
            disable={disable}
          />
        }
        disabled={disable}
      >
        {emojis.map((code, i) => {
          const data = emojisData?.discussPostEmojis.find(el => el.code === code)
          if (data) {
            return <UpdateDiscussPostEmoji key={i} discussPostEmoji={data} type="panel" />
          }
          return <CreateDiscussPostEmoji key={i} discussPostId={discussPostId} emojiCode={code} />
        })}
      </ToggleMenu>
      {shouldShowEmojiIcons(emojisData?.discussPostEmojis) &&
        emojis.map((code, i) => {
          const data = emojisData?.discussPostEmojis.find(e => e.code === code)
          if (data?.count.nUps === 0 || !data) {
            return null
          }
          return <UpdateDiscussPostEmoji key={i} discussPostEmoji={data} type="normal" />
        })}
    </div>
  )
}

export default DiscussPostEmojis
