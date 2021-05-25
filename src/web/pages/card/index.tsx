import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import { symbolToUrl, getCardUrlParam } from '../../lib/helper'
import { CocardQuery, useCocardQuery } from '../../apollo/query.graphql'
import { QueryDataProvider } from '../../components/data-provider'
import TickerAnchor from '../../components/anchor/tickerAnchor'
import { CardBody, CardHead } from '../../components/card'
import Discuss from '../../components/discuss/discuss'
import EditIcon from '../../assets/svg/edit.svg'
import classes from './card-page.module.scss'

function CardPage(): JSX.Element {
  // const me = useMe({ redirectTo: '/signin' })
  const router = useRouter()
  const { u, s } = router.query
  const url = u as string
  const symbol = s as string

  const [Question, setQuestion] = useState(false)
  const [discuss, setDiscuss] = useState(true)
  const [cardCommentId, setCardCommentId] = useState('')
  const [commentId, setCommentId] = useState('')
  const [pollCommentId, setPollCommentId] = useState<string[]>([])
  const [clickPollCommentId, setClickPollCommentId] = useState('')
  const [anchorId, setAnchorId] = useState('')
  const textRef = useRef<HTMLTextAreaElement>(null)

  const discussClickLHandler = () => {
    setDiscuss(true)
  }
  const discussClickRHandler = () => {
    setAnchorId('')
    setDiscuss(false)
  }

  const commentIdHandler = (id: string) => {
    setCommentId(id)
  }
  const cardCommentIdHandler = (id: string) => {
    setCardCommentId(id)
  }
  const anchorIdHandler = (id: string) => {
    setAnchorId(id)
  }

  const pollCommentIdHandler = (id: string) => {
    setPollCommentId(prev => {
      const prevArr = prev
      prevArr.some(e => e === id) || prevArr.push(id)
      return (prev = prevArr)
    })
  }

  const clickPoll = (id: string) => {
    setClickPollCommentId(id)
    setAnchorId('')
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

  const showDiscuss = () => {
    setDiscuss(true)
    // console.log(textRef.current)
    if (textRef) textRef.current?.focus()
  }

<<<<<<< HEAD:src/web/pages/card/index.tsx
<<<<<<< HEAD:src/web/pages/card/index.tsx
  const anchorHLHandler = (clickedAnchorId: string) => {
    setAnchorIdHL(clickedAnchorId)
    // console.log(clickedAnchorId)
  }

  const hlElementHandler = (el: HTMLSpanElement) => {
    setHlElement(el)
  }

  const myScrollIntoView = () => {
    hlElemnt?.scrollIntoView({ behavior: 'smooth' })
  }

  // cardRef && console.log(cardRef)

  
  function _render({ url, symbol }: { url?: string; symbol?: string }): JSX.Element {
=======
=======
>>>>>>> parent of acc302c (5/25):src/backend-nextjs/pages/card/index.tsx
  function _render(url: string): JSX.Element {
>>>>>>> parent of acc302c (5/25):src/backend-nextjs/pages/card/index.tsx
    return (
      <QueryDataProvider
        useQuery={() => useCocardQuery({ variables: { url, symbol } })}
        render={(data: CocardQuery) => {
          if (data && data.cocard) {
            const url = `/card/form?${getCardUrlParam(data.cocard)}`

            return (
              <div className={classes.main}>
                <div className={classes.mainInner}>
                  <TickerAnchor data={data.cocard} clickHandler={clickHandler} />
                  <div className={classes.cardOuter}>
                    <div className={classes.cardInner}>
                      <div className={classes.cardElement}>
                        <CardHead card={data.cocard} />
                        <CardBody
                          card={data.cocard}
                          cardCommentIdHandler={cardCommentIdHandler}
                          titleRefHandler={titleRefHandler}
                          showQuestion={showQuestion}
                          // commentIdHandler={commentIdHandler}
                          anchorIdHandler={anchorIdHandler}
                          pollCommentIdHandler={pollCommentIdHandler}
                          clickPoll={clickPoll}
                          showDiscuss={showDiscuss}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    className={classes.button}
                    onClick={() => {
                      router.push(url)
                    }}
                  >
                    {/* {console.log(url)} */}
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
                  cardCommentId={cardCommentId}
                  commentId={commentId}
                  anchorId={anchorId}
                  pollCommentId={pollCommentId}
                  pollClick={clickPollCommentId}
                  ref={textRef}
                />
              </div>
            )
          }
          return null
        }}
      />
    )
  }

  if (url) {
    return _render({ url })
  }
  if (symbol) {
    try {
      return _render({ symbol })
    } catch {
      return <h1>Symbol format error</h1>
    }
  }
  return <h1>Require URL or Symbol</h1>
}

export default CardPage
