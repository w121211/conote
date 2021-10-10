import React, { HtmlHTMLAttributes, useContext, useEffect, useState } from 'react'
// import PinIcon from '../../assets/svg/like.svg'
// import UpIcon from '../../assets/svg/arrow-up.svg'
import classes from './upDown.module.scss'
import { Hashtag, HashtagGroup } from '../../lib/hashtag/types'
import Popover from '../popover/popover'
import PollPage from '../board/poll-page'
import { Poll, PollDocument, PollQuery, useCreatePollMutation } from '../../apollo/query.graphql'
// import { Context } from '../../pages/card/[symbol]'

const PollGroup = ({
  choices,
  pollId,
  inline,
  bulletId,
  onCreatePoll,
  handleClickedIdx,
  handleShowPopover,
  handlePollId,
  handlePollData,
}: {
  choices: string[]
  pollId?: string
  inline?: boolean
  bulletId?: number
  onCreatePoll?: () => void
  handleClickedIdx?: (i: number) => void
  handleShowPopover?: (b: boolean) => void
  handlePollId?: (id: string) => void
  handlePollData?: (data: Poll) => void
} & HtmlHTMLAttributes<HTMLElement>): JSX.Element => {
  const [showPopover, setShowPopover] = useState(false)
  const [clickedIdx, setClickedIdx] = useState<number | undefined>()
  // const context = useContext(Context)

  const [createPoll, { data: pollData, called: pollMutationCalled }] = useCreatePollMutation({
    update(cache, { data }) {
      const res = cache.readQuery<PollQuery>({
        query: PollDocument,
      })
      if (data?.createPoll && res?.poll) {
        cache.writeQuery({
          query: PollDocument,
          data: { board: data.createPoll },
        })
      }
    },
    onCompleted(data) {
      handlePollId && handlePollId(data.createPoll.id)

      // handlePollData && handlePollData(data.createPoll)
      // setPollId(data.createPoll.id)
    },
  })

  const handleHideBoard = () => {
    setClickedIdx(undefined)
    setShowPopover(false)
  }

  const handleClick = (ev: React.MouseEvent, i: number) => {
    ev.stopPropagation()
    handleClickedIdx && handleClickedIdx(i)
    if (!pollId && bulletId) {
      createPoll({ variables: { bulletId, data: { choices } } })
    }
    handleShowPopover && handleShowPopover(true)
    setClickedIdx(i)
    // if (context.login) {
    //   handleClickedIdx && handleClickedIdx(i)
    //   if (!pollId && bulletId) {
    //     createPoll({ variables: { bulletId, data: { choices } } })
    //   }
    //   handleShowPopover && handleShowPopover(true)
    //   setClickedIdx(i)
    // } else {
    //   context.showLoginPopup(true)
    // }
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
                onClick={(ev: React.MouseEvent) => {
                  handleClick(ev, i)
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
                onClick={(ev: React.MouseEvent) => {
                  handleClick(ev, i)
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

export default PollGroup
