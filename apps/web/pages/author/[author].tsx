import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import Popup from '../../components/popup/popup'
import ListRow from '../../components/list-row/list-row'
import AuthorArticleList from '../../components/list-row/author-article-list'
import AuthorInfo from '../../components/author-info'

const AuthorPage = (): JSX.Element | null => {
  const router = useRouter()
  const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  return (
    <Layout>
      <div className="flex flex-col gap-10">
        <h1>{router.query.author}</h1>
        <div className=" w-full">
          <div className="w-1/2">
            <AuthorInfo />
          </div>
          {/* <div className="mx-6 border-l border-gray-200"></div> */}
          <div className="flex-grow ">
            {/* <h2 className="mb-4 text-xl text-gray-900 font-medium">
              Rate
              <span className="text-gray-500 text-base font-normal">(預測)</span>
            </h2> */}
            <ListRow href="#" title="$AA" rate="LONG" summary="AAA Company" />
            <ListRow href="#" title="$BB" rate="SHORT" />
            <ListRow href="#" title="$BB" rate="HOLD" />
          </div>
        </div>
        <div className="">
          <h2 className="my-7  text-xl text-gray-700 font-bold">文章</h2>
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
