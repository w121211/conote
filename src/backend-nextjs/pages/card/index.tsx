import { useRouter } from 'next/router'
import { symbolToUrl, getCardUrlParam } from '../../lib/helper'
import { CocardQuery, useCocardQuery } from '../../apollo/query.graphql'
import { QueryDataProvider } from '../../components/data-provider'
<<<<<<< HEAD
import { Button } from 'antd'
import TickerAnchor from '../../components/anchor/tickerAnchor'
import { CardBody, CardHead } from '../../components/card'
import Discuss from '../../components/discuss/discuss'
import useMe from '../../components/use-me'
import EditIcon from '../../assets/svg/edit.svg'
import classes from './card-page.module.scss'
import { useState } from 'react'
=======
import { CardBody, CardHead } from '../../components/card'
import useMe from '../../components/use-me'
>>>>>>> backend-dev

function CardPage(): JSX.Element {
  const me = useMe({ redirectTo: '/signin' })
  const router = useRouter()
  const { u, s } = router.query
  const url = u as string
  const symbol = s as string
<<<<<<< HEAD
  // const [Question, setQuestion] = useState(false)
  const [discuss, setDiscuss] = useState(true)

  const discussClickLHandler = () => {
    setDiscuss(true)
  }
  const discussClickRHandler = () => {
    setDiscuss(false)
  }

  let titleRefArr: any[] = []
  const clickHandler = (e: any, index: number) => {
    titleRefArr[index].scrollIntoView({ behavior: 'smooth' }, 500)
  }
  const titleRefHandler = (arr: any[]) => {
    titleRefArr = arr
  }
  const showQuestion = () => {
    setDiscuss(false)
  }
=======
>>>>>>> backend-dev

  function _render(url: string): JSX.Element {
    return (
      <QueryDataProvider
        useQuery={() => useCocardQuery({ variables: { url } })}
        render={(data: CocardQuery) => {
          if (data && data.cocard) {
            const url = `/card/form?${getCardUrlParam(data.cocard)}`
            return (
<<<<<<< HEAD
              <div className={classes.main}>
                <div className={classes.mainInner}>
                  <TickerAnchor data={data.cocard} clickHandler={clickHandler} />
                  <div className={classes.cardOuter}>
                    <div className={classes.cardInner}>
                      <div className={classes.cardElement}>
                        <CardHead card={data.cocard} />
                        <CardBody card={data.cocard} titleRefHandler={titleRefHandler} showQuestion={showQuestion} />
                      </div>
                    </div>
                  </div>
                  <Button
                    className={classes.button}
                    onClick={() => {
                      router.push(url)
                    }}
                  >
                    {console.log(url)}
                    <EditIcon className={classes.editIcon} />
                  </Button>
                  {/* <button
                    onClick={() => {
                      router.push(url)
                    }}
                  >
                    編輯
                  </button> */}
                </div>
                <Discuss
                  switchTab={discuss}
                  discussClickLHandler={discussClickLHandler}
                  discussClickRHandler={discussClickRHandler}
                />
=======
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
>>>>>>> backend-dev
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
