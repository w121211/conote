import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import Popup from '../../components/popup/popup'
import AuthorRateTable, { TableData } from '../../components/list-row/author-rate-table'
import AuthorArticleList from '../../components/list-row/author-article-list'
import AuthorInfo from '../../components/author-info'

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
  const router = useRouter()
  const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <h1>{router.query.author}</h1>

        <AuthorRateTable data={mockRateData} />
        <AuthorInfo />

        <div className="">
          <h2 className="my-5  text-lg text-gray-800 ">文章</h2>
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary=".............. (author: @cnyes)"
          />
          <AuthorArticleList href="#" title="哈哈晶片荒惡化費" summary=".............. (author: @cnyes)" />
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary=".............. (author: @cnyes)"
          />
          <AuthorArticleList href="#" title="哈哈晶片荒惡化費" summary=".............. (author: @cnyes)" />
          <AuthorArticleList
            href="#"
            title="晶片荒惡化費半大跌 交期拉長至逾20周"
            summary=".............. (author: @cnyes)"
          />
          <AuthorArticleList href="#" title="哈哈晶片荒惡化費" summary=".............. (author: @cnyes)" />
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