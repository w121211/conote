import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getCardUrlParam, symbolToUrl } from '../../lib/helper'
import { CocardFragment, CocardQuery, useCocardQuery } from '../../apollo/query.graphql'
import { CardBody } from '../../components/card'
import { CardForm } from '../../components/card-form'
import { QueryDataProvider } from '../../components/data-provider'
import useMe from '../../components/use-me'

// interface RouteProps extends RouteComponentProps {
//   me?: QT.me_me
// }

export function CardFormPage(): JSX.Element | null {
  /**
   * TODO:
   * - ticker section
   * - comment freeze -> 暫時方案：與既有comment重複的marker直接忽略不重複創建
   * - 載入預設template
   * - poll marker
   * - pretty form
   * - input auto-complete: ticker, topic
   * - 在編輯時可以叫出其他卡片 & import comment
   * - comment replies
   * - modify/delete existed markers
   */
  const router = useRouter()
  const me = useMe({ redirectTo: '/signin' })

  const { u, s } = router.query
  const url = u as string
  const symbol = s as string

  function _render(url: string): JSX.Element {
    return (
      <QueryDataProvider
        useQuery={() => useCocardQuery({ variables: { url } })}
        render={(data: CocardQuery) => {
          if (data && data.cocard) {
            const url = `/card?${getCardUrlParam(data.cocard)}`
            return (
              <CardForm
                card={data.cocard}
                onFinish={() => {
                  router.push(url)
                }}
              />
            )
          }
          return null
        }}
      />
    )
  }

  if (!me) {
    return <p>Loading...</p>
  }
  if (url) {
    return _render(url)
  }
  if (symbol) {
    try {
      return _render(symbolToUrl(symbol))
    } catch {
      return <h1>Symbol format error</h1>
    }
  }
  return <h1>Require URL or Symbol</h1>
}

// export function PlainWebcardForm() {
//   /** （僅用於測試期間）在沒有預先給URL的情況，用textarea取得URL，再轉至cardForm */
//   const [err, setErr] = useState<string | undefined>()
//   function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
//     const { url, textAfterUrl: text } = findUrl(e.target.value)
//     if (url) {
//       navigate(`/webpage/form?${_toUrlParams('url', url)}`)
//     } else {
//       setErr('No URL found')
//     }
//   }
//   return (
//     <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
//       <pre>URL: 用input首行代表 貼上文字後會自動fetch</pre>
//       {err && <h1>{err}</h1>}
//       <Input.TextArea onChange={onChange} rows={10} autoSize />
//     </Layout.Content>
//   )
// }

export default CardFormPage
