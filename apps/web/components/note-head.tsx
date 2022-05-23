import React, { useState } from 'react'
import moment from 'moment'
import { styleSymbol } from '../layout/style-fc/style-symbol'
import DomainSelect from './domain/domain-select'
import NoteEmojis from './emoji/note-emojis'
import Modal from './modal/modal'
import NoteMetaForm from './note-meta-form/note-meta-form'

interface NoteHeadProps {
  isNew: boolean
  symbol: string
  title: string | undefined
  link: string | undefined
  fetchTime: Date | undefined
  nodeId: string
}

export const NoteHead = (props: NoteHeadProps): JSX.Element | null => {
  const { isNew, symbol, title, link, fetchTime, nodeId } = props
  const [showMetaForm, setShowMetaForm] = useState(false)

  return (
    <div className="ml-6 mb-5">
      <div className="flex items-center gap-2 mb-4">
        <DomainSelect />

        {isNew && (
          <span
            className="h-fit bg-yellow-200/60 text-gray-900 px-2 rounded
             font-[Consolas] select-none font-bold text-xl"
          >
            new
          </span>
        )}
      </div>

      <div
        className="relative mb-3 hover:cursor-pointer"
        onClick={() => {
          setShowMetaForm(true)
        }}
      >
        <h1 className=" line-clamp-2 break-words text-gray-800 dark:text-gray-100 leading-tight">
          {link && (
            <span className="material-icons text-blue-400 text-4xl align-bottom">
              language
            </span>
          )}
          {styleSymbol(symbol, title)}
        </h1>
      </div>

      <Modal
        visible={showMetaForm}
        onClose={() => {
          setShowMetaForm(false)
        }}
      >
        <div className="w-full px-4 md:py-6 md:px-12">
          <h2 className="text-lg mb-4 sm:mb-6 sm:text-2xl font-bold text-gray-800">
            Card meta
          </h2>
          <NoteMetaForm
            type={'TICKER'}
            // metaInput={metaInput}
            onSubmit={input => {
              // const { isUpdated } = doc.updateNoteMetaInput(input)
              // if (isUpdated) {
              //   doc.save()
              //   setShowMetaForm(false)
              // } else {
              //   console.warn('note meta input not updated, skip saving')
              // }
            }}
          />
        </div>
      </Modal>

      {(fetchTime || link) && (
        <div className="flex flex-col text-gray-400 text-sm italic">
          {/* {(doc.noteCopy?.sym.type === 'TICKER' || (doc.noteCopy === null && doc.getSymbol().startsWith('$'))) &&
            metaInput.title && <span className="text-sm ">{metaInput.title}</span>} */}
          {/* {metaInput.author && (
            <Link href={{ pathname: '/author/[author]', query: { author: metaInput.author } }}>
              <a className="flex-shrink-0 text-sm  hover:underline hover:underline-offset-2">@{metaInput.author}</a>
            </Link>
          )} */}
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
      )}

      <NoteEmojis noteId={nodeId} />

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
      <div className="flex flex-col gap-2 mt-4 text-gray-800 dark:text-gray-100 text-sm">
        <p className="py-2 px-1 bg-gray-200/70 dark:bg-gray-600">
          ❗️ <span className="font-bold">[merg]</span>A new commit 9031jd2 is
          waiting to merge (5 hours ago)
        </p>
        <p className="py-2 px-1 bg-gray-200/70 dark:bg-gray-600">
          ❗️ <span className="font-bold">[rename]</span>Agree rename this note
          to{' '}
          <span className="text-blue-500 dark:text-blue-300">
            {styleSymbol('[[Awesome Tailwind css]]', '')}
          </span>{' '}
          ? (16 hours ago)
        </p>
      </div>
    </div>
  )
}
