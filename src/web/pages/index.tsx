// Ref: https://github.com/vercel/next.js/tree/canary/examples/with-typescript-graphql
import { useState } from 'react'
import Link from 'next/link'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
// import { getCardUrlParam } from '../lib/helper'
// import { useLatestCardsQuery, useMeQuery } from '../apollo/query.graphql'
import { useLatestCardEntriesQuery, useMeQuery } from '../apollo/query.graphql'
import { SearchAllForm } from '../components/search-all-form'
// import { SearchAllForm } from '../components/search-all-form'
import SideBar from '../components/sidebar/sidebar'
import Layout from '../components/layout/layout'
import classes from './index.module.scss'
import { useRouter } from 'next/router'
import BulletSvg from '../components/bullet-svg/bullet-svg'

function LatestCards(): JSX.Element | null {
  const { data, loading, error, fetchMore } = useLatestCardEntriesQuery({ fetchPolicy: 'cache-and-network' })
  const [hasMore, setHasMore] = useState<boolean>(true)

  if (error || !data) return <p>Something goes wrong...</p>
  if (data.latestCardEntries.length === 0) return <p>No cards</p>

  const afterId = data.latestCardEntries[data.latestCardEntries.length - 1].id

  // async function onClickMore() {
  //   const result = await fetchMore({ variables: { afterId } })
  //   if (result.data.latestCards.length === 0) {
  //     setHasMore(false)
  //   }
  // }

  return (
    <>
      {data.latestCardEntries &&
        data.latestCardEntries.map((e, i) => (
          <div key={i} className={classes.latestCardsListText}>
            <span className={classes.latestCardsListIndex}>{i + 1} </span>
            {/* <BulletSvg className={classes.bulletSvg} /> */}
            {/* {console.log(e)} */}
            <Link href={`/card/${encodeURI(e.symbol)}`}>
              {/* <a>{e.link.url.substring(0, 50).replace('//', '').replace('[[', '').replace(']]', '')}</a> */}
              <a>
                <div>
                  <div className={classes.lcElementSymbol}>{e.symbol}</div>
                  <div className={classes.lcElementInfo}>
                    {e.type === 'WEBPAGE' && <div className={classes.lcElementUrl}> {e.symbol.substr(1)}</div>}
                    <div className={classes.lcElementAuthor}>@cnyes</div>
                  </div>
                </div>
                <div className={classes.lcElementHashtag}>$MU $TXN #up(10) </div>
              </a>
            </Link>
          </div>
        ))}
      {hasMore ? (
        <div>
          {loading ? (
            <div>Loading</div>
          ) : (
            <button
              className={`primary ${classes.moreBtn}`}
              onClick={async () => {
                const result = await fetchMore({ variables: { afterId } })
                if (result.data.latestCardEntries.length === 0) {
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
    </>
  )
}

function HomePage(): JSX.Element {
  const router = useRouter()
  const { user, error, isLoading } = useUser()
  const { data, loading } = useMeQuery()
  const [switchList, setSwitchList] = useState('new')
  // console.log(data)
  if (loading || isLoading) return <h1>Loading</h1>

  return (
    // <Layout navPath={<></>}>
    <div className={classes.container}>
      <nav className={classes.nav}>
        <ul className={classes.navUl}>
          <li>首頁</li>
          <li>收藏</li>
        </ul>
      </nav>
      <div className={classes.outer}>
        <div className={classes.search}>
          <h1>Conote</h1>
          <SearchAllForm />
        </div>
        {user && data ? (
          <>
            <div className={classes.inner}>
              <div className={classes.new}>
                <div className={classes.newHotList}>
                  <h3
                    className={`${switchList === 'new' && classes.clickedTab}`}
                    onClick={() => {
                      setSwitchList('new')
                    }}
                  >
                    最新
                  </h3>
                  <h3
                    className={`${switchList === 'hot' && classes.clickedTab}`}
                    onClick={() => {
                      setSwitchList('hot')
                    }}
                  >
                    熱門
                  </h3>
                </div>
                <div className={classes.latestCards}>
                  {switchList === 'new' && <LatestCards />}
                  {switchList === 'hot' && <LatestCards />}
                </div>
              </div>
              <div className={classes.hot}>
                <h3>Battle</h3>
                <div className={classes.latestCards}>
                  <div className={classes.latestCardsListText}>
                    <div>
                      <div className={classes.lcElementSymbol}>美航空公司比較 $AAL vs $DAL vs $LUV</div>
                      <div className={classes.lcElementHashtag}>#pin #up(30) #down(1) #new #trending </div>
                    </div>
                  </div>
                  <div className={classes.latestCardsListText}>
                    <div>
                      <div className={classes.lcElementSymbol}>美航空公司比較 $AAL vs $DAL vs $LUV</div>
                      <div className={classes.lcElementHashtag}>#pin #up(30) #down(1) #new #trending </div>
                    </div>
                  </div>
                  <div className={classes.latestCardsListText}>
                    <div>
                      <div className={classes.lcElementSymbol}>美航空公司比較 $AAL vs $DAL vs $LUV</div>
                      <div className={classes.lcElementHashtag}>#pin #up(30) #down(1) #new #trending </div>
                    </div>
                  </div>
                  <div className={classes.latestCardsListText}>
                    <div>
                      <div className={classes.lcElementSymbol}>美航空公司比較 $AAL vs $DAL vs $LUV</div>
                      <div className={classes.lcElementHashtag}>#pin #up(30) #down(1) #new #trending </div>
                    </div>
                  </div>
                  <div className={classes.latestCardsListText}>
                    <div>
                      <div className={classes.lcElementSymbol}>美航空公司比較 $AAL vs $DAL vs $LUV</div>
                      <div className={classes.lcElementHashtag}>#pin #up(30) #down(1) #new #trending </div>
                    </div>
                  </div>
                  <div className={classes.latestCardsListText}>
                    <div>
                      <div className={classes.lcElementSymbol}>美航空公司比較 $AAL vs $DAL vs $LUV</div>
                      <div className={classes.lcElementHashtag}>#pin #up(30) #down(1) #new #trending </div>
                    </div>
                  </div>
                  <div className={classes.latestCardsListText}>
                    <div>
                      <div className={classes.lcElementSymbol}>美航空公司比較 $AAL vs $DAL vs $LUV</div>
                      <div className={classes.lcElementHashtag}>#pin #up(30) #down(1) #new #trending </div>
                    </div>
                  </div>
                  <div className={classes.latestCardsListText}>
                    <div>
                      <div className={classes.lcElementSymbol}>美航空公司比較 $AAL vs $DAL vs $LUV</div>
                      <div className={classes.lcElementHashtag}>#pin #up(30) #down(1) #new #trending </div>
                    </div>
                  </div>

                  {/* <LatestCards /> */}
                </div>
              </div>
              <div className={classes.tickerList}>
                <h3>自選股</h3>
                <div className={classes.latestCards}>
                  <div className={classes.latestCardsListText}>
                    <div className={classes.tickerElement}>
                      <div className={classes.lcElementSymbol}>$BA</div>

                      <span>221.39 +0.29 (+0.13%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <a href="/api/auth/login">Login</a>
        )}
      </div>
      {/* <div className={classes.newCardBtnContainer} onClick={() => router.push('./card/template')}>
        <span className={classes.newCardBtn}>+</span>
      </div> */}
    </div>
    // </Layout>
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
