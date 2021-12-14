import React, { useRef } from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import { BulletEmojiFragment } from '../../apollo/query.graphql'
import BulletEmojiCreateButton from '../emoji-up-down/bullet-emoji-create-button'
import MyTooltip from '../my-tooltip/my-tooltip'
import classes from './bullet-panel.module.scss'

const BULLET_PANEL_EMOJIS: EmojiCode[] = ['UP', 'DOWN']

const BulletPanel = ({
  authorName,
  bulletId,
  className,
  sourceUrl,
  visible,
}: {
  authorName?: string
  bulletId?: string
  className?: string
  sourceUrl?: string
  emoji?: BulletEmojiFragment[]
  visible?: boolean
  // onEmojiCreated: (emoji: BulletEmojiFragment, myEmojiLike: BulletEmojiLikeFragment) => void
}): JSX.Element => {
  // const [showPanel, setShowPanel] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div className={`absolute h-full -left-full ${className ? className : ''}`} ref={containerRef}>
      <MyTooltip
        className={`${classes.panelTooltip}`}
        visible={visible}
        // handleVisibleState={handleShowPanel}
      >
        {authorName && (
          <div className={classes.titleContainer}>
            <div className={`${classes.title}`}>{authorName}</div>
            <div role="none" className={classes.divider}></div>
          </div>
        )}
        {sourceUrl && (
          <div className={classes.panelElement}>
            <a className="ui" href={sourceUrl} target="_blank" rel="noreferrer">
              {/* <span className={classes.panelIcon}>{e.icon}</span> */}
              來源連結
            </a>
          </div>
        )}
        {bulletId &&
          BULLET_PANEL_EMOJIS.map((e, i) => (
            <BulletEmojiCreateButton bulletId={bulletId} className={classes.bulletPanelBtn} emojiCode={e} key={i} />
          ))}
      </MyTooltip>
    </div>
  )
}
export default BulletPanel
