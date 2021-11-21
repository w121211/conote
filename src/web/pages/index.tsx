/**
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-typescript-graphql
 */
import { useState } from 'react'
import Link from 'next/link'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
// import { getCardUrlParam } from '../lib/helper'
import { useLatestCardDigestsQuery, useMeQuery } from '../apollo/query.graphql'
import { SearchAllForm } from '../components/search-all-form'
// import { SearchAllForm } from '../components/search-all-form'
import SideBar from '../components/sidebar/sidebar'
import Layout from '../components/layout/layout'
import classes from './index.module.scss'
import { useRouter } from 'next/router'
import BulletSvg from '../components/bullet-svg/bullet-svg'
import ListLarge from '../components/list-large/list-large'

function LatestCards(): JSX.Element | null {
  const router = useRouter()
  const { data, loading, error, fetchMore } = useLatestCardDigestsQuery({ fetchPolicy: 'cache-and-network' })
  const [hasMore, setHasMore] = useState<boolean>(true)

  if (error || !data) return <p>Something goes wrong...</p>
  if (data.latestCardDigests.length === 0) return <p>No cards</p>

  const afterId = data.latestCardDigests[data.latestCardDigests.length - 1].commitId

  // async function onClickMore() {
  //   const result = await fetchMore({ variables: { afterId } })
  //   if (result.data.latestCards.length === 0) {
  //     setHasMore(false)
  //   }
  // }

  return (
    <>
      {data.latestCardDigests &&
        data.latestCardDigests.map((e, i) => (
          <ListLarge
            key={i}
            title={e.symbol}
            href={`/card/${encodeURIComponent(e.symbol)}`}
            sourceUrl={e.symbol.startsWith('@') ? e.symbol.substr(1) : `${router.asPath}card/${e.symbol.substr(1)}`}
            summary="原油 vs 天然氣，哪個比較適合投資？ · 2021Q4油價是否還會持續上漲？ · #討論 #機會 哈哈哈哈啊fj;ejfoi喔喔喔喔喔j sdlkfj;aj · 哈哈哈哈再來"
          />
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
            <div className={classes.innerTop}>
              <h4
                className={`${switchList === 'new' && classes.clickedTab}`}
                onClick={() => {
                  setSwitchList('new')
                }}
              >
                最新
              </h4>
              <h4
                className={`${switchList === 'hot' && classes.clickedTab}`}
                onClick={() => {
                  setSwitchList('hot')
                }}
              >
                熱門
              </h4>
            </div>
            <div className={classes.inner}>
              <div className={classes.innerContent}>
                <div className={classes.new}>
                  {switchList === 'hot' && <h4 className={classes.hotSubtitle}>#討論 #機會 #Battle #事件</h4>}
                  <div className={classes.latestCards}>
                    {switchList === 'new' && <LatestCards />}
                    {switchList === 'hot' && (
                      <div>
                        <div className={classes.hotElement}>
                          <h5 className={`${classes.hashtag} ${classes.blue}`}>#討論</h5>
                          <h4 className={classes.lcElementSymbol}>原油 vs 天然氣，哪個比較適合投資？</h4>
                          <span className={classes.hashtagSymbol}>[[原油]]</span>
                        </div>
                        <div className={classes.divider}></div>
                        <div className={classes.hotElement}>
                          <div className={classes.hashtagContainer}>
                            <h5 className={`${classes.hashtag} ${classes.blue}`}>#討論</h5>
                            <h5 className={`${classes.hashtag} ${classes.orange}`}>#機會</h5>
                          </div>
                          <h4 className={classes.lcElementSymbol}>
                            全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI
                            #多 @匿名)
                          </h4>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* <div className={classes.hot}>
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

                
                </div>
              </div> */}
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
