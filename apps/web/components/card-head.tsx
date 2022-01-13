import { useRef, useState } from 'react'
import Link from 'next/link'
import CardMetaForm from './card-meta-form'
import HeaderCardEmojis from './emoji-up-down/header-card-emojis'
import Modal from './modal/modal'
import { Doc } from './workspace/doc'

const CardHead = ({ doc }: { doc: Doc }): JSX.Element | null => {
  const [showModal, setShowModal] = useState(false)
  const [showHiddenDiv, setShowHiddenDiv] = useState(false)
  const hiddenDivRef = useRef<HTMLDivElement>(null)

  const onMouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!hiddenDivRef.current?.contains(event.target as Node)) {
      setShowHiddenDiv(false)
    } else {
      setShowHiddenDiv(true)
    }
  }
  const onMouseOut = () => {
    setShowHiddenDiv(false)
  }
  const metaInput = doc.getCardMetaInput()
  const title = metaInput.title ?? null
  const symbol = doc.getSymbol()

  return (
    <div className="ml-7">
      <Modal
        visible={showModal}
        onClose={() => {
          setShowModal(false)
        }}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800">卡片資訊</h2>
        <CardMetaForm
          metaInput={metaInput}
          onSubmit={input => {
            const { isUpdated } = doc.updateCardMetaInput(input)
            if (isUpdated) {
              doc.save()
              setShowModal(false)
            } else {
              console.warn('card meta input not updated, skip saving')
            }
          }}
        />
      </Modal>

      <div className="mb-4">
        <div onMouseOver={onMouseOver} onMouseOut={onMouseOut} ref={hiddenDivRef}>
          <div className={`flex items-center gap-4 ${showHiddenDiv ? 'opacity-100' : 'opacity-0'}`}>
            <button
              className={`btn-reset-style inline-flex items-center px-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-200`}
              onClick={() => {
                setShowModal(true)
              }}
            >
              <span className="material-icons text-base">edit_note</span>
              <span className="whitespace-nowrap text-sm">編輯卡片資訊</span>
            </button>
          </div>
          {(metaInput.title || metaInput.author || doc.cardCopy?.link) && (
            <div className="flex gap-4 pt-2 text-gray-500">
              {(doc.cardCopy?.sym.type === 'TICKER' || (doc.cardCopy === null && doc.getSymbol().startsWith('$'))) &&
                metaInput.title && <span className="text-sm ">{metaInput.title}</span>}
              {metaInput.author && (
                <Link href={{ pathname: '/author/[author]', query: { author: metaInput.author } }}>
                  <a className="flex-shrink-0 text-sm  hover:underline hover:underline-offset-2">@{metaInput.author}</a>
                </Link>
              )}
              {doc.cardCopy?.link && (
                <a
                  className="flex-shrink min-w-0 truncate text-sm  hover:underline hover:underline-offset-2"
                  href={doc.cardCopy.link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {/* <span className="material-icons text-base">open_in_new</span> */}
                  <span className="truncate">{doc.cardCopy.link.url}</span>
                </a>
              )}
            </div>
          )}

          <h1 className="line-clamp-2 break-all text-gray-800">
            {doc.cardCopy?.sym.type === 'TICKER' || (doc.cardCopy === null && doc.getSymbol().startsWith('$'))
              ? symbol
              : title || symbol}
          </h1>
        </div>

        {/* {doc.cardCopy && <HeaderCardEmojis cardId={doc.cardCopy.id} />} */}

        {/* {cardMetaData?.cardMeta.keywords && (
        <div className={classes.headerKw}>
          {cardMetaData?.cardMeta.keywords.map((e, i) => {
            if (i < 5) {
              return (
                <span className={classes.headerKwEl} key={i}>
                  {e}
                </span>
              )
            }
            return null
          })}
          {cardMetaData.cardMeta.keywords.length > 5 && (
            <span
              className={classes.headerKwElHidden}
              onClick={e => {
                e.stopPropagation()
                setShowKwTooltip(true)
              }}
            >
              ...+{cardMetaData.cardMeta.keywords.length - 5}項
              <MyTooltip
                className={classes.headerKwElTooltip}
                visible={showKwTooltip}
                handleVisibleState={() => {
                  setShowKwTooltip(false)
                }}
              >
                {cardMetaData?.cardMeta.keywords.map((e, i) => {
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
    </div>
  )
}

export default CardHead
