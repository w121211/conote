import React, { HtmlHTMLAttributes, useEffect, useState } from 'react'
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
  handleCreatePoll,
  handleClickedIdx,
  handleShowPopover,
}: {
  choices: string[]
  pollId?: string
  inline?: boolean
  handleCreatePoll?: () => void
  handleClickedIdx?: (i: number) => void
  handleShowPopover?: (b: boolean) => void
} & HtmlHTMLAttributes<HTMLElement>): JSX.Element => {
  const [showPopover, setShowPopover] = useState(false)
  const [clickedIdx, setClickedIdx] = useState<number | undefined>()

  // const newText = hashtag.text.substring(1, hashtag.text.length - 1)
  // const textArr = newText.split(' ')

  // useEffect(() => {
  //   console.log(showPopover)
  // })

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
                  handleClickedIdx && handleClickedIdx(i)
                  handleShowPopover && handleShowPopover(true)
                  setClickedIdx(i)
                  setShowPopover(true)
                  if (!pollId) {
                    handleCreatePoll && handleCreatePoll()
                  }
                }}
              >
                <span>{e}</span>
              </button>
            )
          }
          //others
          return (
            <span key={i} className={classes.hasDividerDiv}>
              <div className={classes.divider}></div>
              <button
                className="inline"
                onClick={ev => {
                  ev.stopPropagation()
                  handleClickedIdx && handleClickedIdx(i)
                  handleShowPopover && handleShowPopover(true)
                  setClickedIdx(i)
                  setShowPopover(true)
                  if (!pollId) {
                    handleCreatePoll && handleCreatePoll()
                  }
                  // console.log(e)
                }}
              >
                <span>{e}</span>
              </button>
            </span>
          )
        })}
      </span>
      {/* </button> */}
      {/* {showPopover && (
        <Popover visible={showPopover} hideBoard={handleHideBoard}>
          {pollId && <PollPage pollId={pollId} clickedChoiceIdx={clickedIdx} />}
          {!pollId && <span>loading</span>}
        </Popover>
      )} */}
    </>
  )
}

export default MyHashtagGroup
