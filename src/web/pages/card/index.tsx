import React, { useEffect, useState, useRef } from 'react'
import { Editor, Section, ExtTokenStream, streamToStr, ExtToken } from '../../../lib/editor/src/index'
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
import { CardMeta } from '../../lib/models/card'
import { CardBody1 } from '../../components/card-body'

export interface SectData {
  type: string
  content: any
  // markerline?: { anchorId: number; commandId?: number }
}

function CardPage(): JSX.Element {
  // const me = useMe({ redirectTo: '/signin' })
  const router = useRouter()
  const { u, s } = router.query
  const url = u as string
  const symbol = s as string

  const [Question, setQuestion] = useState(false)
  const [discuss, setDiscuss] = useState(true)
  // const [cardCommentId, setCardCommentId] = useState('')
  const [commentId, setCommentId] = useState('')
  const [pollCommentId, setPollCommentId] = useState<string[]>([])
  const [clickPollCommentId, setClickPollCommentId] = useState('')
  const [anchorId, setAnchorId] = useState('')
  const [anchorIdHL, setAnchorIdHL] = useState('')
  const [hlElemnt, setHlElement] = useState<HTMLSpanElement>()
  const textRef = useRef<HTMLTextAreaElement>(null)
  // const cardRef = useRef<any>(null)

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
  // console.log(commentId)
  // const cardCommentIdHandler = (id: string) => {
  //   setCardCommentId(id)
  // }
  const anchorIdHandler = (id: string) => {
    setAnchorId(id)
  }

  // const pollCommentIdHandler = (id: string) => {
  //   setPollCommentId(prev => {
  //     const prevArr = prev
  //     prevArr.some(e => e === id) || prevArr.push(id)
  //     return (prev = prevArr)
  //   })
  // }

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

  const anchorHLHandler = (clickedAnchorId: string) => {
    setAnchorIdHL(clickedAnchorId)
    // myScrollIntoView()
    // console.log(clickedAnchorId)
  }

  const hlElementHandler = (el: HTMLSpanElement | null) => {
    if (el) {
      setHlElement(el)
      // el.classList.add('highLight')
      // el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const myScrollIntoView = () => {
    // console.log(hlElemnt?.classList)
    // if (hlElemnt) {
    //   hlElemnt.classList.add('highLight')
    //   hlElemnt.scrollIntoView({ behavior: 'smooth' })
    // }
  }

  const resetHighLight = () => {
    // setAnchorIdHL('')
    hlElemnt?.classList.remove('highLight')
  }

  // cardRef && console.log(cardRef)

  function _render({ url, symbol }: { url?: string; symbol?: string }): JSX.Element {
    return (
      <QueryDataProvider
        useQuery={() => useCocardQuery({ variables: { url, symbol } })}
        render={(data: CocardQuery) => {
          if (data && data.cocard) {
            const url = `/card/form?${getCardUrlParam(data.cocard)}`

            const cardCommentId = (data.cocard.meta as CardMeta).commentId

            // .forEach(sc => sc.stream && (sc.stream as ExtTokenStream[]).filter(e => e !== '\n'))
            const editor = new Editor(
              data.cocard.body?.text,
              data.cocard.body?.meta,
              data.cocard.link.url,
              data.cocard.link.oauthorName ?? undefined,
            )
            editor.flush({ attachMarkerlinesToTokens: true })
            const sect = editor.getSections()
            const sectStreamFilterArr = sect.map(sc => Array.isArray(sc.stream) && sc.stream.filter(e => e !== '\n'))
            const sectData: SectData[] = []
            sectStreamFilterArr.map(e => {
              Array.isArray(e) &&
                e.forEach(el => {
                  el as ExtToken
                  sectData.push({
                    type: (el as ExtToken).type,
                    content: (el as ExtToken).content,
                  })
                })
            })
            console.log(sect)

            console.log('sectStreamFilterArr', sectStreamFilterArr)

            // const contentResolver = (sectData: any) => {
            //   const data: SectData[] = []
            //   if (Array.isArray(sectData)) {
            //     for (const c of sectData) {
            //       const dataType = c.type
            //       const dataContent = []

            //       if (Array.isArray(c.content)) {
            //         const contentArr = []
            //         for (const ca of c.content) {
            //           const caFilter = ca.filter(e => e !== '\n')
            //           contentArr.push({
            //             type: caFilter.type,
            //             content: caFilter.content,
            //             markerline: {
            //               anchorId: caFilter.markerline.anchorId,
            //               commentId: caFilter.markerline.commandId,
            //             },
            //           })
            //         }
            //         dataContent.push(...contentArr)
            //       }

            //       data.push({
            //         type: dataType,
            //         content: dataContent,
            //       })
            //     }
            //   }
            // }

            console.log('sectData', sectData)
            // contentResolver(sectData)
            const dataObj = {
              cardCommentId: (data.cocard.meta as CardMeta).commentId,
              section: function () {
                const editor = new Editor(
                  data.cocard.body?.text,
                  data.cocard.body?.meta,
                  data.cocard.link.url,
                  data.cocard.link.oauthorName ?? undefined,
                )
                editor.flush({ attachMarkerlinesToTokens: true })
                const sect = editor.getSections()
                const sectStreamFilterArr = sect.map(
                  sc => Array.isArray(sc.stream) && sc.stream.filter(e => e !== '\n'),
                )
                const sectData: SectData[] = []
                sectStreamFilterArr.map(e => {
                  Array.isArray(e) &&
                    e.forEach(el => {
                      el as ExtToken
                      sectData.push({
                        type: (el as ExtToken).type,
                        content: Array.isArray((el as ExtToken).content) && (el as ExtToken).content,
                      })
                    })
                })
              },
            }
            return (
              <div className={classes.main}>
                <div className={classes.mainInner}>
                  <TickerAnchor data={data.cocard} clickHandler={clickHandler} />
                  <div className={classes.cardOuter}>
                    <div className={classes.cardInner}>
                      <div className={classes.cardElement}>
                        <CardHead card={data.cocard} />
                        {/* <CardBody1 data={sectData} />
                        {sectData.map((e, i) => (
                          <div className="section" key={i}>
                            {e.type}
                            {console.log('content', e.content)}
                            {Array.isArray(e.content)
                              ? e.content
                                  .filter(ele => ele !== '\n')
                                  .map(
                                    (element, index) => {
                                      element as ExtToken
                                      if (element.type === 'line-mark') {
                                        return <div className="line-mark">{element.content}</div>
                                      }
                                      if (element.type === 'line-value') {
                                        return element.content.map((text, indx) => {
                                          if (indx === element.content.length - 1) {
                                            return (
                                              <>
                                                <span className="stamp">like</span>
                                                <br />
                                              </>
                                            )
                                          }
                                          return (
                                            <span key={indx} className="line-value">
                                              {typeof text === 'string' ? text : text.content}
                                            </span>
                                          )
                                        })
                                      }
                                    },

                                    // <div key={index}> {element}</div>
                                  )
                              : e.content}
                          </div>
                        ))} */}

                        <CardBody
                          card={data.cocard}
                          // cardCommentIdHandler={cardCommentIdHandler}
                          titleRefHandler={titleRefHandler}
                          showQuestion={showQuestion}
                          // commentIdHandler={commentIdHandler}
                          anchorIdHandler={anchorIdHandler}
                          // pollCommentIdHandler={pollCommentIdHandler}
                          clickPoll={clickPoll}
                          showDiscuss={showDiscuss}
                          anchorIdHL={anchorIdHL}
                          // ref={cardRef}
                          hlElementHandler={hlElementHandler}
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
                  cardCommentId={(data.cocard.meta as CardMeta).commentId.toString()}
                  commentId={commentId}
                  anchorId={anchorId}
                  pollCommentId={pollCommentId}
                  pollClick={clickPollCommentId}
                  ref={textRef}
                  anchorHLHandler={anchorHLHandler}
                  myScrollIntoView={myScrollIntoView}
                  resetHighLight={resetHighLight}
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
