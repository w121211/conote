import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useApolloClient, useQuery } from '@apollo/client'
import { catchError, combineLatest, interval, of, switchMap } from 'rxjs'
import { useUser } from '@auth0/nextjs-auth0'
import { useObservable } from 'rxjs-hooks'
import { Card, CardMeta, CardMetaInput, useCardLazyQuery, useMeQuery } from '../../apollo/query.graphql'
import Layout from '../../components/layout/layout'
import { Doc, DocEntry, workspace } from '../../components/workspace/workspace'
import { TreeNode } from '../../../packages/docdiff/src'
import { Bullet } from '../../components/bullet/types'
import { BulletEditor } from '../../components/editor/editor'
import { EditorSerializer } from '../../components/editor/serializer'
import { DocPath, DocPathService } from '../../components/workspace/doc-path'
import classes from '../../style/symbol.module.scss'
import CardMetaForm from '../../components/card-meta-form/card-meta-form'
import LinkIcon from '../../assets/svg/link.svg'
import HeaderCardEmojis from '../../components/emoji-up-down/header-card-emojis'
import NavPath from '../../components/nav-path/nav-path'

const CardHead = ({ card, symbol }: { card: Card | null; symbol: string }): JSX.Element => {
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const status = useObservable(() => workspace.status$)
  const [showHeaderHiddenBtns, setShowHeaderHiddenBtns] = useState(false)
  const [cardMetaSubmitted, setCardMetaSubmitted] = useState(false)

  const handleCardMetaSubmitted = () => {
    setCardMetaSubmitted(true)
  }

  return (
    <div className={classes.header}>
      <h1
        onMouseEnter={e => {
          setShowHeaderHiddenBtns(true)
        }}
        onMouseLeave={e => {
          setShowHeaderHiddenBtns(false)
        }}
      >
        <div
          className={classes.headerHiddenBtns}
          style={showHeaderHiddenBtns ? { visibility: 'visible' } : { visibility: 'hidden' }}
        >
          {mainDoc && mainDoc.doc?.cardInput?.meta && (
            <CardMetaForm
              cardId={mainDoc.doc.cid}
              // selfCard={data.selfCard}
              handleCardMetaSubmitted={handleCardMetaSubmitted}
              btnClassName={classes.cardMetaBtn}
            />
          )}
          {mainDoc && mainDoc.doc?.symbol.startsWith('@http') && (
            // <button>
            <a className={classes.cardSource} href={mainDoc.doc?.symbol.substr(1)} target="_blank" rel="noreferrer">
              <LinkIcon />
              開啟來源
            </a>
            // </button>
          )}
        </div>
        {symbol}
      </h1>
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
      <div className={classes.headerBottom}>
        {mainDoc?.doc?.cid && <HeaderCardEmojis cardId={mainDoc?.doc?.cid} />}
        {mainDoc && mainDoc?.doc?.cardInput?.meta?.author && (
          <>
            <div className={classes.divider}></div>
            <Link href={`/author/${encodeURIComponent('@' + mainDoc?.doc?.cardInput?.meta?.author)}`}>
              <a className={classes.author}>@{mainDoc?.doc?.cardInput?.meta?.author}</a>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

const MonoDocEntryLink = ({ entry }: { entry: DocEntry }): JSX.Element => (
  <Link href={DocPathService.toURL(entry.symbol, entry.sourceCardId)}>
    <a>{entry.title}</a>
  </Link>
)

const DocEntryLink = ({ entry }: { entry: DocEntry }): JSX.Element => {
  if (entry.subEntries.length === 0) {
    return <MonoDocEntryLink entry={entry} />
  }
  return (
    <>
      <MonoDocEntryLink entry={entry} />(
      {entry.subEntries.map((e, i) => (
        <MonoDocEntryLink key={i} entry={e} />
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
    card: Card | null
    sourceCard: Card | null
  }
}): JSX.Element | null => {
  const client = useApolloClient()
  const router = useRouter()
  const mainDoc = useObservable(() => workspace.mainDoc$)
  const status = useObservable(() => workspace.status$)
  const workingEntries = useObservable(() => workspace.workingEntries$)

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

  // console.log(card, sourceCard)

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
  return (
    <div>
      <div>{workingEntries && workingEntries.map((e, i) => <DocEntryLink key={i} entry={e} />)}</div>
      {console.log(workingEntries)}
      {/* <NavPath
            path={workingEntries}
            location={{ ...location }}
            mirrorHomeUrl={data.mirror && locationToUrl({ selfSymbol: location.selfSymbol, openedLiPath: [] })}
          /> */}
      <div>{status}</div>

      {/* <div>Source: {mainDoc.doc.sourceCardCopy?.sym.symbol}</div> */}

      <CardHead card={card} symbol={mainDoc.doc.symbol} />

      <BulletEditor doc={mainDoc.doc} />
    </div>
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
    <Layout
      buttonRight={
        <>
          <button
            className="secondary"
            onClick={() => {
              workspace.drop()
            }}
          >
            Drop
          </button>
          <button
            className="primary"
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
            {'儲存草稿'}
            {/* {console.log(isValueModified)} */}
          </button>
          <button
            onClick={async () => {
              if (mainDoc === null) {
                return
              }
              if (mainDoc.doc) {
                await workspace.commit(mainDoc.doc, client)
                router.reload()
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
  )
}

export default CardSymbolPage
