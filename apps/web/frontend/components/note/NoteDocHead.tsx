import { isNil } from 'lodash'
import moment from 'moment'
import Link from 'next/link'
import React, { useState } from 'react'
import { NoteDocFragment } from '../../../apollo/query.graphql'
import { NoteDocMetaMergeState } from '../../../lib/interfaces'
import { getUserPageURL } from '../../utils'
import Modal from '../modal/modal'
import SymbolDecorate from '../symbol/SymbolDecorate'
import { styleSymbol } from '../ui/style-fc/style-symbol'
import { ContentHeadReadonlyForm } from './content-head-readonly-form'

function renderMergeState(
  doc: NoteDocFragment,
  setShowMergePollModal: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const {
    meta: { mergeState },
    mergePollId,
  } = doc

  let desc
  switch (mergeState as NoteDocMetaMergeState) {
    case 'wait_to_merge-by_poll': {
      if (isNil(mergePollId)) throw new Error('isNil(mergePollId)')
      desc = (
        <span>
          Requesting to merge.{' '}
          <button className="link" onClick={() => setShowMergePollModal(true)}>
            See poll
          </button>
        </span>
      )
      break
    }
    case 'merged_auto-initial_commit':
      desc = <span>Merged automatically by initia-commit-rule</span>
      break
    case 'merged_auto-only_insertions':
      desc = <span>Merged automatically by only-insertion-rule</span>
      break
    case 'merged_auto-same_user':
      desc = <span>Merged automatically by same-user-rule</span>
      break
    case 'rejected_poll': {
      if (isNil(mergePollId)) throw new Error('isNil(mergePollId)')
      desc = (
        <span>
          Rejected by poll.{' '}
          <button className="link" onClick={() => setShowMergePollModal(true)}>
            See poll
          </button>
        </span>
      )
      break
    }
  }

  if (desc) {
    return (
      <>
        <span className="material-icons-outlined text-base mr-1 align-middle">
          merge
        </span>
        {desc}
      </>
    )
  }
  return null
}

const NoteDocHead = ({
  symbol,
  doc,
  isHeadDoc,
  setShowMergePollModal,
}: {
  symbol: string
  doc: NoteDocFragment
  isHeadDoc: boolean
  setShowMergePollModal: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element | null => {
  const [showModal, setShowModal] = useState(false),
    mergeState = renderMergeState(doc, setShowMergePollModal)

  return (
    <>
      <Modal
        // sectionClassName=""
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="w-full px-4 md:py-6 md:px-10">
          {/* <h2 className="mt-0 mb-4 sm:mb-6 font-bold text-gray-800">
            Note meta
          </h2> */}
          {/* TODO: A read onlyl form */}
          <ContentHeadReadonlyForm doc={doc} />
          {/* <div>A read onlyl form</div> */}
        </div>
      </Modal>

      <div className="mb-5">
        {/* <div className="flex items-center gap-2 mb-4">
          <DomainSelect />
          {isNew && (
          <Badge
            content="new"
            bgClassName="bg-yellow-200/60"
            textClassName="font-bold text-xl"
          />
        )}
        </div> */}

        <div className="relative mb-3 ">
          <h1 className="line-clamp-2 break-words text-gray-800 dark:text-gray-100 leading-tight">
            {/* {link && (
            <span className="material-icons text-blue-400 text-4xl align-bottom">
            language
            </span>
          )} */}
            <span className="symbol-link" onClick={() => setShowModal(true)}>
              {/* {styleSymbol(symbol, doc.contentHead.webpage?.title)} */}
              <SymbolDecorate
                symbolStr={symbol}
                title={doc.contentHead.webpage?.title ?? undefined}
              />

              <span className="ml-2 text-gray-400/50 dark:text-gray-400 font-light">
                {!isHeadDoc && `#${doc.id.slice(-6)}`}
              </span>
            </span>
          </h1>
        </div>

        <div className="flex flex-col text-gray-600 space-y-1">
          <p className="text-sm">
            <span className="material-icons-outlined mr-1 text-base align-middle">
              draft
            </span>
            <Link href={getUserPageURL(doc.userId)}>
              <a className="link">@{doc.userId.slice(-6)}</a>
            </Link>{' '}
            committed at {moment(doc.updatedAt).format('L')}
          </p>

          {mergeState && <p className="text-sm">{mergeState}</p>}
        </div>

        {/* {(fetchTime || link) && (
        <div className="flex flex-col text-gray-400 text-sm italic">
          {link && (
            <p className="truncate first-letter:capitalize">
              link:<span> </span>
              <a
                className="flex-shrink min-w-0 truncate hover:underline hover:underline-offset-2"
                target="_blank"
                href={link}
                rel="noreferrer"
              >
                {link}
              </a>
            </p>
          )}
          {fetchTime && (
            <p className="first-letter:capitalize">
              fetch time: {moment(fetchTime).calendar()}
            </p>
          )}
        </div>
      )} */}

        {/* {doc.noteCopy && <NoteEmojis noteId={doc.noteCopy.id} />} */}

        {/* {noteMetaData?.noteMeta.keywords && (
        <div className={classes.headerKw}>
          {noteMetaData?.noteMeta.keywords.map((e, i) => {
            if (i < 5) {
              return (
                <span className={classes.headerKwEl} key={i}>
                  {e}
                </span>
              )
            }
            return null
          })}
          {noteMetaData.noteMeta.keywords.length > 5 && (
            <span
              className={classes.headerKwElHidden}
              onClick={e => {
                e.stopPropagation()
                setShowKwTooltip(true)
              }}
            >
              ...+{noteMetaData.noteMeta.keywords.length - 5}項
              <MyTooltip
                className={classes.headerKwElTooltip}
                visible={showKwTooltip}
                handleVisibleState={() => {
                  setShowKwTooltip(false)
                }}
              >
                {noteMetaData?.noteMeta.keywords.map((e, i) => {
                  if (i >= 5) {
                    return (
                      <span className={classes.headerKwEl} key={i}>
                        {e}
                      </span>
                    )
                  }
                  return null
                })}
              </MyTooltip>
            </span>
          )}
        </div>
      )} */}

        {/* ---notification block--- */}

        {/* <div className="flex flex-col gap-2 mt-4 text-gray-800 dark:text-gray-100 text-sm">
        <Alert
          type="warning"
          action="merg"
          str="A new commit 9031jd2 is waiting to merge "
          time="(5 hours ago)"
          visible={showAlert[0]}
          onClose={() => {
            setShowAlert({ ...showAlert, 0: false })
          }}
        />
        <Alert
          type="success"
          action="rename"
          str="Agree rename this note to [[Awesome Tailwind css]] ? "
          time="(16 hours ago)"
          visible={showAlert[1]}
          onClose={() => {
            setShowAlert({ ...showAlert, 1: false })
          }}
        />
      </div> */}
      </div>
    </>
  )
}

export default NoteDocHead
