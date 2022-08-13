import { isNil } from 'lodash'
import React, { useState } from 'react'
import { parseSymbol } from '../../../../../../share/symbol.common'
import Modal from '../../../../modal/modal'
import SymbolDecorate from '../../../../symbol/SymbolDecorate'
import { Alert } from '../../../../ui/alert'
import { styleSymbol } from '../../../../ui/style-fc/style-symbol'
import type { Doc } from '../../interfaces'
import { ContentHeadForm } from './content-head-form'

const DocHead = ({ doc }: { doc: Doc }): JSX.Element | null => {
  const [showModal, setShowModal] = useState(false)
  // const editing = cur.__typename === 'NoteDraft'
  const newSymbol =
    !isNil(doc.contentHead.symbol) &&
    doc.contentHead.symbol !== doc.noteDraftCopy.symbol
      ? doc.contentHead.symbol
      : null

  const symbol = doc.noteDraftCopy.symbol,
    symbolParsed = parseSymbol(symbol)

  // const newSymbol = doc.noteCopy && doc.contentHead.symbol !== doc.symbol ?

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

      <div className="mb-1">
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

        <div className="relative mb-1">
          <h3 className="text-gray-800 dark:text-gray-100 leading-tight line-clamp-2 break-words">
            {/* {link && (
            <span className="material-icons-outlined text-blue-400 text-4xl align-bottom">
            language
            </span>
          )} */}
            <span
              className="symbol-link"
              onClick={() => setShowModal(true)}
              // role='button'
            >
              {/* {styleSymbol(
                doc.noteDraftCopy.symbol,
                doc.contentHead.webpage?.title ?? undefined,
              )} */}
              <SymbolDecorate
                symbolStr={doc.noteDraftCopy.symbol}
                title={doc.contentHead.webpage?.title ?? undefined}
              />

              {newSymbol && (
                <>
                  <span className="text-gray-300 mx-2">→</span>
                  {styleSymbol(newSymbol)}
                </>
              )}
            </span>

            {symbolParsed.url && (
              <a
                href={symbolParsed.url.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-icons-outlined align-middle ml-2 text-xl text-gray-600">
                  open_in_new
                </span>
              </a>
            )}
          </h3>
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
        {/* <div className="flex flex-col gap-2 mt-4 text-gray-800 dark:text-gray-100 text-sm"> */}
        {/* <Alert
          type="warning"
          action="merge"
          // str="A new commit 9031jd2 is waiting to merge "
          // time="(5 hours ago)"
          // visible={showAlert[0]}
          // onClose={() => {
          //   setShowAlert({ ...showAlert, 0: false })
          // }}
        >
          <span>Hello world</span>
        </Alert> */}
        {/* <Alert
          type="success"
          action="rename"
          str="Agree rename this note to [[Awesome Tailwind css]] ? "
          time="(16 hours ago)"
          visible={showAlert[1]}
          onClose={() => {
            setShowAlert({ ...showAlert, 1: false })
          }}
        /> */}
        {/* </div> */}
      </div>
    </>
  )
}

export default DocHead
