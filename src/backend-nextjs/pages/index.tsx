// Ref: https://github.com/vercel/next.js/tree/canary/examples/with-typescript-graphql
import { useState } from 'react'
import Link from 'next/link'
import { getCardUrlParam } from '../lib/helper'
import { useLatestCardsQuery } from '../apollo/query.graphql'
<<<<<<< HEAD
// import { SearchAllForm } from '../components/search-all-form'
import SideBar from '../components/sidebar/sidebar'
import Layout from '../components/layout/layout'
import useMe from '../components/use-me'
import classes from './index.module.scss'
=======
import { SearchAllForm } from '../components/search-all-form'
import useMe from '../components/use-me'
>>>>>>> backend-dev

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
<<<<<<< HEAD
    <>
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
    </>
=======
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
>>>>>>> backend-dev
  )
}

function HomePage(): JSX.Element {
  const me = useMe({ redirectTo: '/signin' })
  if (!me) {
    return <p>Loading...</p>
  }
  return (
    <>
<<<<<<< HEAD
      {/* <SideBar /> */}
      {/* <SearchAllForm /> */}
      {/* <Layout> */}
      <div className={classes.routerPage}>
        <LatestCards />
      </div>
      {/* </Layout> */}
=======
      <SearchAllForm />
      <LatestCards />
>>>>>>> backend-dev
    </>
  )
}

export default HomePage
