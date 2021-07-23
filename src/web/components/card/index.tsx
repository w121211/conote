import React, { useEffect, useState, useRef } from 'react'
import { Editor, Section, ExtTokenStream, streamToStr, ExtToken } from '../../../packages/editor/src/index'
import { useRouter } from 'next/router'
import { Button } from 'antd'
// import { symbolToUrl, getCardUrlParam } from '../../lib/helper'
import { CardQuery, useCardQuery } from '../../apollo/query.graphql'
import { QueryDataProvider } from '../data-provider'
import TickerAnchor from '../anchor/tickerAnchor'
import { CardBody, CardHead } from '../card'
import Discuss from '../board/board-page'
import EditIcon from '../../assets/svg/edit.svg'
import classes from './card-page.module.scss'
import indexClasses from '../index.module.scss'
import AddIcon from '../../assets/svg/add.svg'
import CardHeadNew from '../../__deprecated__/card-new'

export interface SectData {
  type: string
  content: any
  // markerline?: { anchorId: number; commandId?: number }
}

function CardPage(): JSX.Element {
  // const me = useMe({ redirectTo: '/signin' })
  const router = useRouter()
  // const { u, s } = router.query
  // const url = u as string
  // const symbol = s as string

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
  const [height, setHeight] = useState(0)
  const [path, setPath] = useState<string[]>(['https://www.youtube.com/watch?v=AP_tFwZkIwc'])
  // const [symbol, setSymbol] = useState<string | undefined>()
  // const [url, setUrl] = useState('https://www.youtube.com/watch?v=AP_tFwZkIwc')

  // const cardRef = useRef<any>(null)
  const pathPush = (path: string) => {
    setPath(prev => [...prev, path])
  }
  const symbolHandler = (symbol: string) => {
    // setSymbol(symbol)
    // console.log('setsymbol', symbol)
  }

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
  // useEffect(() => {
  //   document.getElementById('mainInner')?.addEventListener('scroll', () => {
  //     console.log(document.getElementById('mainInner')?.scrollTop)
  //   })
  // })
  // cardRef && console.log(cardRef)

  function _render({ url, symbol }: { url?: string; symbol?: string }): JSX.Element {
    return (
      // <QueryDataProvider
      //   // useQuery={() => useCocardQuery({ variables: { symbol, url } })}
      //   render={(data: CocardQuery) => {
      //     // console.log(data)
      //     if (data && data.cocard) {
      //       // const url = `/card/form?${getCardUrlParam(data.cocard)}`
      //       const editor = new Editor(
      //         data.cocard.body?.text,
      //         data.cocard.body?.meta,
      //         data.cocard.link?.url,
      //         data.cocard.link.oauthorName ?? undefined,
      //       )
      //       editor.flush({ attachMarkerlinesToTokens: true })
      //       const sect = editor.getSections()
      //       return (
      //         <div className={classes.main}>
      //           <div style={{ position: 'fixed', zIndex: 100, left: '25vw' }}>
      //             back
      //             {path.map((e, i) => (
      //               <span
      //                 key={i}
      //                 onClick={() => {
      //                   if (e.includes('http')) {
      //                     // setUrl(e)
      //                     setPath(prev => prev.slice(0, i + 1))
      //                   } else {
      //                     // setSymbol(e)
      //                     setPath(prev => prev.slice(0, i + 1))
      //                   }
      //                 }}
      //               >
      //                 {e}
      //               </span>
      //             ))}
      //           </div>
      //           <div id="mainInner" className={classes.mainInner} onScroll={e => setHeight(e.target.scrollTop)}>
      //             {/* <div className={classes.cardOuter}> */}
      //             {/* <div className={classes.cardInner}> */}
      //             <div className={classes.cardElement}>
      //               <CardBody
      //                 card={data.cocard}
      //                 // cardCommentIdHandler={cardCommentIdHandler}
      //                 titleRefHandler={titleRefHandler}
      //                 showQuestion={showQuestion}
      //                 // commentIdHandler={commentIdHandler}
      //                 anchorIdHandler={anchorIdHandler}
      //                 // pollCommentIdHandler={pollCommentIdHandler}
      //                 clickPoll={clickPoll}
      //                 showDiscuss={showDiscuss}
      //                 anchorIdHL={anchorIdHL}
      //                 // ref={cardRef}
      //                 hlElementHandler={hlElementHandler}
      //                 pathPush={pathPush}
      //                 symbolHandler={symbolHandler}
      //               />
      //             </div>
      //             {/* </div> */}
      //             {/* </div> */}
      //             {/* <Button
      //               className={classes.button}
      //               onClick={() => {
      //                 router.push(url)
      //               }}
      //             > */}
      //             {/* {console.log(url)} */}
      //             {/* <EditIcon className={classes.editIcon} />
      //             </Button> */}
      //             {/* <button
      //               onClick={() => {
      //                 router.push(url)
      //               }}
      //             >
      //               編輯
      //             </button> */}
      //             <CardHead card={data.cocard} sect={sect} height={height} />

      //             <TickerAnchor data={data.cocard} clickHandler={clickHandler} />
      //           </div>
      //           {/* <Discuss
      //             switchTab={discuss}
      //             discussClickLHandler={discussClickLHandler}
      //             discussClickRHandler={discussClickRHandler}
      //             cardCommentId={(data.cocard.meta as CardMeta).commentId.toString()}
      //             commentId={commentId}
      //             anchorId={anchorId}
      //             pollCommentId={pollCommentId}
      //             pollClick={clickPollCommentId}
      //             ref={textRef}
      //             anchorHLHandler={anchorHLHandler}
      //             myScrollIntoView={myScrollIntoView}
      //             resetHighLight={resetHighLight}
      //           /> */}
      //           <div className={indexClasses.newCardBtnContainer} onClick={() => router.push('./card/template')}>
      //             <span className={indexClasses.newCardBtn}>
      //               <AddIcon />
      //             </span>
      //           </div>
      //         </div>
      //       )
      //     }
      //     return null
      //   }}
      // />
      <></>
    )
  }

  if (path[path.length - 1].includes('http')) {
    return _render({ url: path[path.length - 1] })
  } else {
    try {
      return _render({ symbol: path[path.length - 1] })
    } catch {
      return <h1>Symbol format error</h1>
    }
    return <h1>Require URL or Symbol</h1>
  }
}

export default CardPage
