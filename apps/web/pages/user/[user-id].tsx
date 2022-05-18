import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Layout } from '../../layout/layout'
import Popup from '../../components/popup/popup'
import AuthorArticleList from '../../components/author/author-article-list'
import AuthorMetaModal from '../../components/author/author-meta-modal'
import UserRateTable, { TableData } from '../../components/user/user-rate-table'
import UserNoteTable from '../../components/user/user-note-table'
import { List, ListElement } from '../../layout/list'
import { NoteData } from '../../layout/note-list'

export const mockRateData: TableData[] = [
  {
    ticker: '$TSLA',
    title: 'Tesla Inc.',
    srcSym: '@http://www.youtube.com/xxx',
    rate: 'LONG',
  },
  {
    ticker: '$F',
    title: 'Ford Motor Company',
    srcSym: '@http://www.youtube.com/xwef',
    rate: 'LONG',
  },
  {
    ticker: '$AAPL',
    title: 'Apple Inc.',
    srcSym: '@http://www.youtube.com/sdjd',
    rate: 'LONG',
  },
  {
    ticker: '$NDVA',
    title: 'Nvidia Corporation',
    srcSym: '@http://www.youtube.com/ndewe',
    rate: 'HOLD',
  },
  {
    ticker: '$NFLX',
    title: '',
    srcSym: '@http://www.youtube.com/nflw',
    rate: 'SHORT',
  },
]

const mockList: ListElement[] = [
  {
    title: '原油 vs 天然氣，哪個比較適合投資？',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論', '#機會'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle', '#事件'],
  },
  {
    title: '原油 vs 天然氣，哪個比較適合投資？',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論', '#機會'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle', '#事件'],
  },
]

const mockNoteList: NoteData[] = [
  {
    title: '',
    symbol: '[[保險]]',
    updatedAt: Date.now(),
  },
  {
    title: '',
    symbol: '[[Awesome Tailwind CSS]]',
    updatedAt: Date.now(),
  },
  {
    title: '',
    symbol: '$NDVA',
    updatedAt: Date.now(),
  },
  {
    title: '',
    symbol: '$NDVA',
    updatedAt: Date.now(),
  },
  {
    title: '園藝公司被奧客拖欠工程款，最後怒把對方的花園整個砸爛',
    symbol: '@園藝公司被奧客拖欠工程款，最後怒把對方的花園整個砸爛',
    updatedAt: Date.now(),
  },
]

export const UserPage = (): JSX.Element | null => {
  const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  // const [queryUser, { data, loading, error }] = useUserLazyQuery()
  const router = useRouter()

  // useEffect(() => {
  //   const { query, isReady } = router
  //   if (isReady) {
  //     const { author } = query
  //     if (author && typeof author === 'string') {
  //       queryUser({ variables: { name: 'firebase' } })
  //     }
  //   }
  // }, [router])

  // if (!data === undefined || error || loading) {
  //   return null
  // }

  return (
    <Layout>
      <div className="flex flex-col gap-8 ">
        <div className="flex">
          <span className="material-icons mr-2 text-[120px] leading-none text-gray-300 dark:text-gray-400">
            account_circle
          </span>
          <div className="">
            <h1 className="mb-2 font-medium text-gray-800 dark:text-gray-100">
              @{router.query.userId}
            </h1>
            <div className="mb-2 text-lg text-gray-500 dark:text-gray-400">
              建築師
            </div>
            {/* <div> */}
            <p className="flex text-sm text-gray-500 dark:text-gray-400">
              <span className="material-icons text-base leading-none">
                cake
              </span>
              10年會員
            </p>
            {/* </div> */}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-medium tracking-widest">
            ABOUT
          </h2>
          <p className="text-sm text-gray-800 dark:text-gray-100">
            日本鳥取縣出身的男性聲優，於2019年4月1日加入由好友立花慎之介及福山潤所創立的BLACK
            SHIP，以前是AIR AGENCY所屬。身高173cm，體重65kg，血型是A型。
          </p>
        </div>

        {/* {data?.author?.meta} */}
        <div className="flex gap-6">
          <div className="w-1/2">
            <UserNoteTable data={mockNoteList} />
          </div>
          <div className="w-1/2">
            <UserRateTable data={mockRateData} />
          </div>
        </div>

        <div className="">
          <h2 className="mb-2 text-lg font-medium text-gray-700 ">DISCUSSES</h2>
          <List listData={mockList} />
        </div>
        {/* <h2>Mention in</h2>
        <ul>
          <li
            className="relative block"
            onMouseOver={e => {
              e.stopPropagation()
              setShowMentionedPopup(true)
            }}
          >
            @ARK OOOOOOO
          </li>
          <li>xxxxxxx @ARK OOOOOOO</li>
        </ul> */}
      </div>
      {/* {showMentionedPopup && (
        <Popup
          visible={showMentionedPopup}
          hideBoard={() => {
            setShowMentionedPopup(false)
          }}
          noMask={true}
        >
          文章peek
        </Popup>
      )} */}
    </Layout>
  )
}

export default UserPage
