// Ref: https://github.com/vercel/next.js/tree/canary/examples/with-typescript-graphql
import { useState } from 'react'
import Link from 'next/link'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { getCardUrlParam } from '../lib/helper'
import { useLatestCardsQuery, useMeQuery } from '../apollo/query.graphql'
import { SearchAllForm } from '../components/search-all-form'
// import { SearchAllForm } from '../components/search-all-form'
import SideBar from '../components/sidebar/sidebar'
import Layout from '../components/layout/layout'
import classes from './index.module.scss'
import { useRouter } from 'next/router'

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
    <>
      <div>
        {data.latestCards &&
          data.latestCards.map((e, i) => (
            <div key={i} className={classes.latestCardsListText}>
              <span className={classes.latestCardsListIndex}>{i + 1}. </span>
              <Link href={`/card?${getCardUrlParam(e)}`}>
                {e.link.url.substring(0, 50).replace('//', '').replace('[[', '').replace(']]', '')}
              </Link>
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
  )
}

function HomePage(): JSX.Element {
  const router = useRouter()
  const { user, error, isLoading } = useUser()
  const { data, loading } = useMeQuery()

  if (loading || isLoading) return <h1>Loading</h1>

  return (
    // <Layout>
    <div className={classes.container}>
      <div className={classes.outer}>
        <div className={classes.search}>
          <h1>Search</h1>
          <SearchAllForm />
        </div>
        {user && data ? (
          <div className={classes.inner}>
            <h3>最新</h3>
            <div className={classes.latestCards}>
              <LatestCards />
            </div>
          </div>
        ) : (
          <a href="/api/auth/login">Login</a>
        )}
      </div>
      <div className={classes.newCardBtnContainer} onClick={() => router.push('./card/template')}>
        <span className={classes.newCardBtn}>+</span>
      </div>
    </div>
    // {/* </Layout> */}
  )

  // return (
  //   <>
  //     {/* <SideBar /> */}
  //     {/* <SearchAllForm /> */}
  //     {/* <Layout> */}
  //     <div className={classes.routerPage}>
  //       <LatestCards />
  //     </div>
  //     {/* </Layout> */}
  //   </>
  // )
}

export default HomePage

// export const getServerSideProps = withPageAuthRequired()
