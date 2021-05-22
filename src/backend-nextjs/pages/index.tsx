// Ref: https://github.com/vercel/next.js/tree/canary/examples/with-typescript-graphql
import { useState } from 'react'
import Link from 'next/link'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { getCardUrlParam } from '../lib/helper'
import { useLatestCardsQuery, useMeQuery } from '../apollo/query.graphql'
import { SearchAllForm } from '../components/search-all-form'

function LatestCards(): JSX.Element | null {
  const { data, loading, error, fetchMore } = useLatestCardsQuery({ fetchPolicy: 'cache-and-network' })
  const [hasMore, setHasMore] = useState<boolean>(true)

  if (error || !data) return <p>Something goes wrong...</p>
  if (data.latestCards.length === 0) return <p>No cards</p>

  const afterId = data.latestCards[data.latestCards.length - 1].id

  // async function onClickMore() {
  //   const result = await fetchMore({ variables: { afterId } })
  //   if (result.data.latestCards.length === 0) {
  //     setHasMore(false)
  //   }
  // }

  return (
    <div>
      {data.latestCards &&
        data.latestCards.map((e, i) => (
          <div key={i}>
            <Link href={`/card?${getCardUrlParam(e)}`}>{e.link.url.substring(0, 50)}</Link>
          </div>
        ))}
      {hasMore ? (
        <div>
          {loading ? (
            <div>Loading</div>
          ) : (
            <button
              onClick={async () => {
                const result = await fetchMore({ variables: { afterId } })
                if (result.data.latestCards.length === 0) {
                  setHasMore(false)
                }
              }}
            >
              更多
            </button>
          )}
        </div>
      ) : (
        <div>已經到底</div>
      )}
    </div>
  )
}

function HomePage(): JSX.Element {
  const { user, error, isLoading } = useUser()
  const { data, loading } = useMeQuery()

  if (loading || isLoading) return <h1>Loading</h1>

  if (user && data) {
    return (
      <div>
        Welcome {data.me.id}! <a href="/api/auth/logout">Logout</a>
        <LatestCards />
      </div>
    )
  }

  return <a href="/api/auth/login">Login</a>
}

export default HomePage

// export const getServerSideProps = withPageAuthRequired()
