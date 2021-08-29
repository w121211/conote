import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import { QueryDataProvider } from '../../../web/components/data-provider'
// import { CardHead, CardBody } from '../../../web/components/card'
// import { CardForm } from '../../../web/components/card-form'
import { useCardQuery, CardQuery, useWebpageCardQuery, WebpageCardQuery } from '../../apollo/query.graphql'
import { Editor, Section, ExtTokenStream, streamToStr, ExtToken } from '../../../packages/editor/src/index'
import CardIndex from '../../components/card-index'

export function CardSymbolPage(): JSX.Element {
  console.log('CardSymbolPage')
  const router = useRouter()
  const { symbol } = router.query

  // const decodeUri = decodeURIComponent(symbol??'')
  // const [edit, setEdit] = useState<boolean>(false)
  // const [mySymbol, setMySymbol] = useState('')
  // const [myUrl, setMyUrl] = useState('')
  // const [urlState, setUrlState] = useState('')
  // const [path, setPath] = useState<string>('')

  // useEffect(() => {
  //   if (symbol && typeof symbol === 'string') {
  //     if (symbol.startsWith('[[') || symbol.includes('$')) {
  //       setMySymbol(symbol)

  //       console.log('setSymbol', symbol)
  //     } else {
  //       setMyUrl(symbol)
  //       console.log('setUrl', symbol)
  //     }
  //   }
  // }, [symbol])

  // const { data: webPageData } = useWebpageCardQuery({
  //   variables: { url: myUrl },
  //   onCompleted(data) {
  //     if (data.webpageCard) {
  //       // setPath(data.webpageCard.symbol)
  //       // setPath([data.webpageCard.symbol])
  //       // setMySymbol(data.webpageCard.symbol)
  //       // console.log('setSymbol query')
  //       // console.log(webPageData.webpageCard)
  //     }
  //   },
  // })
  // useEffect(() => {
  //   if (path[path.length - 1].includes('[[') && path[path.length - 1].includes(']]')) {
  //     setSymbol(path[path.length - 1])
  //   } else {
  //     setUrlState(path[path.length - 1])
  //   }
  // }, [path])
  // const {data:webPageData,loading:webPageLoading,error:webPageError}=useWebpageCardQuery({variables:{url:urlState}})
  // const { data, loading, error } = useCardQuery({ variables: { symbol} })

  // if (data) {
  // if ((data && data.card)||(webPageData&&webPageData.webpageCard)) {
  // const editor = new Editor(
  //   data.card.body?.text,
  //   data.card.body?.meta,
  //   data.card.link?.url,
  //   data.card.link?.oauthorName ?? undefined,
  // )
  // editor.flush({ attachMarkerlinesToTokens: true })
  // const sect = editor.getSections()
  let mySymbol
  let myUrl
  if (symbol && typeof symbol === 'string') {
    if (symbol.startsWith('[[') || symbol.includes('$')) {
      mySymbol = symbol

      console.log('setSymbol', symbol)
    } else {
      myUrl = symbol
      console.log('setUrl', symbol)
    }
  }
  return (
    // <QueryDataProvider
    //   useQuery={() => useCocardQuery({ variables: { url } })}
    //   render={(data: CocardQuery) => {
    // const url = `/card/form?${getCardUrlParam(data.cocard)}`
    // return (
    <div>
      {/* <button
          onClick={() => {
            setEdit(!edit)
          }}
        >
          編輯
        </button> */}

      <CardIndex mySymbol={mySymbol} webPageUrl={myUrl} />

      {/* <CardHead card={data.cocard} sect={sect} height={0} />
        {edit ? (
          <CardForm card={data.cocard} />
        ) : (
          <CardBody
            card={data.cocard}
            clickPoll={() => {}}
            anchorIdHandler={() => {}}
            showDiscuss={() => {}}
            anchorIdHL={''}
            hlElementHandler={() => {}}
            pathPush={() => {
              setPath
            }}
            // symbolHandler={()=>{setSymbol}}
          />
        )} */}
    </div>
    // )
    // }
    // return null
    // }}
    // />
  )
  // }
  // if (symbol) {
  //   try {
  //     symbolToUrl(symbol)
  //     return _render(undefined, symbol)
  //   } catch {
  //     return <h1>Symbol format error</h1>
  //   }
  // }
}
// return <h1>Require URL or Symbol (現階段還未支援symbol)</h1>
// }
export default CardSymbolPage
