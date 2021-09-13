import React, { HtmlHTMLAttributes, useState } from 'react'
// import PinIcon from '../../assets/svg/like.svg'
// import UpIcon from '../../assets/svg/arrow-up.svg'
import classes from './upDown.module.scss'
import { Hashtag, HashtagGroup } from '../../lib/hashtag/types'
import Popover from '../popover/popover'
import PollPage from '../board/poll-page'

const MyHashtagGroup = ({ hashtag }: { hashtag: HashtagGroup } & HtmlHTMLAttributes<HTMLElement>): JSX.Element => {
  const [showPopover, setShowPopover] = useState(false)
  const [clickedIdx, setClickedIdx] = useState<number | undefined>()

  const newText = hashtag.text.substring(1, hashtag.text.length - 1)
  const textArr = newText.split(' ')

  const handleHideBoard = () => {
    setClickedIdx(undefined)
    setShowPopover(false)
  }

  return (
    <>
      <button>
        {textArr.map((e, i) => {
          //first child
          if (i === 0) {
            return (
              <span
                key={i}
                onClick={ev => {
                  ev.stopPropagation()
                  setClickedIdx(i)
                  setShowPopover(true)
                  console.log(e)
                }}
              >
                {e}
              </span>
            )
          }
          //others
          return (
            <span
              className={classes.HashtagGroupChildren}
              key={i}
              onClick={ev => {
                ev.stopPropagation()
                setClickedIdx(i)
                setShowPopover(true)
                console.log(e)
              }}
            >
              {e}
            </span>
          )
        })}
      </button>
      {showPopover && (
        <Popover visible={showPopover} hideBoard={handleHideBoard}>
          <PollPage poll={hashtag.poll} clickedChoiceIdx={clickedIdx} />
        </Popover>
      )}
    </>
  )
}

export default MyHashtagGroup
