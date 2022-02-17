/**
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-typescript-graphql
 */
import { useEffect, useState } from 'react'
import { useCardDigestsQuery, useMeQuery } from '../apollo/query.graphql'
import { SearchAllForm } from '../components/search-all-form'
import MeHeaderItem from '../components/profile/me-header-item'
import NewHotList from '../components/new-hot-list'
import CardDigestComponent from '../components/card-digest-component'

export const LatestCards = (): JSX.Element | null => {
  const { data, loading, error, fetchMore } = useCardDigestsQuery() // { fetchPolicy: 'cache-and-network' }
  const [hasMore, setHasMore] = useState<boolean>(true)

  if (loading) {
    return null
  }
  if (!data || data.cardDigests === undefined) {
    return null
  }
  if (error) {
    return <p>Something goes wrong...</p>
  }
  if (data.cardDigests.length === 0) {
    return <p>No cards</p>
  }

  const afterCommitId = data.cardDigests[data.cardDigests.length - 1].commitId

  // async function onClickMore() {
  //   const result = await fetchMore({ variables: { afterId } })
  //   if (result.data.latestCards.length === 0) {
  //     setHasMore(false)
  //   }
  // }
  // console.log(data.latestCardDigests)
  return (
    <>
      {/* <NewListItem
        cardId={'cardId'}
        title={'水力發電短缺 冰島減供工業用電 拒與新的比特幣礦工簽約'}
        href={'https://news.cnyes.com/news/id/4782741?exp=a'}
        sourceUrl={'https://news.cnyes.com/news/id/4782741?exp=a'}
        summary={[
          '冰島過去因為電力便宜、充沛，曾經是比特幣礦工的天堂，但今年電力緊缺，國家電力公司 Landsvirkjun 已經削減為部分行業提供的電力，包括魚粉工廠、鋁冶煉廠和比特幣礦工。此外，他們也拒絕與加密礦工簽訂新的電力合約。',
          '長期以來，冰島一直吸引著加密貨幣挖礦業務，因為他們擁有豐富的地熱能，可利用地熱能創造廉價且充足的能源供應。全國所有電力均通過可再生能源發電，其中 73% 來自水力發電廠，26.8% 來自地熱能，合占總用電量的 99% 以上。',
          'Landsvirkjun 本周表示，由於水庫水位低、發電站故障以及從外部生產商獲得電力的延遲等因素，導致減少供電，削減的措施立即生效。',
        ]}
        author={'@鉅亨網編譯劉祥航'}
        // hashtags={['$JPY', '[[日本]]', '[[日本央行]]', '[[貨幣政策]]', '[[寬鬆]]', '[[復甦]]', '[[omicron]]']}
        hashtags={['冰島', '比特幣', '挖礦', '電力短缺', '水力', '地熱']}
        shot={'SHOT'}
      />

      <NewListItem
        cardId={'cardId'}
        title={'日本央行副總裁：沒有必要調整超寬鬆貨幣政策'}
        href={'https://news.cnyes.com/news/id/4782649?exp=a'}
        sourceUrl={'https://news.cnyes.com/news/id/4782649?exp=a'}
        summary={[
          '日本央行副總裁雨宮正佳周三 (8 日) 在德島市發表演講，強調在通膨率遠低於 2% 目標值的情況下，央行沒有必要調整超寬鬆的貨幣政策。',
          '雨宮認為，隨著供應限制消退，日本經濟明年有望明顯復甦，但 omicron 等新變種病毒傳播，為前景帶來了不確定性。',
          '他指出，個人消費復甦存在不透明性、以及全球性零組件短缺對製造業影響將長期持續，帶來經濟下行的風險。',
        ]}
        author={'鉅亨網編譯劉祥航'}
        // hashtags={['$JPY', '[[日本]]', '[[日本央行]]', '[[貨幣政策]]', '[[寬鬆]]', '[[復甦]]', '[[omicron]]']}
        hashtags={['$JPY', '[[日本]]', '#討論']}
        shot={'SHOT'}
      />

      <NewListItem
        cardId={'cardId'}
        title={'玉晶光11月營收19.25億元創同期新高 年增6.49%'}
        href={'https://news.cnyes.com/news/id/4782820?exp=a'}
        sourceUrl={'https://news.cnyes.com/news/id/4782820?exp=a'}
        summary={[
          '玉晶光11月營收19.25億元創同期新高 年增6.49%',
          '蘋果 (AAPL-US) iPhone 新機拉貨動能強勁，光學鏡頭廠玉晶光 (3406-TW) 今 (8) 日公布 11 月營收為 19.25 億元，創同期新高，月減 2.1%，年增 6.49%。',
          '在客戶端的拉貨動能不減下，玉晶光第四季營收可望超越去年同期 49.25 億元，為歷年最佳；前 11 月營收為 149.06 億元，年增 3.29%。',
        ]}
        author={'鉅亨網記者張欽發'}
        hashtags={['$AAPL', '$3406:TW', '光學元件', '元宇宙', 'iPhone']}
      />

      <NewListItem
        cardId={'cardId'}
        title={'晶片荒惡化費半大跌 交期拉長至逾20周'}
        href={'https://news.cnyes.com/news/id/4700195'}
        sourceUrl={'https://news.cnyes.com/news/id/4700195'}
        summary={[
          '周二 (10 日) 彭博社報導，根據 Susquehanna Financial Group 研究顯示，7 月份晶片交貨周期 (從訂購到交貨的時間) 延長到了 20.2 周，顯示晶片荒並無趨緩的跡象。',
          '美國商務部長雷蒙多 7 月中旬表示，已開始看到全球晶片短缺問題有所緩解，晶片製造商也承諾生產更多車用晶片，但最新數據卻道出更真實的情況。',
        ]}
        author={'鉅亨網編譯羅昀玫'}
      /> */}
      <div>
        {data.cardDigests.map((e, i) => (
          <CardDigestComponent key={i} digest={e} />
        ))}
      </div>
      {hasMore ? (
        <div>
          {loading ? (
            <div>Loading</div>
          ) : (
            <button
              className={`btn-primary w-full text-center`}
              onClick={async () => {
                const result = await fetchMore({ variables: { afterCommitId } })
                if (result.data.cardDigests.length === 0) {
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
  const [showAnnounce, setAnnounce] = useState(false)
  useEffect(() => {
    if (window.sessionStorage.getItem('announce') === null) {
      window.sessionStorage.setItem('announce', 'true')
      setAnnounce(true)
    } else {
      window.sessionStorage.setItem('announce', showAnnounce ? 'true' : 'false')
    }
  }, [showAnnounce])
  const { data, loading } = useMeQuery()

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <svg className="origin-center animate-loadingSpinner" width="100" height="100">
          <circle
            className="stroke-blue-500 origin-center [stroke-dasharray:187] [stroke-dashoffset:0] animate-loadingCircle"
            cx="50"
            cy="50"
            r="25"
            fill="none"
            strokeWidth={5}
            strokeLinecap="round"
          />
        </svg>
        {/* <h1>Loading</h1> */}
      </div>
    )
  return (
    <div className="flex flex-col w-screen h-screen overflow-auto">
      {showAnnounce && (
        <div className="flex items-center justify-between  p-1  capitalize text-sm text-gray-900 bg-yellow-400/80 text-center">
          <div className="flex-grow flex items-center justify-center  gap-2 ">
            <span className="material-icons">campaign</span>
            <span className=" truncate">new announcement!</span>
          </div>
          <span
            className="material-icons relative inline-block items-center right-0 text-base 
        hover:cursor-pointer hover:text-gray-600"
            onClick={() => {
              setAnnounce(false)
            }}
          >
            close
          </span>
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mx-4 md:mx-10 mt-8 mb-10">
          <div className="flex-3 flex items-center max-w-2xl">
            <h3 className="mr-4 md:mr-10 text-2xl">Konote</h3>
            <div className="w-5/6">
              <SearchAllForm />
            </div>
          </div>
          <MeHeaderItem className="ml-4 sm:ml-0 flex-2 text-right" />
        </div>
        <>
          <div className=" flex pb-[9vh]">
            <div className="flex flex-col items-center md:items-start md:flex-row ms:justify-between  md:w-3/4 md:ml-[calc(4rem+96px)] gap-16">
              <NewHotList />
              <div className=" flex-shrink-0 flex-grow w-screen sm:w-1/3 h-fit px-4 rounded border border-gray-300">
                <h3>自選股</h3>
                <div>
                  <div className="flex mb-3 pb-3 border-b border-gray-300 text-gray-700">
                    <div className="flex justify-between w-full">
                      <h4 className="text-blue-800">$BA</h4>
                      <span>221.39 +0.29 (+0.13%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  )
}

export default HomePage
