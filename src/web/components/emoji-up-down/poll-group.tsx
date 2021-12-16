import React, { HtmlHTMLAttributes, useContext, useEffect, useState } from 'react'
// import PinIcon from '../../assets/svg/like.svg'
// import UpIcon from '../../assets/svg/arrow-up.svg'
import Popover from '../popover/popover'
import PollPage from '../../__deprecated__/poll/poll-page'
import { PollDocument, PollFragment, PollQuery, useCreatePollMutation } from '../../apollo/query.graphql'
import Modal from '../modal/modal'
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
  handlePollData?: (data: PollFragment) => void
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
    // if (!pollId && bulletId) {
    //   createPoll({ variables: { bulletId, data: { choices } } })
    // }
    handleShowPopover && handleShowPopover(true)
    setClickedIdx(i)
  }

  return (
    <>
      <span className="inline-flex bg-gray-300 rounded first:rounded-l last:rounded-r">
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
            <span key={i} className="flex">
              <div className="inline-block w-0 mx-1 border-r border-gray-400"></div>
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
      {showPopover && (
        <Modal visible={showPopover} onClose={handleHideBoard}>
          {pollId && <PollPage pollId={pollId} clickedChoiceIdx={clickedIdx} />}
          {!pollId && <span>loading</span>}
        </Modal>
      )}
    </>
  )
}

export default PollGroup
