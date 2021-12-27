import React, { useState } from 'react'
import { ReactEditor, RenderElementProps, useSelected, useSlateStatic } from 'slate-react'
import { InlineRateElement } from '../editor/slate-custom-types'
import Modal from '../modal/modal'
import { Transforms } from 'slate'
import { RateFragment } from '../../apollo/query.graphql'
import { InlineItemService } from './inline-item-service'
import RateButton from '../rate-button/rate-button'
import CreateRateForm from '../rate-form/create-rate-form'
import { RateChoice } from '@prisma/client'

const InlineRate = (props: RenderElementProps & { element: InlineRateElement }): JSX.Element => {
  const editor = useSlateStatic()
  const selected = useSelected()

  const { children, attributes, element } = props
  const [showPopover, setShowPopover] = useState(false)
  // const [shotId, setShotId] = useState(element.id)
  // const [shotData, setShotData] = useState<ShotFragment | undefined>()
  // const { data: targetData } = useCardQuery({ variables: { id: shotId } })

  const onRateCreated = (shot: RateFragment, targetSymbol: string) => {
    // const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, element)
    const inlineShot = InlineItemService.toInlineRateString({
      id: shot.id,
      choice: shot.choice,
      symbol: targetSymbol,
      author: element.authorName ?? '',
    })
    Transforms.setNodes<InlineRateElement>(editor, { id: shot.id }, { at: path })
    Transforms.insertText(editor, inlineShot, { at: path })
  }

  // console.log(element)
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
    <span {...attributes} contentEditable={false}>
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

      <RateButton
        author={element.params.find(e => e.startsWith('@'))}
        target={element.params.find(e => e.startsWith('$'))}
        choice={element.params.find(e => e.startsWith('#'))}
        onClick={() => setShowPopover(true)}
      />

      {showPopover && (
        <Modal visible={showPopover} onClose={() => setShowPopover(false)}>
          <CreateRateForm
            initialInput={{
              author: element.params.find(e => e.startsWith('@')) ?? '',
              target: element.params.find(e => e.startsWith('$')) ?? '',
              choice: (element.params.find(e => e.startsWith('#'))?.substring(1) as RateChoice) ?? 'LONG',
              link: '',
            }}
            onRateCreated={onRateCreated}
          />
        </Modal>
      )}
      <span style={selected ? undefined : { fontSize: '0px' }}>{children}</span>
      {/* <span>{children}</span> */}
    </span>
  )
}

export default InlineRate
