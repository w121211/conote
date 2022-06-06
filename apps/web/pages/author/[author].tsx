import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Popup from '../../components/popup/popup'
import AuthorRateTable, {
  TableData,
} from '../../components/author/author-rate-table'
import AuthorArticleList from '../../components/author/author-article-list'
import { useAuthorLazyQuery } from '../../apollo/query.graphql'
import AuthorMetaModal from '../../components/author/author-meta-modal'
import AuthorInfo from '../../components/author/author-info'
import Layout from '../../components/ui-component/layout'

const mockRateData: TableData[] = [
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

const AuthorPage = (): JSX.Element | null => {
  const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  const [queryAuthor, { data, loading, error }] = useAuthorLazyQuery()
  const router = useRouter()

  useEffect(() => {
    const { query, isReady } = router
    if (isReady) {
      const { author } = query
      if (author && typeof author === 'string') {
        queryAuthor({ variables: { name: 'firebase' } })
      }
    }
  }, [router])

  // if (!data === undefined || error || loading) {
  //   return null
  // }

  return (
    <Layout
      buttonRight={data?.author && <AuthorMetaModal data={data.author} />}
    >
      <div className="flex flex-col gap-8">
        <h1>@{router.query.author}</h1>
        {data?.author?.meta}
        <AuthorInfo />
        <AuthorRateTable data={mockRateData} />

        <div className="">
          <h2 className="my-5  text-lg text-gray-800 ">文章</h2>
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary=".............. (author: @cnyes)"
          />
          <AuthorArticleList
            href="#"
            title="哈哈晶片荒惡化費"
            summary=".............. (author: @cnyes)"
          />
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary=".............. (author: @cnyes)"
          />
          <AuthorArticleList
            href="#"
            title="哈哈晶片荒惡化費"
            summary=".............. (author: @cnyes)"
          />
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary=".............. (author: @cnyes)"
          />
          <AuthorArticleList
            href="#"
            title="哈哈晶片荒惡化費"
            summary=".............. (author: @cnyes)"
          />
        </div>
        <h2>Mention in</h2>
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
        </ul>
      </div>
      {showMentionedPopup && (
        <Popup
          visible={showMentionedPopup}
          hideBoard={() => {
            setShowMentionedPopup(false)
          }}
          noMask={true}
        >
          文章peek
        </Popup>
      )}
    </Layout>
  )
}

export default AuthorPage
