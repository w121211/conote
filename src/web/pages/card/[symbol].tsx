import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useObservable } from 'rxjs-hooks'
import { CardMetaInput } from 'graphql-let/__generated__/__types__'
import { CardFragment, useCardLazyQuery, useCardQuery, useMeQuery } from '../../apollo/query.graphql'
import Layout from '../../components/layout/layout'
import { workspace } from '../../components/workspace/workspace'
import { BulletEditor } from '../../components/editor/editor'
import { Doc } from '../../components/workspace/doc'
import CardMetaForm from '../../components/card-meta-form/card-meta-form'
import HeaderCardEmojis from '../../components/emoji-up-down/header-card-emojis'
import Modal from '../../components/modal/modal'
import SideBar from '../../components/sidebar/sidebar'

// const CardHead = ({ doc }: { doc: Doc }): JSX.Element => {
//   // const mainDoc = useObservable(() => workspace.mainDoc$)
//   // const status = useObservable(() => workspace.status$)
//   const [showHeaderHiddenBtns, setShowHeaderHiddenBtns] = useState(false)
//   const [cardMetaSubmitted, setCardMetaSubmitted] = useState(false)
//   const hiddenBtnRef = useRef<HTMLDivElement>(null)

//   const handleCardMetaSubmitted = () => {
//     setCardMetaSubmitted(true)
//   }

//   const symbol = doc.getSymbol()

//   return (
//     <div className="flex flex-col mb-6">
//       <div
//         onMouseOver={e => {
//           if (!hiddenBtnRef.current?.contains(e.target as Node)) {
//             setShowHeaderHiddenBtns(false)
//           } else {
//             setShowHeaderHiddenBtns(true)
//           }
//         }}
//         onMouseOut={e => {
//           setShowHeaderHiddenBtns(false)
//         }}
//         ref={hiddenBtnRef}
//       >
//         <div className="flex items-center gap-4 mb-2">
//           {card && (
//             <CardMetaForm
//               cardId={card?.id}
//               showBtn={showHeaderHiddenBtns}
//               handleCardMetaSubmitted={handleCardMetaSubmitted}
//             />
//           )}

//           {symbol.startsWith('@http') && (
//             <a
//               className="inline-flex items-center overflow-hidden text-gray-500 hover:text-gray-700"
//               href={symbol.substring(1)}
//               style={showHeaderHiddenBtns ? { opacity: 1 } : { opacity: 0 }}
//               target="_blank"
//               rel="noreferrer"
//             >
//               <span className="material-icons text-lg">open_in_new</span>
//               <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
//                 {card?.meta.url}
//               </span>
//             </a>
//           )}
//         </div>
//         {card?.meta?.author && (
//           <Link href={`/author/${encodeURIComponent('@' + card?.meta?.author)}`}>
//             <a className="text-sm text-blue-500 hover:underline hover:underline-offset-1">@{card?.meta?.author}</a>
//           </Link>
//         )}
//         <h1 className="mb-4 line-clamp-2 break-all">{card?.meta.title || symbol}</h1>
//       </div>
//       {/* {cardMetaData?.cardMeta.keywords && (
//         <div className={classes.headerKw}>
//           {cardMetaData?.cardMeta.keywords.map((e, i) => {
//             if (i < 5) {
//               return (
//                 <span className={classes.headerKwEl} key={i}>
//                   {e}
//                 </span>
//               )
//             }
//             return null
//           })}
//           {cardMetaData.cardMeta.keywords.length > 5 && (
//             <span
//               className={classes.headerKwElHidden}
//               onClick={e => {
//                 e.stopPropagation()
//                 setShowKwTooltip(true)
//               }}
//             >
//               ...+{cardMetaData.cardMeta.keywords.length - 5}項
//               <MyTooltip
//                 className={classes.headerKwElTooltip}
//                 visible={showKwTooltip}
//                 handleVisibleState={() => {
//                   setShowKwTooltip(false)
//                 }}
//               >
//                 {cardMetaData?.cardMeta.keywords.map((e, i) => {
//                   if (i >= 5) {
//                     return (
//                       <span className={classes.headerKwEl} key={i}>
//                         {e}
//                       </span>
//                     )
//                   }
//                   return null
//                 })}
//               </MyTooltip>
//             </span>
//           )}
//         </div>
//       )} */}
//       <div className="flex items-center w-full">{card && <HeaderCardEmojis cardId={card?.id} />}</div>
//     </div>
//   )
// }

