import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../layout/layout'
import Popup from '../../components/popup/popup'
import AuthorArticleList from '../../components/author/author-article-list'
import AuthorMetaModal from '../../components/author/author-meta-modal'
import UserRateTable, { TableData } from '../../components/user/user-rate-table'
import UserNoteTable from '../../components/user/user-note-table'

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

const UserPage = (): JSX.Element | null => {
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
      <div className="flex flex-col gap-8">
        <div className="flex">
          <span className="material-icons mr-2 text-[120px] leading-none text-gray-300 mix-blend-multiply">
            account_circle
          </span>
          <div className="">
            <h1 className="mb-2 font-medium">@{router.query.userId}</h1>
            <div className="mb-2 text-lg text-gray-500">建築師</div>
            {/* <div> */}
            <p className="flex text-sm text-gray-500">
              <span className="material-icons text-base leading-none">cake</span>10年會員
            </p>
            {/* </div> */}
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-sm text-gray-500 font-medium tracking-widest">關於我</h2>
          <p className="text-sm text-gray-800">
            日本鳥取縣出身的男性聲優，於2019年4月1日加入由好友立花慎之介及福山潤所創立的BLACK SHIP，以前是AIR
            AGENCY所屬。身高173cm，體重65kg，血型是A型。
          </p>
        </div>

        {/* {data?.author?.meta} */}
        <div className="flex gap-6">
          <div className="w-1/2">
            <UserNoteTable data={mockRateData} />
          </div>
          <div className="w-1/2">
            <UserRateTable data={mockRateData} />
          </div>
        </div>

        <div className="">
          <h2 className="mb-2 text-lg font-medium text-gray-700 ">討論</h2>
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary="我是內容，我寫了一些東西在這裡，哈哈哈＝＝，效果如何？ fja;lskdj;lfkj aj;sldkjf;kja;sjkd fja;lskjd;lfja;lsj;dlkjffja;skdj;flja; ja;lskjd;flkj; ljj"
          />
          <AuthorArticleList
            href="#"
            title="哈哈晶片荒惡化費"
            summary="我是內容，我寫了一些東西在這裡，哈哈哈＝＝，效果如何？"
          />
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary="我是內容，我寫了一些東西在這裡，哈哈哈＝＝，效果如何？"
          />
          <AuthorArticleList
            href="#"
            title="哈哈晶片荒惡化費"
            summary="我是內容，我寫了一些東西在這裡，哈哈哈＝＝，效果如何？"
          />
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary="我是內容，我寫了一些東西在這裡，哈哈哈＝＝，效果如何？"
          />
          <AuthorArticleList
            href="#"
            title="哈哈晶片荒惡化費"
            summary="我是內容，我寫了一些東西在這裡，哈哈哈＝＝，效果如何？"
          />
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
