// import { ReactElement, useState, useEffect } from 'react'
// import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client'
// import { Link, navigate, redirectTo } from '@reach/router'
// import { AutoComplete, Button, Modal, Popover, Tag, Tooltip, Radio, Form, Input } from 'antd'
<<<<<<< HEAD
import React, { useState, useRef, forwardRef } from 'react'
=======
import React from 'react'
>>>>>>> backend-dev
import { Editor, Section, ExtTokenStream, streamToStr } from '../../lib/editor/src/index'
import { CocardFragment, CommentFragment } from '../apollo/query.graphql'
import { AnchorPanel } from './tile-panel'
import { QueryCommentModal } from './tile'
import { toUrlParams } from '../lib/helper'
import { PollChoices } from './poll-form'
import { Link } from './link'
<<<<<<< HEAD
import classes from './card.module.scss'
import ClockIcon from '../assets/svg/clock.svg'
import LinkIcon from '../assets/svg/link.svg'

const RenderTokenStream = forwardRef(
  (
    {
      stream,
      showPanel,
      pushTitle,
      titleRef,
      showQuestion,
      type,
    }: // commentClickHandler,
    {
      stream: ExtTokenStream
      className?: string
      showPanel?: boolean
      pushTitle?: (el: HTMLSpanElement | null) => void
      titleRef?: (arr: any[]) => void
      showQuestion?: () => void
      type?: string
      // commentClickHandler?: () => void
    },
    ref: any,
  ): JSX.Element | null => {
    const inlineValueArr: string[] = [classes.inlineValue]
    const [Panel, setPanel] = useState(false)
    const [commentTextArea, setCommentTextArea] = useState(inlineValueArr)

    const onFocusHandler = (e: any) => {
      e.stopPropagation()
      // e.preventDefault()
      setPanel(true)
    }
    const onBlurHandler = (e: any) => {
      e.stopPropagation()
      // e.preventDefault()
      // if (!commentTextArea) {
      setPanel(false)
      // }
    }
    const commentClickHandler = () => {
      // setPanel(true)
      // setCommentTextArea([classes.inlineValue, classes.inlineValueComment])
      // inlineValueArr.push(classes.inlineValueComment)
      document.getElementById('commentTextArea')?.focus()
    }
    // console.log(commentTextArea)

    // const panelOnClickHandler = (stream: any) => {
    //   console.log(stream)
    //   showPanelHandler?.(stream[1].content)
    // }

    if (typeof stream === 'string') {
      // return stream.search(/\n+/g) >= 0 || stream.search(/ {2,}/g) >= 0 || stream === ' ' ? (
      return stream.search(/\n+/g) >= 0 || stream.search(/ {2,}/g) >= 0 || stream === ' ' ? null : (
        // <>
        //   {stream}
        //   {/* {console.log(stream)} */}
        // </>
        <>
          {/*  問題按鈕 */}
          {type == 'question' ? (
            <button onClick={showQuestion}>
              <span className={classes.black}>{stream.replace(/^ +/g, '').replace(/ +$/g, '')}</span>
            </button>
          ) : (
            // 一般render
            <span className={classes.black}>
              {stream.replace(/^ +/g, '').replace(/ +$/g, '')}
              {/* {children} */}
            </span>
          )}
        </>
      )
    }
    if (Array.isArray(stream)) {
      const hasStr = stream.some(e => typeof e === 'string')
      const noReturn = stream.every(e => e !== '\n')
      // if (condition) console.log(stream)

      return (
        <>
          {hasStr && noReturn ? (
            //包含hover效果
            // <div className={classes.array} onClick={onFocusHandler} onBlur={onBlurHandler} tabIndex={0}>
            <div className={classes.array} onMouseEnter={onFocusHandler} onMouseLeave={onBlurHandler} tabIndex={0}>
              {/* {console.log(stream)} */}
              {stream.map((e, i) => {
                return <RenderTokenStream key={i} stream={e} showPanel={Panel} ref={ref} showQuestion={showQuestion} />
              })}
            </div>
          ) : (
            //一般render
            stream.map((e, i) => {
              return <RenderTokenStream key={i} stream={e} ref={ref} showQuestion={showQuestion} />
            })
          )}
        </>
      )
    }
    // const err = token.marker ? <span>({token.marker.error})</span> : null
    const content = streamToStr(stream.content)
    switch (stream.type) {
      // case 'sect-ticker':
      // case 'sect-topic': {
      //   console.log(`symbol: ${content}`)
      //   return (
      //     <span>
      //       <Link to={`/card?${toUrlParams({ s: content })}`}>{content}</Link>
      //     </span>
      //   )
      // }
      case 'sect-symbol': {
        // console.log(`symbol: ${content}`)
        return (
          <span
            id={content}
            className={classes.tickerTitle}
            ref={
              ref
              // console.log(el)
            }
          >
            <Link to={`/card?${toUrlParams({ s: content })}`}>{content.replace('[[', '').replace(']]', '')}</Link>
          </span>
        )
      }
      case 'multiline-marker':
        return (
          <ul>
            <RenderTokenStream stream={stream.content} ref={ref} showQuestion={showQuestion} />
          </ul>
        )
      case 'inline-marker':
        return <RenderTokenStream stream={stream.content} ref={ref} showQuestion={showQuestion} />
      case 'inline-value':
      case 'line-value': {
        if ((stream.markerline?.comment || stream.markerline?.poll) && stream.markerline.commentId) {
          return (
            // <QueryCommentModal commentId={stream.markerline.commentId.toString()}>
            <button onClick={showQuestion}>
              <RenderTokenStream stream={stream.content} ref={ref} showQuestion={showQuestion} type="question" />
            </button>
            // </QueryCommentModal>
          )
        }
        if (stream.markerline?.comment && stream.markerline.commentId) {
          return <PollChoices pollId={'10'} choices={['aaa', 'bbb']} />
          // return (
          //   <QueryCommentModal id={stream.markerline.commentId.toString()}>
          //     <RenderTokenStream stream={stream.content} />
          //   </QueryCommentModal>
          // )
        }
        if (stream.marker && (stream.marker.key.search('[key]') >= 0 || stream.marker.key.search('[~]') >= 0)) {
          return <RenderTokenStream stream={stream.content} ref={ref} showQuestion={showQuestion} />
        }
        return (
          <li className={classes.inlineValue}>
            {/* {console.log(commentTextArea)} */}
            <RenderTokenStream stream={stream.content} ref={ref} showQuestion={showQuestion} />
          </li>
        )
      }
      case 'line-mark':
      case 'inline-mark':
        return (
          <span className={classes.marker}>
            {content.replace('[+]', '優勢').replace('[-]', '劣勢').replace('[?]', '問題').replace('[key]', '關鍵字')}
          </span>
        )
      // return <span className={classes.marker}>{content}</span>
      case 'ticker':
      case 'topic': {
        // console.log(`symbol: ${content}`)
        return (
          <span className={classes.keyword}>
            <Link to={`/card?${toUrlParams({ s: content })}`}>
              {content.replace('[[', '').replace(']]', '')}
              {/* {console.log(stream)} */}
            </Link>
          </span>
        )
      }
      case 'stamp': {
        const panel =
          stream.markerline && stream.markerline.anchorId ? (
            <AnchorPanel
              anchorId={stream.markerline.anchorId.toString()}
              meAuthor={false}
              onClickHandler={commentClickHandler}
              // commentMouseUpHandler={commentMouseUpHandler}
            />
          ) : null
        const src =
          stream.markerline && stream.markerline.src ? (
            <Link to={`/card?${toUrlParams({ u: stream.markerline.src })}`}>src</Link>
          ) : null

        if (panel || src)
          return (
            <span className={`${showPanel ? classes.visible : classes.hidden}`}>
              {/* <span> */}
              {/* {console.log(showPanel)} */}
              {panel}
              {src}
            </span>
          )
        return null
      }
      default:
        // Recursive
        return <RenderTokenStream stream={stream.content} ref={ref} showQuestion={showQuestion} />
    }
  },
)
RenderTokenStream.displayName = 'RenderTokenStream'

