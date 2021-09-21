import React, { HtmlHTMLAttributes, useState } from 'react'
// import PinIcon from '../../assets/svg/like.svg'
// import UpIcon from '../../assets/svg/arrow-up.svg'
import classes from './upDown.module.scss'
import { Hashtag, HashtagGroup } from '../../lib/hashtag/types'
import Popover from '../popover/popover'
import PollPage from '../board/poll-page'

const MyHashtagGroup = ({
  choices,
  pollId,
  inline,
}: { choices: string[]; pollId: string; inline?: boolean } & HtmlHTMLAttributes<HTMLElement>): JSX.Element => {
  const [showPopover, setShowPopover] = useState(false)
  const [clickedIdx, setClickedIdx] = useState<number | undefined>()

  // const newText = hashtag.text.substring(1, hashtag.text.length - 1)
  // const textArr = newText.split(' ')

  const handleHideBoard = () => {
    setClickedIdx(undefined)
    setShowPopover(false)
  }

  return (
    <>
      <span className={classes.groupContainer}>
        {/* <button className={inline ? 'inline mR' : undefined}> */}
        {choices.map((e, i) => {
          //first child
          if (i === 0) {
            return (
              <button
                className="inline"
                key={i}
                onClick={ev => {
                  ev.stopPropagation()
                  setClickedIdx(i)
                  setShowPopover(true)
                  // console.log(e)
                }}
              >
                <span>{e}</span>
              </button>
            )
          }
          //others
          return (
            <div key={i}>
              <div className={classes.divider}></div>
              <button
                className="inline"
                key={i}
                onClick={ev => {
                  ev.stopPropagation()
                  setClickedIdx(i)
                  setShowPopover(true)
                  // console.log(e)
                }}
              >
                <span>{e}</span>
              </button>
            </div>
          )
        })}
      </span>
      {/* </button> */}
      {showPopover && (
        <Popover visible={showPopover} hideBoard={handleHideBoard}>
          <PollPage pollId={pollId} clickedChoiceIdx={clickedIdx} />
        </Popover>
      )}
    </>
  )
}

export default MyHashtagGroup
