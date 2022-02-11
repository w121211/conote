import React, { useState } from 'react'
import { Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSelected, useSlateStatic } from 'slate-react'
import { RateChoice } from '@prisma/client'
import { RateFragment } from '../../apollo/query.graphql'
import { InlineDiscussElement } from '../editor/slate-custom-types'
import Modal from '../modal/modal'
// import RateButton from '../rate-form/rate-button'
// import CreateRateForm from '../rate-form/create-rate-form'
// import UpdateRateForm from '../rate-form/update-rate-form'
import { InlineItemService } from './inline-item-service'

const InlineDiscuss = (props: RenderElementProps & { element: InlineDiscussElement }): JSX.Element => {
  const { children, attributes, element } = props
  const editor = useSlateStatic()
  const selected = useSelected()
  const [showPopover, setShowPopover] = useState(false)
  // const [shotId, setShotId] = useState(element.id)
  // const [shotData, setShotData] = useState<ShotFragment | undefined>()
  // const { data: targetData } = useCardQuery({ variables: { id: shotId } })

  // const onRateCreated = (rate: RateFragment, targetSymbol: string) => {
  //   // const editor = useSlateStatic()
  //   const path = ReactEditor.findPath(editor, element)
  //   const inlineRate = InlineItemService.toInlineRateString({
  //     id: rate.id,
  //     choice: rate.choice,
  //     symbol: targetSymbol,
  //     author: element.authorName ?? '',
  //   })
  //   Transforms.setNodes<InlineRateElement>(editor, { id: rate.id }, { at: path })
  //   Transforms.insertText(editor, inlineRate, { at: path })
  // }

  // useEffect(() => {
  //   // if (showPopover && !pollId) {
  //   //   handleCreatePoll()
  //   // }
  //   // console.log(shotData, shotId)
  //   if (!showPopover && !element.id && shotId && shotData) {
  //     // const queryPollData = async () => {
  //     //   queryPoll({ variables: { id: pollId } })
  //     // }
  //     // queryPollData()
  //     // queryShot({ variables: { id:shotId } })
  //     if (shotData) {
  //       onCreated(shotData)
  //     }
  //   }
  // }, [showPopover, shotData, shotId])

  return (
    <span {...attributes}>
      {/* {!selected && ( */}
      {/* <button
            className={classes.shotBtn}
            contentEditable={false}
            onClick={e => {
              e.stopPropagation()
              setShowPopover(true)
            }}
          >
            {element.params.map((e, i) => {
              return (
                <span
                  className={
                    e.startsWith('@')
                      ? classes.shotAuthor
                      : e.startsWith('$') || e.startsWith('[[')
                      ? classes.shotTarget
                      : e.startsWith('#')
                      ? classes.shotChoice
                      : ''
                  }
                  data-choice={e.startsWith('#') ? e : ''}
                  key={i}
                >
                  {e.startsWith('$') ? '  ' + e + '  ' : e.startsWith('#') ? e.substr(1) : e}
                </span>
              )
            })}
          </button> */}
      <span contentEditable={false}>
        <button>{element.str}</button>

        {/* {showPopover && (
          <Modal visible={showPopover} onClose={() => setShowPopover(false)}>
            {element.id ? (
              <UpdateRateForm
                rateId={element.id}
                initialInput={{
                  author: element.params.find(e => e.startsWith('@')) ?? '',
                  target: {
                    value: element.params.find(e => e.startsWith('$'))?.substring(1) ?? '',
                    label: element.params.find(e => e.startsWith('$'))?.substring(1) ?? '',
                  },
                  choice: (element.params.find(e => e.startsWith('#'))?.substring(1) as RateChoice) ?? 'LONG',
                  link: '',
                }}
                onRateCreated={onRateCreated}
              />
            ) : (
              <CreateRateForm
                initialInput={{
                  author: {
                    value: element.params.find(e => e.startsWith('@')) ?? '',
                    label: element.params.find(e => e.startsWith('@')) ?? '',
                  },
                  target: {
                    value: element.params.find(e => e.startsWith('$'))?.substring(1) ?? '',
                    label: element.params.find(e => e.startsWith('$'))?.substring(1) ?? '',
                  },
                  choice: (element.params.find(e => e.startsWith('#'))?.substring(1) as RateChoice) ?? 'LONG',
                  link: '',
                }}
                onRateCreated={onRateCreated}
              />
            )}
          </Modal>
        )} */}
      </span>
      <span className={'text-[0px]'}>{children}</span>
      {/* <span>{children}</span> */}
    </span>
  )
}

export default InlineDiscuss