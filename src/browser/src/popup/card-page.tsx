/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react'
import { QueryDataProvider } from '../../../web/components/data-provider'
import { CardHead, CardBody } from '../../../web/components/card'
import { CardForm } from '../../../web/components/card-form'
import { useCocardQuery, CocardQuery } from '../../../web/apollo/query.graphql'
import { Editor, Section, ExtTokenStream, streamToStr, ExtToken } from '../../../packages/editor/src/index'

function getTabUrl(): string | null {
  // popup的情況
  const params = new URLSearchParams(new URL(window.location.href).search)
  const url = params.get('u')

  // inject的情況
  // console.log(window.location.href)
  // const url = window.location.href

  return url
}

export function CardPage(): JSX.Element {
  const [edit, setEdit] = useState<boolean>(false)
  const [symbol, setSymbol] = useState('')
  const [urlState, setUrlState] = useState('')
  const [path, setPath] = useState<string[]>([])
  useEffect(() => {
    const url = getTabUrl()
    if (url) {
      setUrlState(url)
      // setQueryVar(url)
      setPath([url])
    }
  }, [])
  useEffect(() => {
    if (path[path.length - 1].includes('[[') && path[path.length - 1].includes(']]')) {
      setSymbol(path[path.length - 1])
    } else {
      setUrlState(path[path.length - 1])
    }
  }, [path])
  const { data, loading, error } = useCocardQuery({ variables: { symbol, url: urlState } })

  // if (data) {
  if (data && data.cocard) {
    const editor = new Editor(
      data.cocard.body?.text,
      data.cocard.body?.meta,
      data.cocard.link?.url,
      data.cocard.link.oauthorName ?? undefined,
    )
    editor.flush({ attachMarkerlinesToTokens: true })
    const sect = editor.getSections()
    return (
      // <QueryDataProvider
      //   useQuery={() => useCocardQuery({ variables: { url } })}
      //   render={(data: CocardQuery) => {
      // const url = `/card/form?${getCardUrlParam(data.cocard)}`
      // return (
      <div>
        <button
          onClick={() => {
            setEdit(!edit)
          }}
        >
          編輯
        </button>
        <CardHead card={data.cocard} sect={sect} height={0} />
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
        )}
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
  return <h1>Require URL or Symbol (現階段還未支援symbol)</h1>
}
