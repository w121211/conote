/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react'
import { QueryDataProvider } from '../../../web/components/data-provider'
import { CardHead, CardBody } from '../../../web/components/card'
import { CardForm } from '../../../web/components/card-form'
import { useCocardQuery, CocardQuery } from '../../../web/apollo/query.graphql'

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
  const url = getTabUrl()

  if (url) {
    return (
      <QueryDataProvider
        useQuery={() => useCocardQuery({ variables: { url } })}
        render={(data: CocardQuery) => {
          if (data && data.cocard) {
            // const url = `/card/form?${getCardUrlParam(data.cocard)}`
            return (
              <div>
                <button
                  onClick={() => {
                    setEdit(!edit)
                  }}
                >
                  編輯
                </button>
                <CardHead card={data.cocard} />
                {edit ? (
                  <CardBody
                    card={data.cocard}
                    clickPoll={() => {}}
                    anchorIdHandler={() => {}}
                    showDiscuss={() => {}}
                    anchorIdHL={''}
                    hlElementHandler={() => {}}
                  />
                ) : (
                  <CardForm card={data.cocard} />
                )}
              </div>
            )
          }
          return null
        }}
      />
    )
  }
  // if (symbol) {
  //   try {
  //     symbolToUrl(symbol)
  //     return _render(undefined, symbol)
  //   } catch {
  //     return <h1>Symbol format error</h1>
  //   }
  // }
  return <h1>Require URL or Symbol (現階段還未支援symbol)</h1>
}
