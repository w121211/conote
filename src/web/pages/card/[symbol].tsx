import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useApolloClient, useQuery } from '@apollo/client'
import { useObservable } from 'rxjs-hooks'
import { CardFragment, useCardLazyQuery, useMeQuery } from '../../apollo/query.graphql'
import Layout from '../../components/layout/layout'
import { workspace } from '../../components/workspace/workspace'
import { BulletEditor } from '../../components/editor/editor'
import { Doc, DocEntry, DocEntryPack } from '../../components/workspace/doc'
import { DocPath, DocPathService } from '../../components/workspace/doc-path'
import CardMetaForm from '../../components/card-meta-form/card-meta-form'
import LinkIcon from '../../assets/svg/link.svg'
import HeaderCardEmojis from '../../components/emoji-up-down/header-card-emojis'
import Modal from '../../components/modal/modal'
import LoginPage from '../login'

const CardHead = ({ doc, card, symbol }: { doc: Doc; card: CardFragment | null; symbol: string }): JSX.Element => {
  // const mainDoc = useObservable(() => workspace.mainDoc$)
  const status = useObservable(() => workspace.status$)
  const [showHeaderHiddenBtns, setShowHeaderHiddenBtns] = useState(false)
  const [cardMetaSubmitted, setCardMetaSubmitted] = useState(false)
  const hiddenBtnRef = useRef<HTMLDivElement>(null)

  const handleCardMetaSubmitted = () => {
    setCardMetaSubmitted(true)
  }

  return (
    <div className="flex flex-col mb-6">
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
          {card && (
            <CardMetaForm
              cardId={card?.id}
              showBtn={showHeaderHiddenBtns}
              handleCardMetaSubmitted={handleCardMetaSubmitted}
            />
          )}

          {doc?.symbol.startsWith('@http') && (
            <a
              className="inline-flex items-center overflow-hidden text-gray-500 hover:text-gray-700"
              href={doc?.symbol.substr(1)}
              style={showHeaderHiddenBtns ? { opacity: 1 } : { opacity: 0 }}
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-icons text-lg">open_in_new</span>
              <span className="flex-shrink min-w-0 overflow-hidden whitespace-nowrap text-ellipsis">
                {card?.meta.url}
              </span>
            </a>
          )}
        </div>
        {card?.meta?.author && (
          <Link href={`/author/${encodeURIComponent('@' + card?.meta?.author)}`}>
            <a className="text-sm text-blue-500 hover:underline hover:underline-offset-1">@{card?.meta?.author}</a>
          </Link>
        )}
        <h1 className="mb-4 line-clamp-2 break-all">{card?.meta.title || symbol}</h1>
      </div>
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
      <div className="flex items-center w-full">{card && <HeaderCardEmojis cardId={card?.id} />}</div>
    </div>
  )
}

const DocEntryLink = ({ entry, symbol }: { entry?: DocEntry; symbol: string }): JSX.Element => {
  if (entry) {
    return (
      <Link href={DocPathService.toURL(entry.symbol, entry.sourceCardId)}>
        <a>{entry.title}</a>
      </Link>
    )
  }
  return (
    <Link href={DocPathService.toURL(symbol)}>
      <a>{symbol} (null doc)</a>
    </Link>
  )
}

const DocEntryPackLink = ({ pack }: { pack: DocEntryPack }): JSX.Element => {
  if (pack.subs.length === 0) {
    return <DocEntryLink {...pack.main} />
  }
  return (
    <>
      <DocEntryLink {...pack.main} />(
      {pack.subs.map((e, i) => (
        <DocEntryLink key={i} entry={e} symbol={e.symbol} />
      ))}
      )
    </>
  )
}

