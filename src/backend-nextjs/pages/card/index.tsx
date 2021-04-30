import { useRouter } from 'next/router'
import { symbolToUrl, getCardUrlParam } from '../../lib/helper'
import { CocardQuery, useCocardQuery } from '../../apollo/query.graphql'
import { QueryDataProvider } from '../../components/data-provider'
import { CardBody, CardHead } from '../../components/card'
import useMe from '../../components/use-me'

function CardPage(): JSX.Element {
  const me = useMe({ redirectTo: '/signin' })
  const router = useRouter()
  const { u, s } = router.query
  const url = u as string
  const symbol = s as string

  function _render(url: string): JSX.Element {
    return (
      <QueryDataProvider
        useQuery={() => useCocardQuery({ variables: { url } })}
        render={(data: CocardQuery) => {
          if (data && data.cocard) {
            const url = `/card/form?${getCardUrlParam(data.cocard)}`
            return (
              <div>
                <CardHead card={data.cocard} />
                <CardBody card={data.cocard} />
                <button
                  onClick={() => {
                    router.push(url)
                  }}
                >
                  編輯
                </button>
              </div>
            )
          }
          return null
        }}
      />
    )
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

export default CardPage
