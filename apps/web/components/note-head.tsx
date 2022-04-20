import { useRef, useState } from 'react'
import Link from 'next/link'
import NoteMetaForm from './note-meta-form'
import HeaderNoteEmojis from './emoji-up-down/header-note-emojis'
import Modal from './modal/modal'
import { Doc } from './workspace/doc'
import Select from 'react-select'
import { styleSymbol } from '../layout/style-fc/style-symbol'
import moment from 'moment'

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

  return (
    <div className="pl-9 mb-2">
      <div className="flex items-center gap-2 mb-5">
        <span
          className="h-fit bg-orange-200/60 text-gray-900 px-2 rounded
             font-[Consolas] select-none font-bold text-xl"
        >
          dev
        </span>

        {isNew && (
          <span
            className="h-fit bg-yellow-200/60 text-gray-900 px-2 rounded
             font-[Consolas] select-none font-bold text-xl"
          >
            new
          </span>
        )}
      </div>

      <div className="relative ">
        <h1 className=" line-clamp-2 break-words text-gray-800 ">
          {link && (
            <span className="material-icons text-blue-400 text-3xl align-bottom">
              language
            </span>
          )}
          {styleSymbol(symbol, title)}
        </h1>
      </div>

      {(fetchTime || link) && (
        <div className="flex flex-col pt-2 text-gray-400 text-sm italic">
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

      {/* <HeaderNoteEmojis noteId={nodeId} /> */}

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
    </div>
  )
}
