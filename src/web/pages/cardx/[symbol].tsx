import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useApolloClient, useQuery } from '@apollo/client'
import { catchError, combineLatest, interval, of, switchMap } from 'rxjs'
import { useUser } from '@auth0/nextjs-auth0'
import { useObservable } from 'rxjs-hooks'
import { Card, CardMeta, useCardLazyQuery, useMeQuery } from '../../apollo/query.graphql'
import Layout from '../../components/layout/layout'
import { Doc, DocEntry, workspace } from '../../components/workspace/workspace'
import { TreeNode } from '../../../packages/docdiff/src'
import { Bullet } from '../../components/bullet/types'
import { BulletEditor } from '../../components/editor/editor'
import { EditorSerializer } from '../../components/editor/serializer'
import { DocPath, DocPathService } from '../../components/workspace/doc-path'

const CardHead = ({ card, symbol }: { card: Card | null; symbol: string }): JSX.Element => {
  return (
    <div>
      <h1>{symbol}</h1>
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

      <div>{status}</div>

      <div>Source: {mainDoc.doc.sourceCardCopy?.sym.symbol}</div>

      <button
        onClick={() => {
          workspace.drop()
        }}
      >
        Drop
      </button>
      <button
        onClick={async () => {
          if (mainDoc.doc) {
            await workspace.commit(mainDoc.doc, client)
            router.reload()
          }
        }}
      >
        Commit
      </button>
      <button
        onClick={() => {
          if (mainDoc.doc) {
            workspace.save(mainDoc.doc)
          }
        }}
      >
        Save
      </button>

      <CardHead card={card} symbol={mainDoc.doc.symbol} />

      <BulletEditor doc={mainDoc.doc} />
    </div>
  )
}

const CardSymbolPage = (): JSX.Element | null => {
  const router = useRouter()
  const [queryCard, card] = useCardLazyQuery()
  const [querySourceCard, sourceCard] = useCardLazyQuery()
  const [docPath, setDocPath] = useState<DocPath>()

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
    <Layout>
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
