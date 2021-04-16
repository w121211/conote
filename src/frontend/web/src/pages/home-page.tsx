import React, { useState } from 'react'
import { RouteComponentProps, Redirect, Link, navigate } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Button, Layout } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { SearchAllForm } from '../components/forms'
import { getCardUrlParam } from '../helper'

interface RouteProps extends RouteComponentProps {
  me?: QT.me_me
}

function LatestCards(): JSX.Element | null {
  const { data, loading, error, fetchMore } = useQuery<QT.latestCards, QT.latestCardsVariables>(queries.LATEST_CARDS, {
    fetchPolicy: 'cache-and-network',
  })
  const [hasMore, setHasMore] = useState<boolean>(true)

  if (loading) return null
  if (error || !data) return <p>Something goes wrong...</p>

  const afterId = data.latestCards[data.latestCards.length - 1].id

  async function onClickMore() {
    const result = await fetchMore({ variables: { afterId } })
    if (result.data.latestCards.length === 0) {
      setHasMore(false)
    }
  }

  return (
    <div>
      {data.latestCards &&
        data.latestCards.map((e, i) => (
          <div key={i}>
            {e.template === QT.CardTemplate.TICKER ? (
              <Link to={`/give?${getCardUrlParam(e)}`}>{e.link.url.substring(0, 50)}</Link>
            ) : (
              <Link to={`/card?${getCardUrlParam(e)}`}>{e.link.url.substring(0, 50)}</Link>
            )}
          </div>
        ))}
      {hasMore ? <div>{loading ? 'Loading' : <Button onClick={onClickMore}>更多</Button>}</div> : <div>已經到底</div>}
    </div>
  )
  return null
}

export function HomePage({ me }: RouteProps): JSX.Element {
  return (
    <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
      {/* <SearchAllForm /> */}
      <LatestCards />
    </Layout.Content>
  )
}