const WorkspaceComponent = ({
  docPath,
  given: { card, sourceCard },
}: {
  docPath: DocPath
  given: {
    card: CardFragment | null
    sourceCard: CardFragment | null
  }
}): JSX.Element | null => {
  const client = useApolloClient()
  const router = useRouter()
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const status = useObservable(() => workspace.status$)
  const savedDocs = useObservable(() => workspace.savedDocs$)
  const committedDocs = useObservable(() => workspace.committedDocs$)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { data: meData, error: meError, loading: meLoading } = useMeQuery()
  const { login } = router.query
  // if (card) {
  //   const a = new Date(card.updatedAt as unknown as string)
  //   console.log(card.updatedAt)
  //   console.log(a)
  // }

  // const saveEvery = useObservable(() =>
  //   combineLatest([interval(60000), workspace.mainDoc$]).pipe(
  //     switchMap(async ([_, mainDoc]) => {
  //       if (mainDoc.doc) {
  //         // console.log(mainDoc.doc)
  //         await workspace.save(mainDoc.doc)
  //       }
  //       return null
  //     }),
  //     catchError(err => of('saveEvery error')),
  //   ),
  // )

  // console.log(savedDocs, committedDocs)

  useEffect(() => {
    workspace.open({ docPath, card, sourceCard })
  }, [docPath, card, sourceCard])

  useEffect(() => {
    if (status === 'droped') {
      workspace.open({ docPath, card, sourceCard })
    }
  }, [status])

  if (mainDoc === null) {
    return null
  }
  if (mainDoc.doc === null) {
    return <div>Unexpected error</div>
  }

  console.log(meData)

  return (
    <>
      <div
        onClick={e => {
          e.stopPropagation()
          // setShowLoginModal(true)

          // if (!meLoading && meError) {
          //   router.push(
          //     { pathname: `/card/[symbol]`, query: { mode: 'login' } },
          //     { pathname: `/card/${encodeURIComponent(docPath.symbol)}`, query: { mode: 'login' } },
          //     {
          //       scroll: false,
          //       shallow: true,
          //     },
          //   )
          // }
        }}
      >
        {/* <div>Saved:{savedDocs && savedDocs.map((e, i) => <DocEntryPackLink key={i} pack={e} />)}</div>
      <div>Committed:{committedDocs && committedDocs.map((e, i) => <DocEntryPackLink key={i} pack={e} />)}</div>

      <div>{status}</div>

      <div>Source: {mainDoc.doc.sourceCardCopy?.sym.symbol}</div> */}

        <CardHead doc={mainDoc.doc} card={card} symbol={mainDoc.doc.symbol} />

        <BulletEditor doc={mainDoc.doc} />
      </div>
    </>
  )
}

const CardSymbolPage = (): JSX.Element | null => {
  const client = useApolloClient()
  const router = useRouter()
  const [queryCard, card] = useCardLazyQuery()
  const [querySourceCard, sourceCard] = useCardLazyQuery()
  const [docPath, setDocPath] = useState<DocPath>()
  const mainDoc = useObservable(() => workspace.mainDoc$)

  // const { user, error: userError, isLoading } = useUser()
  // const { data: meData, loading: meLoading } = useMeQuery({ fetchPolicy: 'cache-first' })

  useEffect(() => {
    if (router.isReady) {
      const path = DocPathService.fromURLQuery(router.query)
      setDocPath(path)

      const { symbol, sourceCardId } = path

      queryCard({ variables: { symbol } })
      if (sourceCardId) {
        querySourceCard({ variables: { id: sourceCardId } })
      }
    }
  }, [router])

  if (docPath === undefined || card.loading || sourceCard.loading) {
    return null
  }
  if (card.error || sourceCard.error) {
    console.error(card.error)
    console.error(sourceCard.error)
    return <div>Unexpected error</div>
  }
  if (card.data === undefined || (docPath.sourceCardId && sourceCard.data === undefined)) {
    return <div>Unexpected error</div>
  }
  return (
    <>
      <Layout
        buttonRight={
          <>
            <button
              className="btn-secondary"
              onClick={() => {
                workspace.drop()
              }}
            >
              Drop
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                if (mainDoc === null) {
                  return
                }
                if (mainDoc.doc) {
                  workspace.save(mainDoc.doc)
                }
              }}
              // disabled={!isValueModified}
            >
              儲存草稿
              {/* {console.log(isValueModified)} */}
            </button>
            <button
              onClick={async () => {
                if (mainDoc === null) {
                  return
                }
                if (mainDoc.doc) {
                  await workspace.commit(mainDoc.doc, client)
                  // router.reload()
                }
              }}
            >
              同步至筆記
            </button>
          </>
        }
      >
        <WorkspaceComponent
          docPath={docPath}
          given={{
            card: card.data.card ?? null,
            sourceCard: sourceCard.data?.card ?? null,
          }}
        />
      </Layout>
      <Modal
        visible={!!router.query.mode}
        onClose={() =>
          router.push(
            { pathname: `/card/[symbol]` },
            { pathname: `/card/${encodeURIComponent(docPath.symbol)}` },
            { scroll: false },
          )
        }
      >
        <LoginPage />
      </Modal>
    </>
  )
}

export default CardSymbolPage