// const DocEntryLink = ({ entry, symbol }: { entry?: DocEntry; symbol: string }): JSX.Element => {
//   if (entry) {
//     return (
//       <Link href={DocPathService.toURL(entry.symbol, entry.sourceCardId)}>
//         <a>{entry.title}</a>
//       </Link>
//     )
//   }
//   return (
//     <Link href={DocPathService.toURL(symbol)}>
//       <a>{symbol} (null doc)</a>
//     </Link>
//   )
// }

const _CardMetaForm = ({
  curInput,
  onSubmitted,
}: {
  curInput: CardMetaInput
  onSubmitted: (input: CardMetaInput) => void
}): JSX.Element | null => {
  return (
    <form>
      Title: <input>{curInput.title}</input>
      Author: <input>{curInput.author}</input>
    </form>
  )
}

const CardHead = ({ doc }: { doc: Doc }): JSX.Element | null => {
  const [showHeaderHiddenBtns, setShowHeaderHiddenBtns] = useState(false)
  const [cardMetaSubmitted, setCardMetaSubmitted] = useState(false)
  const hiddenBtnRef = useRef<HTMLDivElement>(null)
  return (
    <div className="mb-4">
      {/* <h1>
        {doc.getTitle()}
        {doc.getSymbol()}
      </h1> */}
      {/* <button
        onClick={() => {
          doc.updateCardSymbol('[[Hahaha]]')
        }}
      > */}
      <div
        onMouseOver={e => {
          if (!hiddenBtnRef.current?.contains(e.target as Node)) {
            setShowHeaderHiddenBtns(false)
          } else {
            setShowHeaderHiddenBtns(true)
          }
        }}
        onMouseOut={e => {
          setShowHeaderHiddenBtns(false)
        }}
        ref={hiddenBtnRef}
      >
        <div className="flex items-center gap-4 mb-2">
          {doc.cardCopy && (
            <CardMetaForm
              cardId={doc.cardCopy.id}
              showBtn={showHeaderHiddenBtns}
              initialValue={doc.getCardMetaInput()}
              onSubmitted={input => {
                const { isUpdated } = doc.updateCardMetaInput(input)
                if (isUpdated) {
                  workspace.save(doc)
                  // workspace.updateEditingDocIndicies() // force update since doc symbol, title may change
                }
              }}
            />
          )}

          {doc.cardCopy?.sym.symbol.startsWith('@http') && (
            <a
              className="inline-flex items-center overflow-hidden text-gray-500 hover:text-gray-700"
              href={doc.cardCopy?.sym.symbol.substring(1)}
              style={showHeaderHiddenBtns ? { opacity: 1 } : { opacity: 0 }}
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-icons text-base">open_in_new</span>
              <span className="flex-shrink min-w-0 truncate text-sm">{doc.cardCopy?.meta.url}</span>
            </a>
          )}
        </div>
        {doc.cardCopy?.meta?.author && (
          <Link href={`/author/${encodeURIComponent('@' + doc.cardCopy?.meta?.author)}`}>
            <a className="text-sm text-blue-500 hover:underline hover:underline-offset-1">
              @{doc.cardCopy?.meta?.author}
            </a>
          </Link>
        )}
        <h1 className="line-clamp-2 break-all text-gray-700">{doc.getTitle() || doc.getSymbol()}</h1>
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

      {doc.cardCopy && <HeaderCardEmojis cardId={doc.cardCopy?.id} />}

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
      {/* <button
        onClick={e => {
          if (mainDoc.doc) {
            workspace.save(mainDoc.doc)
          }
        }}
      >
        Save
      </button> */}
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
    <div className="min-w-[90%] h-[80%] sm:min-w-[50%] pl-4">
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
              整頁顯示
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
