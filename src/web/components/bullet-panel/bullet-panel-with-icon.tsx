import React, { ReactElement, useRef, useState } from 'react'
import MyTooltip from '../my-tooltip/my-tooltip'
import BulletPanelSvg from './bullet-panel-svg'
import SrcIcon from '../../assets/svg/foreign.svg'
import classes from './bullet-panel.module.scss'
import PinIcon from '../../assets/svg/like.svg'
import UpIcon from '../../assets/svg/arrow-up.svg'
import { BulletEmoji, BulletEmojiLike, EmojiCode } from '../../apollo/query.graphql'
import EmojiUpDown from '../emoji-up-down/emoji-up-down'

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
  sourceUrl?: string
  authorName?: string
  onEmojiCreated: (emoji: BulletEmoji, myEmojiLike: BulletEmojiLike) => void
  emoji?: BulletEmoji[]
}

const BulletPanelWithIcon = ({
  children,
  visible,
  handleVisibleState,
  className,
  sourceUrl,
  authorName,
  bulletId,
  onEmojiCreated,
  emoji,
}: BulletPanelType): JSX.Element => {
  const [showPanel, setShowPanel] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const myChildren: Child[] = []
  if (authorName) {
    myChildren.unshift({ authorName: '@' + authorName.split(':')[0] })
  }
  if (bulletId) {
    myChildren.push(
      {
        icon: <PinIcon />,
        emojiCode: 'PIN',
        text: 'Pin',
      },
      {
        icon: <UpIcon />,
        emojiCode: 'UP',
        text: 'Up',
      },
      {
        icon: <UpIcon style={{ transform: 'rotate(180deg)' }} />,
        emojiCode: 'DOWN',
        text: 'Down',
      },
    )
  }
  if (sourceUrl) {
    myChildren.push({ icon: <SrcIcon />, text: '來源連結', sourceUrl })
  }

  const handleShowPanel = (state: boolean) => {
    setShowPanel(state)
  }
  return (
    <div
      className={`${classes.container} ${className ? className : ''}`}
      onMouseOver={e => {
        e.stopPropagation()
        // e.preventDefault()
        if (e.currentTarget.contains(containerRef.current)) {
          setShowPanel(true)
        }
        // console.log('hover')
      }}
      onMouseLeave={e => {
        e.stopPropagation()
        // e.preventDefault()

        setShowPanel(false)
        // if (!e.currentTarget.contains(containerRef.current)) {
        //  setTimeout(
        //   () => {
        //   },
        //   100,
        //   false,
        // )
        // }
        // console.log('mouseout')
      }}
      ref={containerRef}
    >
      {/* <div className={classes.bulletPanelSibling}></div> */}
      <BulletPanelSvg
        className={classes.bulletPanel}
        // clicked={() => {
        //   setShowPanel(prev => !prev)
        //   // console.log('panel clicked')
        // }}

        style={showPanel || visible ? { visibility: 'visible' } : undefined}
      />

      {showPanel && (
        <MyTooltip className={classes.panelTooltip} visible={showPanel} handleVisibleState={handleShowPanel}>
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
            if (bulletId && e.emojiCode !== undefined) {
              return (
                <EmojiUpDown
                  className={classes.panelElement}
                  key={i}
                  bulletId={bulletId}
                  foundEmoji={emoji?.find(el => el.code === e.emojiCode)}
                  emojiCode={e.emojiCode}
                  // onEmojiCreated={onEmojiCreated}
                >
                  {/* <div className={classes.panelElement} key={i}> */}
                  <span className={classes.panelIcon}>{e.icon}</span>

                  {e.text}
                  {/* </div> */}
                </EmojiUpDown>
              )
            }
            return (
              <div className={classes.panelElement} key={i}>
                <span className={classes.panelIcon}>{e.icon}</span>

                {e.text}
              </div>
            )
          })}
        </MyTooltip>
      )}
    </div>
  )
}
export default BulletPanelWithIcon
