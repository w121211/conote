import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import { useRouter } from 'next/router'
import { ReactEditor, RenderElementProps, useSelected, useSlateStatic } from 'slate-react'
import Popup from '../popup/popup'
import classes from '../editor/editor.module.scss'
import { InlineRateElement } from '../editor/slate-custom-types'
import { Transforms } from 'slate'
import { RateFragment } from '../../apollo/query.graphql'
import Modal from '../modal/modal'
import CreateShotForm from '../shot-form/create-shot-form'
import ShotBtn from '../shot-button/shotBtn'

const InlineRate = (props: RenderElementProps & { element: InlineRateElement }): JSX.Element => {
  const editor = useSlateStatic()
  const selected = useSelected()

  const { children, attributes, element } = props
  const [showPopover, setShowPopover] = useState(false)
  // const [shotId, setShotId] = useState(element.id)
  // const [shotData, setShotData] = useState<ShotFragment | undefined>()
  // const { data: targetData } = useCardQuery({ variables: { id: shotId } })

  const onShotCreated = (shot: RateFragment, targetSymbol: string) => {
    // const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, element)
    const inlineShot = toInlineRateString({
      id: shot.id,
      choice: shot.choice,
      targetSymbol,
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

      <ShotBtn
        author={element.params.find(e => e.startsWith('@'))}
        target={element.params.find(e => e.startsWith('$'))}
        choice={element.params.find(e => e.startsWith('#'))}
        handleClick={() => setShowPopover(true)}
      />

      {showPopover && (
        <span contentEditable={false}>
          <Modal visible={showPopover} onClose={() => setShowPopover(false)}>
            <CreateShotForm
              initialInput={{
                author: element.authorName ?? '',
                target: element.targetSymbol ?? '',
                choice: element.choice ?? '',
                link: '',
              }}
              onShotCreated={onShotCreated}
            />
          </Modal>
        </span>
      )}
      <span style={selected ? undefined : { fontSize: '0px' }}>{children}</span>
      {/* <span>{children}</span> */}
    </span>
  )
}

export default InlineRate
