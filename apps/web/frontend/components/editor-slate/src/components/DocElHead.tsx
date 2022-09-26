import { isNil } from 'lodash'
import React, { useState } from 'react'
import { parseSymbol } from '../../../../../share/symbol.common'
import ContentHeadForm from '../../../editor-textarea/src/components/doc/ContentHeadForm'
import { Doc } from '../../../editor-textarea/src/interfaces'
import Modal from '../../../modal/modal'
import { styleSymbol } from '../../../symbol/SymbolDecorate'

const DocElHead = (props: { doc: Doc }): JSX.Element | null => {
  const { doc } = props
  const symbol = doc.noteDraftCopy.symbol
  const symbolParsed = parseSymbol(symbol)
  const { bracketLeftSpan, bracketRightSpan, symbolSpan, urlTitleSpan } =
    styleSymbol(
      symbolParsed,
      doc.contentHead.title ?? doc.contentHead.webpage?.title ?? null,
    )
  const newSymbol =
    !isNil(doc.contentHead.symbol) && doc.contentHead.symbol !== symbol
      ? doc.contentHead.symbol
      : null
  const newSymbolStyle = newSymbol && styleSymbol(parseSymbol(newSymbol), null)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Modal
        sectionClassName=""
        visible={showModal}
        onClose={() => {
          setShowModal(false)
        }}
      >
        <div className="w-full px-4 md:py-6 md:px-10">
          <ContentHeadForm doc={doc} onFinish={() => setShowModal(false)} />
        </div>
      </Modal>

      <div>
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

        <p className="line-clamp-2 break-words font-semibold">
          <span
            className="symbol-input"
            onClick={() => setShowModal(true)}
            // role='button'
          >
            {bracketLeftSpan}
            {symbolSpan}
            {bracketRightSpan}
            {newSymbolStyle && (
              <>
                <span className="text-gray-600 mx-2">→</span>
                {newSymbolStyle.bracketLeftSpan}
                {newSymbolStyle.symbolSpan}
                {newSymbolStyle.bracketRightSpan}
              </>
            )}
          </span>

          {symbolParsed.url && (
            <>
              {/* <button>
                  <span className="material-icons-outlined pl-1 align-middle text-xl text-gray-500">
                    link
                  </span>
                </button> */}

              <span className="material-icons-outlined pl-1 align-middle text-lg text-gray-500">
                open_in_new
              </span>
              <a
                href={symbolParsed.url.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {urlTitleSpan}
              </a>
            </>
          )}
        </p>
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
              ...+{noteMetaData.noteMeta.keywords.length - 5} keywords
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
    </>
  )
}

export default DocElHead
