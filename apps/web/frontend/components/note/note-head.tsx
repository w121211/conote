import React, { useState } from 'react'
import { NoteDocFragment } from '../../../apollo/query.graphql'
import Modal from '../modal/modal'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'
import { ContentHeadReadonlyForm } from './content-head-readonly-form'

const NoteHead = ({
  symbol,
  doc,
}: {
  symbol: string
  doc: NoteDocFragment
}): JSX.Element | null => {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="ml-4 mb-5">
      <div className="flex items-center gap-2 mb-4">
        {/* <DomainSelect /> */}
        {/* {isNew && (
          <Badge
            content="new"
            bgClassName="bg-yellow-200/60"
            textClassName="font-bold text-xl"
          />
        )} */}
      </div>

      <div className="relative mb-3 ">
        <span className="symbol-link" onClick={() => setShowModal(true)}>
          <h1 className=" line-clamp-2 break-words text-gray-800 dark:text-gray-100 leading-tight">
            {/* {link && (
            <span className="material-icons text-blue-400 text-4xl align-bottom">
            language
            </span>
          )} */}
            {styleSymbol(symbol, doc.contentHead.webpage?.title ?? undefined)}
          </h1>
        </span>
      </div>

      <Modal
        sectionClassName=""
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
  )
}

export default NoteHead
