import React, { useState } from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import UserRateTable, { TableData } from '../../components/user/user-rate-table'
import UserNoteTable from '../../components/user/user-note-table'
import { NoteData } from '../../components/ui-component/note-list'
import Layout from '../../components/ui-component/layout/layout'
import { List, ListElement } from '../../components/ui-component/list'
import {
  DiscussesByUserDocument,
  DiscussesByUserQuery,
  DiscussesByUserQueryVariables,
  DiscussFragment,
  NoteDocFragment,
  NoteDocsByUserDocument,
  NoteDocsByUserQuery,
  NoteDocsByUserQueryVariables,
} from '../../apollo/query.graphql'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import { LatestDiscussTile } from '../../components/latest-discuss-tile'
import { LayoutChildrenPadding } from '../../components/ui-component/layout/layout-children-padding'

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

interface Props {
  noteDocsByUser: NoteDocFragment[]
  discussesByUser: DiscussFragment[]
}

const UserPage = ({
  noteDocsByUser,
  discussesByUser,
}: Props): JSX.Element | null => {
  console.log(noteDocsByUser, discussesByUser)

  // const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  // const [queryUser, { data, loading, error }] = useUserLazyQuery()
  const router = useRouter(),
    {
      query: { userid: userId },
    } = router
  // ,qUser =

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
    <LayoutChildrenPadding>
      <div className="flex flex-col gap-8 ">
        <div className="flex">
          <span className="material-icons mr-2 text-[120px] leading-none text-gray-300 dark:text-gray-400">
            account_circle
          </span>
          <div className="truncate">
            <h1 className="truncate mb-2 font-medium text-gray-800 dark:text-gray-100">
              @{router.query.userid}
            </h1>
            {/* <div className="mb-2 text-lg text-gray-500 dark:text-gray-400">
              建築師
              </div>
              <p className="flex text-sm text-gray-500 dark:text-gray-400">
              <span className="material-icons text-base leading-none">
              cake
              </span>
              10年會員
            </p> */}
          </div>
        </div>
        {/* <div>
          <h2 className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-medium tracking-widest">
          ABOUT
          </h2>
          <p className="text-sm text-gray-800 dark:text-gray-100">
          日本鳥取縣出身的男性聲優，於2019年4月1日加入由好友立花慎之介及福山潤所創立的BLACK
          SHIP，以前是AIR AGENCY所屬。身高173cm，體重65kg，血型是A型。
          </p>
        </div> */}

        {/* {data?.author?.meta} */}
        <div className="flex gap-6">
          <div className="w-1/2">
            <UserNoteTable data={noteDocsByUser} />
          </div>
          {/* <div className="w-1/2">
            <UserRateTable data={mockRateData} />
          </div> */}
        </div>

        <div className="mt-8">
          <h4 className="mb-2 text-gray-700 tracking-widest">DISCUSSES</h4>
          <LatestDiscussTile data={discussesByUser} />
        </div>
      </div>
    </LayoutChildrenPadding>
  )
}

/**
 * TODO:
 * - Currently draft is not able for server-side rendering
 *   because apollo's schema-link does not have 'request' which session data stored in it
 */
export async function getServerSideProps({
  params,
  res,
}: GetServerSidePropsContext<{ userid: string }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')
  const { userid: userId } = params

  const client = getApolloClientSSR(),
    qDocs = await client.query<
      NoteDocsByUserQuery,
      NoteDocsByUserQueryVariables
    >({
      query: NoteDocsByUserDocument,
      variables: { userId },
    }),
    qDiscusses = await client.query<
      DiscussesByUserQuery,
      DiscussesByUserQueryVariables
    >({
      query: DiscussesByUserDocument,
      variables: { userId },
    })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )
  return {
    props: {
      noteDocsByUser: qDocs.data.noteDocsByUser,
      discussesByUser: qDiscusses.data.discussesByUser,
    },
  }
}

export default UserPage
