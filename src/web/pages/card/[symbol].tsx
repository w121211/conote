import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useObservable } from 'rxjs-hooks'
import { CardFragment, useCardLazyQuery, useCardQuery, useMeQuery } from '../../apollo/query.graphql'
import Layout from '../../components/layout/layout'
import { workspace } from '../../components/workspace/workspace'
import { BulletEditor } from '../../components/editor/editor'
import { Doc } from '../../components/workspace/doc'
import HeaderCardEmojis from '../../components/emoji-up-down/header-card-emojis'
import Modal from '../../components/modal/modal'
import CardMetaForm from '../../components/card-meta-form/card-meta-form'

const CardHead = ({ doc }: { doc: Doc }): JSX.Element | null => {
  const [showBtns, setShowBtns] = useState(false)
  const [showMetaFormModal, setShowMetaFormModal] = useState(false)
  const hiddenBtnRef = useRef<HTMLDivElement>(null)
  const metaInput = doc.getCardMetaInput()

  return (
    <div className="mb-4">
      <div
        onMouseOver={e => {
          if (!hiddenBtnRef.current?.contains(e.target as Node)) {
            setShowBtns(false)
          } else {
            setShowBtns(true)
          }
        }}
        onMouseOut={e => {
          setShowBtns(false)
        }}
        ref={hiddenBtnRef}
      >
        <div className="flex items-center gap-4 mb-2">
          <Modal
            visible={showMetaFormModal}
            onClose={() => {
              setShowMetaFormModal(false)
            }}
          >
            <h2 className="mb-6 text-2xl font-bold text-gray-800">卡片資訊</h2>
            <CardMetaForm
              metaInput={metaInput}
              onSubmit={input => {
                const { isUpdated } = doc.updateCardMetaInput(input)
                if (isUpdated) {
                  doc.save()
                } else {
                  console.warn('card meta input not updated, skip saving')
                }
              }}
            />
          </Modal>

          <button
            className={`btn-reset-style inline-flex items-center text-gray-500 hover:text-gray-700 ${
              showBtns ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => {
              setShowMetaFormModal(true)
            }}
          >
            <span className="material-icons text-base">edit_note</span>
            <span className="whitespace-nowrap text-sm">編輯卡片資訊</span>
          </button>

          {doc.cardCopy?.link && (
            <a
              className="inline-flex items-center overflow-hidden text-gray-500 hover:text-gray-700"
              href={doc.cardCopy.link.url}
              style={showBtns ? { opacity: 1 } : { opacity: 0 }}
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-icons text-base">open_in_new</span>
              <span className="flex-shrink min-w-0 truncate text-sm">{doc.cardCopy.link.url}</span>
            </a>
          )}
        </div>
        {metaInput.author && (
          <Link href={{ pathname: '/author/[author]', query: { author: metaInput.author } }}>
            <a className="text-sm text-blue-500 hover:underline hover:underline-offset-1">@{metaInput.author}</a>
          </Link>
        )}
        <h1 className="line-clamp-2 break-all text-gray-700">{metaInput.title ?? doc.getSymbol()}</h1>
      </div>
      {/* </div> */}
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

      {doc.cardCopy && <HeaderCardEmojis cardId={doc.cardCopy.id} />}

      {/* //   Change Symbol
      // </button> */}
    </div>
  )
}

const MainCardComponent = ({ symbol }: { symbol: string }): JSX.Element | null => {
  const { data, error, loading } = useCardQuery({ variables: { symbol } })
  const mainDoc = useObservable(() => workspace.mainDoc$)

  useEffect(() => {
    if (data) {
      workspace.openDoc({ symbol, card: data.card ?? null })
    }
  }, [data])

  if (loading) {
    return null
  }
  if (error) {
    console.error(error)
    return <div>Unexpected error</div>
  }
  if (data === undefined) {
    return <div>Unexpected error</div>
  }
  if (mainDoc === null || mainDoc.doc === null) {
    return null
  }
  return (
    <>
      <CardHead doc={mainDoc.doc} />
      <BulletEditor doc={mainDoc.doc} />
    </>
  )
}

const ModalCardComponent = ({ symbol }: { symbol: string }): JSX.Element | null => {
  const { data, error, loading } = useCardQuery({ variables: { symbol } })
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const modalDoc = useObservable(() => workspace.modalDoc$)

  useEffect(() => {
    if (data && mainDoc?.doc) {
      // make sure main-doc is existed before open modal-doc
      workspace.openDoc({ symbol, card: data.card ?? null, isModal: true })
    }
  }, [data, mainDoc])

  if (loading) {
    return null
  }
  if (error) {
    console.error(error)
    return <div>Unexpected error</div>
  }
  if (data === undefined) {
    return <div>Unexpected error</div>
  }
  if (modalDoc === null || modalDoc.doc === null) {
    return null
  }
  return (
    <div className="min-w-[90vw] h-[70vh] sm:min-w-[50vw] pl-4">
      <CardHead doc={modalDoc.doc} />
      <BulletEditor doc={modalDoc.doc} />
    </div>
  )
}

const CardSymbolPage = (): JSX.Element | null => {
  const router = useRouter()

  const [mainSymbol, setMainSymbol] = useState<string>()
  const [modalSymbol, setModalSymbol] = useState<string | null>(null)
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const modalDoc = useObservable(() => workspace.modalDoc$)

  const mainCardComponent = useMemo<JSX.Element | null>(() => {
    if (mainSymbol) {
      return <MainCardComponent symbol={mainSymbol} />
    }
    return null
  }, [mainSymbol])
  const modalCardComponent = useMemo<JSX.Element | null>(() => {
    if (modalSymbol) {
      return <ModalCardComponent symbol={modalSymbol} />
    }
    return null
  }, [modalSymbol])

  useEffect(() => {
    const { pathname } = router
    const { symbol, pop } = router.query

    if (typeof symbol !== 'string') {
      return
    }
    if (symbol !== mainSymbol) {
      if (mainDoc?.doc && mainDoc.doc.getChanges().length > 0) {
        workspace.save(mainDoc.doc) // save previous main-doc before switch to another
      }
      workspace.closeDoc({}) // close doc to prevent component rerender
      setMainSymbol(symbol)
    }
    if (typeof pop === 'string') {
      if (pop === symbol) {
        router.push({ pathname, query: { symbol } }) // /$A?pop=$A -> /$A
        return
      }
      if (pop === modalSymbol) {
        return // /$A?pop=$B -> /$A?pop=$B
      }
      if (mainDoc?.doc && mainDoc.doc.getChanges().length > 0) {
        workspace.save(mainDoc.doc) // save current main-doc before open modal
      }
      workspace.closeDoc({ isModal: true }) // close doc to prevent component rerender
      setModalSymbol(pop)
      // console.log(`setModalSymbol ${pop}`)
    } else {
      workspace.closeDoc({ isModal: true }) // close doc to prevent component rerender
      setModalSymbol(null)
      // console.log(`setModalSymbol null`)
    }
  }, [router])

  return (
    <>
      <Modal
        topRightBtn={
          <Link href={{ pathname: '/card/[symbol]', query: { symbol: modalSymbol } }}>
            <a className="flex items-center text-sm text-gray-900 hover:text-gray-600">
              <span className="material-icons text-lg">open_in_full</span>
            </a>
          </Link>
        }
        visible={modalSymbol !== null}
        onClose={async () => {
          if (mainDoc?.doc && modalDoc?.doc) {
            if (modalDoc.doc.getChanges().length > 0) {
              // console.log(modalDoc.doc.getChanges())
              // TODO: strictly check if doc is truly updated
              if ((await Doc.find({ cid: mainDoc.doc.cid })) === null) {
                await workspace.save(mainDoc.doc) // ensure main-doc also save
              }
              await workspace.save(modalDoc.doc)
              workspace.closeDoc({ isModal: true }) // close doc to prevent component rerender
            }
          }
          router.push({ pathname: router.pathname, query: { symbol: router.query.symbol } })
        }}
      >
        {modalCardComponent}
      </Modal>
      {/* {modalCardComponent} */}
      {/* {modalSymbol && <ModalCardComponent symbol={modalSymbol} />} */}
      {/* <button
        onClick={() => {
          workspace.dropAll()
        }}
      >
        Drop All
      </button> */}
      {/* <SideBar
        showMenuHandler={() => {
          //
        }}
        pinMenuHandler={() => {
          //
        }}
        isPined={false}
        showMenu={false}
      /> */}
      <Layout>{mainCardComponent}</Layout>
      {/* {mainCardComponent} */}

      {/* {mainSymbol && <MainCardComponent symbol={mainSymbol} />} */}
    </>
  )
}

export default CardSymbolPage