const RenderSection = forwardRef(
  (
    { sect, titleRef, showQuestion }: { sect: Section; titleRef?: (arr: any[]) => void; showQuestion?: () => void },
    ref,
  ): JSX.Element | null => {
    const titleRefArr: any[] = []
    const pushTitle = (el: any) => {
      titleRefArr.push(el)
      // console.log(titleRefArr)
    }
    if (sect.stream) {
      return (
        <div>
          {/* {console.log(sect.stream)} */}
          <RenderTokenStream
            stream={sect.stream}
            ref={ref}
            showQuestion={showQuestion}
            // pushTitle={pushTitle}
            // titleRef={titleRef ? titleRef(titleRefArr) : null}
          />
          {/* {console.log(sect)} */}
        </div>
      )
    }
    return null
  },
)
RenderSection.displayName = 'RenderSection'

export const RenderCardBody = forwardRef(
  (
    { sects, titleRef, showQuestion }: { sects: Section[]; titleRef?: (arr: any[]) => void; showQuestion?: () => void },
    ref,
  ): JSX.Element => {
    const myRef = useRef<any[]>([])

    interface PanelArr {
      content: string
      panel: boolean
    }
    // const [showPanel,setShowPanel]=useState<PanelArr[]>()

    // const showPanelArr:PanelArr[]=[]
    // const showPanelHandler=(streamContent:string) => {

    //   showPanelArr.push({content:streamContent,panel:true})
    //   setShowPanel((prev)=>{
    //     const prevState=prev

    //     prevState?.forEach(el=>{

    //       if(el.content!==streamContent){
    //       el.panel=false
    //       }

    //     }

    //     )
    //     return
    //   })
    // }

    // console.log(myRef.current)
    return (
      <>
        {sects.map((e, i) => (
          <RenderSection key={i} sect={e} ref={el => (myRef.current[i] = el)} showQuestion={showQuestion} />
        ))}
        {titleRef && titleRef(myRef.current)}
      </>
    )
  },
)
RenderCardBody.displayName = 'RenderCardBody'

