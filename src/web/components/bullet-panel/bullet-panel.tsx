import React, { ReactElement, useRef, useState } from 'react'
import MyTooltip from '../my-tooltip/my-tooltip'
import BulletPanelSvg from './bullet-panel-svg'
import SrcIcon from '../../assets/svg/foreign.svg'
import classes from './bullet-panel.module.scss'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import BulletPanelEmojis from '../emoji-up-down/bullet-panel-emojis'
import { EmojiCode } from '../../apollo/type-defs.graphqls'
import { BulletEmojiFragment, BulletEmojiLikeFragment } from '../../apollo/query.graphql'

interface Child {
  icon?: SVGComponentTransferFunctionElement | SVGElement | Element | string | ReactElement
  text?: string | React.ReactNode
  emojiCode?: EmojiCode
  sourceUrl?: string
  authorName?: string
}

export interface BulletPanelType {
  bulletId?: string
  children?: Child[]
  visible?: boolean
  handleVisibleState?: (state: boolean) => void
  className?: string
  tooltipClassName?: string
  sourceUrl?: string
  authorName?: string
  onEmojiCreated: (emoji: BulletEmojiFragment, myEmojiLike: BulletEmojiLikeFragment) => void
  emoji?: BulletEmojiFragment[]
}

const BulletPanel = ({
  children,
  visible,
  handleVisibleState,
  className,
  sourceUrl,
  authorName,
  bulletId,
  onEmojiCreated,
  emoji,
  tooltipClassName,
}: BulletPanelType): JSX.Element => {
  // const [showPanel, setShowPanel] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const myChildren: Child[] = []
  if (authorName) {
    myChildren.unshift({ authorName: '@' + authorName.split(':')[0] })
  }
  if (bulletId) {
    // myChildren.push(
    //   {
    //     // icon: <span className="material-icons-outlined">favorite_border</span>,
    //     emojiCode: 'PIN',
    //     text: 'Pin',
    //   },
    //   {
    //     // icon: <UpIcon />,
    //     emojiCode: 'UP',
    //     text: 'Up',
    //   },
    //   {
    //     // icon: <UpIcon style={{ transform: 'rotate(180deg)' }} />,
    //     emojiCode: 'DOWN',
    //     text: 'Down',
    //   },
    // )
  }
  if (sourceUrl) {
    myChildren.push({ icon: <SrcIcon />, text: '來源連結', sourceUrl })
  }

  const handleShowPanel = (state: boolean) => {
    // setShowPanel(state)
  }
  return (
    <div className={`absolute h-full -left-full ${className ? className : ''}`} ref={containerRef}>
      <MyTooltip
        className={`${classes.panelTooltip} ${tooltipClassName ? tooltipClassName : ''}`}
        visible={visible}
        handleVisibleState={handleShowPanel}
      >
        {myChildren.map((e, i) => {
          if (e.authorName)
            return (
              <div key={i} className={classes.titleContainer}>
                <div className={` ${classes.title}`}>{e.authorName}</div>
                <div role="none" className={classes.divider}></div>
              </div>
            )
          if (e.sourceUrl)
            return (
              <div className={classes.panelElement} key={i}>
                <a className="ui" href={e.sourceUrl} target="_blank" rel="noreferrer">
                  <span className={classes.panelIcon}>{e.icon}</span>
                  {e.text}
                </a>
              </div>
            )

          // return (
          //   <div className={classes.panelElement} key={i}>
          //     <span className={classes.panelIcon}>{e.icon}</span>

          //     {e.text}
          //   </div>
          // )
        })}
        {bulletId && <BulletPanelEmojis bulletId={bulletId} />}
      </MyTooltip>
    </div>
  )
}
export default BulletPanel
