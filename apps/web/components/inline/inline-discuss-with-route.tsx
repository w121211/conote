import React, { useState } from 'react'
import { Transforms } from 'slate'
import { ReactEditor, RenderElementProps, useSelected, useSlateStatic } from 'slate-react'
import { DiscussFragment } from '../../apollo/query.graphql'
import { InlineDiscussElement } from '../editor/slate-custom-types'
import Modal from '../modal/modal'
// import RateButton from '../rate-form/rate-button'
// import CreateRateForm from '../rate-form/create-rate-form'
// import UpdateRateForm from '../rate-form/update-rate-form'
import { InlineItemService } from './inline-item-service'
import { useRouter } from 'next/router'
import CreateDiscussForm from '../discuss/create-discuss-form'
import { workspace } from '../workspace/workspace'
import { useObservable } from 'rxjs-hooks'

const InlineDiscuss = ({
  children,
  attributes,
  element,
}: RenderElementProps & { element: InlineDiscussElement }): JSX.Element => {
  const router = useRouter()
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const editor = useSlateStatic()
  const selected = useSelected()
  const [showModal, setShowModal] = useState(false)

  // const [shotId, setShotId] = useState(element.id)
  // const [shotData, setShotData] = useState<ShotFragment | undefined>()
  // const { data: targetData } = useNoteQuery({ variables: { id: shotId } })

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
  const onDiscussCreated = (data: DiscussFragment) => {
    const path = ReactEditor.findPath(editor, element)
    const inlineDiscuss = InlineItemService.toInlineDiscussString({
      id: data.id,
      title: data.title,
    })
    Transforms.setNodes<InlineDiscussElement>(editor, { id: data.id }, { at: path })
    Transforms.insertText(editor, inlineDiscuss, { at: path })
    setShowModal(false)
  }

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
      <a
        className="text-blue-500 cursor-pointer hover:underline-offset-2 hover:underline"
        onClick={() => {
          // setShowModal(true)
          if (element.id) {
            router.push(
              // { pathname: '/discuss/[discussId]', query: { discussId: element.str } },
              { pathname: router.pathname, query: { symbol: router.query.symbol, discuss: element.id } },
              `/discuss/${encodeURIComponent(element.id)}`,
              {
                shallow: true,
              },
            )
          } else {
            setShowModal(true)
          }
        }}
      >
        {children}
      </a>
      <Modal
        visible={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        buttons={
          <button form="create-discuss-form" className="btn-primary h-10 w-24 " type="submit">
            提交
          </button>
        }
      >
        {mainDoc && mainDoc.doc && mainDoc.doc.noteCopy?.id ? (
          <CreateDiscussForm
            noteId={mainDoc.doc.noteCopy?.id}
            title={element.str.substring(1, element.str.length - 1)}
            onCreated={onDiscussCreated}
          />
        ) : (
          <span>Error</span>
        )}
      </Modal>
    </span>
  )
}

export default InlineDiscuss