export function CardBody({
  card,
  bySrc,
  titleRefHandler,
  showQuestion,
}: {
  card: CocardFragment
  bySrc?: string
  titleRefHandler?: (arr: any[]) => void
  showQuestion?: () => void
}): JSX.Element {
  // console.log(card)
=======

function RenderTokenStream({ stream }: { stream: ExtTokenStream }): JSX.Element | null {
  if (typeof stream === 'string') {
    return <>{stream}</>
  }
  if (Array.isArray(stream)) {
    return (
      <>
        {stream.map((e, i) => (
          <RenderTokenStream key={i} stream={e} />
        ))}
      </>
    )
  }
  // const err = token.marker ? <span>({token.marker.error})</span> : null
  const content = streamToStr(stream.content)
  switch (stream.type) {
    // case 'sect-ticker':
    // case 'sect-topic': {
    //   console.log(`symbol: ${content}`)
    //   return (
    //     <span>
    //       <Link to={`/card?${toUrlParams({ s: content })}`}>{content}</Link>
    //     </span>
    //   )
    // }
    case 'sect-symbol': {
      // console.log(`symbol: ${content}`)
      return <Link to={`/card?${toUrlParams({ s: content })}`}>{content}</Link>
    }
    case 'multiline-marker':
    case 'inline-marker':
      return <RenderTokenStream stream={stream.content} />
    case 'inline-value':
    case 'line-value': {
      if ((stream.markerline?.comment || stream.markerline?.poll) && stream.markerline.commentId) {
        return (
          <QueryCommentModal commentId={stream.markerline.commentId.toString()}>
            <RenderTokenStream stream={stream.content} />
          </QueryCommentModal>
        )
      }
      if (stream.markerline?.comment && stream.markerline.commentId) {
        return <PollChoices pollId={'10'} choices={['aaa', 'bbb']} />
        // return (
        //   <QueryCommentModal id={stream.markerline.commentId.toString()}>
        //     <RenderTokenStream stream={stream.content} />
        //   </QueryCommentModal>
        // )
      }
      return (
        <span style={{ color: '#905' }}>
          <RenderTokenStream stream={stream.content} />
        </span>
      )
    }
    case 'line-mark':
    case 'inline-mark':
      return <span style={{ color: 'orange' }}>{content}</span>
    case 'ticker':
    case 'topic': {
      // console.log(`symbol: ${content}`)
      return <Link to={`/card?${toUrlParams({ s: content })}`}>{content}</Link>
    }
    case 'stamp': {
      console.log(stream.markerline)
      const panel =
        stream.markerline && stream.markerline.anchorId ? (
          <AnchorPanel anchorId={stream.markerline.anchorId.toString()} meAuthor={false} />
        ) : null
      const src =
        stream.markerline && stream.markerline.src ? (
          <Link to={`/card?${toUrlParams({ u: stream.markerline.src })}`}>src</Link>
        ) : null

      if (panel || src)
        return (
          <span style={{ color: 'orange' }}>
            {panel}
            {src}
          </span>
        )
      return null
    }
    default:
      // Recursive
      return <RenderTokenStream stream={stream.content} />
  }
}

function RenderSection({ sect }: { sect: Section }): JSX.Element | null {
  if (sect.stream) {
    return (
      <span style={{ color: 'grey' }}>
        <RenderTokenStream stream={sect.stream} />
      </span>
    )
  }
  return null
}

export function RenderCardBody({ sects }: { sects: Section[] }): JSX.Element {
  return (
    <pre>
      {sects.map((e, i) => (
        <RenderSection key={i} sect={e} />
      ))}
    </pre>
  )
}

export function CardBody({ card, bySrc }: { card: CocardFragment; bySrc?: string }): JSX.Element {
  console.log(card)
>>>>>>> backend-dev

  if (card.body === null) return <p>[Error]: null body</p>

  // const meta: CardMeta | undefined = card.meta ? (JSON.parse(card.meta) as CardMeta) : undefined
  const editor = new Editor(card.body?.text, card.body?.meta, card.link.url, card.link.oauthorName ?? undefined)
  editor.flush({ attachMarkerlinesToTokens: true })

  return (
<<<<<<< HEAD
    // <>
    //   <QueryCommentModal commentId={card.meta.commentId.toString()}>
    //     <div>discuss</div>
    // </QueryCommentModal>
    <RenderCardBody sects={editor.getSections()} titleRef={titleRefHandler} showQuestion={showQuestion} />
    // </>
=======
    <>
      <QueryCommentModal commentId={card.meta.commentId.toString()}>
        <div>discuss</div>
      </QueryCommentModal>
      <RenderCardBody sects={editor.getSections()} />
    </>
>>>>>>> backend-dev
  )
}

export function CardHead({ card }: { card: CocardFragment }): JSX.Element {
  // const title = findOneComment(MARKER_FORMAT.srcTitle.mark, card.comments)
  // const publishDate = findOneComment(MARKER_FORMAT.srcPublishDate.mark, card.comments);
  const _comment: CommentFragment = {
    __typename: 'Comment',
    id: 'string',
    userId: 'string',
    cocardId: 10,
    ocardId: null,
    selfcardId: null,
    isTop: false,
    text: 'Buy vs Sell',
    replies: [],
    topReplies: null,
    poll: null,
    count: {
      __typename: 'CommentCount',
      id: 'string;',
      nViews: 1,
      nUps: 2,
      nDowns: 3,
    },
    meta: null,
    createdAt: null,
  }
<<<<<<< HEAD
  let cardTitle = card.link.url
  // ticker的title
  const cardDomain = card.link.domain
  if (cardDomain === '_') {
    cardTitle = cardTitle.slice(2)
  }
  return (
    <div className={classes.header}>
      {cardDomain === '_' ? (
        <h1 className={classes.tickerTitle}>{cardTitle}</h1>
      ) : (
        <>
          <span className={classes.author}>author</span>
          <span className={classes.webName}>{' • ' + 'Youtube' + '\n'}</span>
          <span className={classes.title}>Title</span>
          <span className={classes.flexContainer}>
            <ClockIcon className={classes.clockIcon} />
            {/* <span className={classes.date}>{publishDate && stringToArr(publishDate.text ?? "", "T", 0)}</span> */}
            <a className={classes.link} href={cardTitle} target="_blank">
              <span className={classes.date}>2021-4-9</span>
              <LinkIcon className={classes.linkIcon} />
              連結{'\n'}
            </a>
          </span>
        </>
      )}

      {/* <div><Comment comment={comment} /></div> */}
      {/* {console.log(card)} */}
      {/* {cardTitle} */}
=======
  return (
    <h1>
      <div>{/* <Comment comment={comment} /> */}</div>
      {card.link.url}
>>>>>>> backend-dev
      {/* {title && title.text + '\n'} */}
      {/* {publishDate && publishDate.text + '\n'} */}
      {/* {card.link.oauthorName + '\n'} */}
      {/* {'(NEXT)Keywords\n'} */}
      {/* {card.comments.length === 0 ? "新建立" : undefined} */}
<<<<<<< HEAD
    </div>
=======
    </h1>
>>>>>>> backend-dev
  )
}

// --- Helpers ---

// export function findOneComment<T extends QT.comment | QT.CommentInput>(mark: string, comments: T[]): T | undefined {
//   return comments.find(e => {
//     if ('meta' in e)
//       return (e as QT.comment).meta?.mark === mark
//     if ('mark' in e)
//       return (e as QT.CommentInput).mark === mark
//     throw new Error()
//   })
// }

// export function findManyComments<T extends QT.comment | QT.CommentInput>(mark: string, comments: T[]): T[] {
//   return comments.filter(e => {
//     if ('meta' in e)
//       return (e as QT.comment).meta?.mark === mark
//     if ('mark' in e)
//       return (e as QT.CommentInput).mark === mark
//     throw new Error()
//   })
// }

// ------- Deprecated --------

// function makeCardId(comment: QT.commentFragment): string {
//   let id: string
//   if (comment.cocardId) id = 'Cocard:' + comment.ocardId
//   else if (comment.ocardId) id = 'Ocard:' + comment.ocardId
//   else if (comment.selfcardId) id = 'Ocard:' + comment.ocardId
//   else throw new Error()
//   return id
// }

// function getVoteIdx(str: string): number | undefined {
//   /** []buy [X]sell []watch  -> return 1 */
//   const re = /\[.?\]/gm
//   let m
//   const matches = []
//   while ((m = re.exec(str)) !== null) {
//     // This is necessary to avoid infinite loops with zero-width matches
//     if (m.index === re.lastIndex) re.lastIndex++
//     // 選擇的選項標為1，其餘為0
//     matches.push(m[0].length > 2 ? 1 : 0)
//   }
//   return matches.indexOf(1)
// }

// function mapVoters(voteComments: QT.commentFragment[], nChoices: number): string[][] {
//   const voters: string[][] = []
//   for (let i = 0; i < nChoices; i++) {
//     const _voteChoiceN: string[] = []
//     for (const e of voteComments) {
//       if (e.text && getVoteIdx(e.text) === i) {
//         _voteChoiceN.push(makeCardId(e))
//       }
//     }
//     voters.push(_voteChoiceN)
//   }
//   return voters
// }

// function filterCommentsByVote(
//   voteIdx: number,
//   voters: string[][],
//   comments: QT.commentFragment[],
// ): QT.commentFragment[] {
//   // const voters = ["Ocard:1", "Selfcard:1"]
//   const votersByVote = voters[voteIdx]
//   return comments.filter(e => votersByVote.indexOf(makeCardId(e)) >= 0)
// }

// function ShowCardClicker({
//   selfcardId,
//   ocardId,
//   children,
// }: {
//   selfcardId?: string
//   ocardId?: string
//   children: React.ReactNode
// }) {
//   if (!selfcardId && !ocardId) throw new Error('selfcardId及ocardId至少需要一個')
//   return <span>{children}</span>
// }

// function QueryCardModal({ card, mycard }: { card: QT.cocard_cocard; mycard?: QT.selfcard_selfcard }) {
//   const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
//   const [cardId, setCardId] = useState<[string, number] | null>(null)
//   function onClick(comment: QT.commentFragment): void {
//     // console.log('onClick')
//     if (comment.ocardId) setCardId(['Ocard', comment.ocardId])
//     else if (comment.selfcardId) setCardId(['Selfcard', comment.selfcardId])
//     else return
//     setIsModalVisible(true)
//   }
//   /** (NEXT)將mycard的comments放入裡面，便利push到cocard */
//   // const battles = oneCommentByKey({ comments: card.comments, key: "battles" })
//   return (
//     <>
//       <Modal
//         visible={isModalVisible}
//         onCancel={function () {
//           setIsModalVisible(false)
//         }}
//       >
//         {/* {cardId && cardId[0] === 'Ocard' && <QueryOcard id={cardId[1].toString()} />} */}
//         {/* {cardId && cardId[0] === 'Selfcard' && <QuerySelfcard id={cardId[1].toString()} />} */}
//       </Modal>
//     </>
//   )
// }

// function QueryOcard({
//   oauthorName,
//   symbolName,
//   updateNestedOcards,
// }: {
//   oauthorName: string
//   symbolName?: string
//   updateNestedOcards(symbol: string, card?: QT.ocard_ocard, error?: string): void
// }) {
//   /** 僅用於call api，不render（需要這樣寫是因為目前apollo似乎沒有提供直接query data的方法，都得搭配hook） */
//   console.log('called QueryOcard()', symbolName)
//   const { error, data } = useQuery<QT.ocard, QT.ocardVariables>(queries.OCARD, {
//     variables: { oauthorName, symbolName },
//   })
//   if (symbolName === undefined) return null
//   if (error) updateNestedOcards(symbolName, undefined, error.toString())
//   else if (data?.ocard) updateNestedOcards(symbolName, data?.ocard)
//   return null
// }

// // function NestedTickerOcard({ symbolName, oauthorName, src }: { symbolName: string; oauthorName: string; src: string }) {
// //   const { data, error, loading } = useQuery<QT.ocard, QT.ocardVariables>(queries.OCARD, {
// //     variables: { symbolName, oauthorName },
// //   })
// //   if (loading) return <span>~ Loading... ~</span>
// //   if (data?.ocard) return <CardBody card={data.ocard} rootFormat={MK.TICKER_FORMATTER} bySrc={src} />
// //   return <span>Error!</span>
// // }
