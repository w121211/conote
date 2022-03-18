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
      {shouldShowEmojiIcons(emojisData?.discussPostEmojis) &&
        emojis.map((code, i) => {
          const data = emojisData?.discussPostEmojis.find(e => e.code === code)
          if (data?.count.nUps === 0 || !data) {
            return null
          }
          return <UpdateDiscussPostEmoji key={i} discussPostEmoji={data} type="normal" />
        })}
      <ToggleMenu
        className="flex left-full -translate-x-full p-1"
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

      {/* <Tooltip
          className="px-1 py-1 left-full -translate-x-full"
          direction="bottom"
          visible={showTooltip}
          onClose={() => setShowTooltip(false)}
        >
        </Tooltip> */}
    </div>
  )
}

export default DiscussPostEmojis
