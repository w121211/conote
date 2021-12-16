import React, { createContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout/layout'
import Popup from '../../components/popup/popup'
import ListRow from '../../components/list-row/list-row'

const AuthorPage = (): JSX.Element | null => {
  const router = useRouter()
  const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  return (
    <Layout>
      <div className="flex flex-col gap-10">
        <h1>{router.query.author}</h1>
        <div className="flex w-full">
          <div className="w-1/2">test</div>
          <div className="flex-grow p-4 border border-gray-300 rounded">
            <h2>Shot(預測)</h2>
            <ListRow href="#" title="$AA" shot="#buy" summary="AAA Company" />
            <ListRow href="#" title="$BB" shot="#sell" />
          </div>
        </div>
        <div className="p-4 border border-gray-300 rounded">
          <h2>文章</h2>
          <ListRow href="#" title="晶片荒惡化費半大跌 交期拉長至逾20周" summary=".............. (author: @cnyes)" />
          <ListRow href="#" title="哈哈晶片荒惡化費" summary=".............. (author: @cnyes)" />
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
