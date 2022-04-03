import { useRef, useState } from 'react'
import Link from 'next/link'
import NoteMetaForm from './note-meta-form'
import HeaderNoteEmojis from './emoji-up-down/header-note-emojis'
import Modal from './modal/modal'
import { Doc } from './workspace/doc'
import Select from 'react-select'
import { styleSymbol } from '../layout/style-symbol'

const NoteHead = ({ doc }: { doc: Doc }): JSX.Element | null => {
  // const [showModal, setShowModal] = useState(false)
  // const [showHiddenDiv, setShowHiddenDiv] = useState(false)
  // const hiddenDivRef = useRef<HTMLDivElement>(null)

  // const onMouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   if (!hiddenDivRef.current?.contains(event.target as Node)) {
  //     setShowHiddenDiv(false)
  //   } else {
  //     setShowHiddenDiv(true)
  //   }
  // }
  // const onMouseOut = () => {
  //   setShowHiddenDiv(false)
  // }
  const metaInput = doc.getNoteMetaInput()
  const title = metaInput.title ?? null
  const symbol = doc.getSymbol()

  return (
    <div className="pl-9 mb-2">
      <div className="flex items-center gap-1 mb-1">
        {!doc?.noteCopy && (
          <span
            className="h-fit bg-yellow-400 text-white px-1 rounded
             text-sm select-none "
          >
            New
          </span>
        )}
      </div>
      {/* <div className={`flex items-center gap-4 ${showHiddenDiv ? 'opacity-100' : 'opacity-0'}`}>
            
            <button
              className={`btn-reset-style inline-flex items-center px-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-200`}
              onClick={() => {
                setShowModal(true)
              }}
            >
              <span className="material-icons text-base">edit_note</span>
              <span className="whitespace-nowrap text-sm">編輯卡片資訊</span>
            </button>
          </div> */}
      {(metaInput.title || metaInput.author || doc.noteCopy?.link) && (
        <div className="flex gap-4 pt-2 text-gray-500">
          {(doc.noteCopy?.sym.type === 'TICKER' || (doc.noteCopy === null && doc.getSymbol().startsWith('$'))) &&
            metaInput.title && <span className="text-sm ">{metaInput.title}</span>}
          {metaInput.author && (
            <Link href={{ pathname: '/author/[author]', query: { author: metaInput.author } }}>
              <a className="flex-shrink-0 text-sm  hover:underline hover:underline-offset-2">@{metaInput.author}</a>
            </Link>
          )}
          {doc.noteCopy?.link && (
            <a
              className="flex-shrink min-w-0 truncate text-sm  hover:underline hover:underline-offset-2"
              href={doc.noteCopy.link.url}
              target="_blank"
              rel="noreferrer"
            >
              {/* <span className="material-icons text-base">open_in_new</span> */}
              <span className="truncate">{doc.noteCopy.link.url}</span>
            </a>
          )}
        </div>
      )}

      <div className="relative">
        <h1 className=" line-clamp-2 break-words text-gray-800 ">
          {doc.noteCopy?.sym.type === 'TICKER' || (doc.noteCopy === null && doc.getSymbol().startsWith('$'))
            ? symbol
            : title || styleSymbol(symbol, '', true)}
        </h1>
      </div>

      {/* {doc.noteCopy && <HeaderNoteEmojis noteId={doc.noteCopy.id} />} */}

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

export default NoteHead
