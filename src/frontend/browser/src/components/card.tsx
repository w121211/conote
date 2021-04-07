<<<<<<< HEAD
import React, { ReactElement, useState, useEffect } from 'react'
import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client'
// import { Link, navigate, redirectTo } from '@reach/router'
import { AutoComplete, Button, Modal, Popover, Tag, Tooltip, Radio, Form, Input } from 'antd'
import { hello } from '../../../../lib/editor/src/index'
import { Editor, Section, ExtTokenStream, streamToStr } from '../../../../lib/editor/src/index'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { AnchorPanel } from './tile-panel'
import { QueryCommentModal } from './tile'
import { toUrlParams } from '../helper'
import { PollChoices } from './poll-form'
import { Link } from './link'

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

export function CardBody({ card, bySrc }: { card: QT.cocardFragment; bySrc?: string }): JSX.Element {
  if (card.body === null) return <p>[Error]: null body</p>

  // const meta: CardMeta | undefined = card.meta ? (JSON.parse(card.meta) as CardMeta) : undefined
  const editor = new Editor(card.body.text, [], card.link.url, card.link.oauthorName ?? undefined)
  editor.flush({ attachMarkerlinesToTokens: true })

  return (
    <>
      <QueryCommentModal commentId={card.meta.commentId.toString()}>
        <div>discuss</div>
      </QueryCommentModal>
      <RenderCardBody sects={editor.getSections()} />
    </>
  )
}

export function CardHead({ card }: { card: QT.cocardFragment }): JSX.Element {
  // const title = findOneComment(MARKER_FORMAT.srcTitle.mark, card.comments)
  // const publishDate = findOneComment(MARKER_FORMAT.srcPublishDate.mark, card.comments);
  const comment: QT.commentFragment = {
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
  return (
    <h1>
      <div>{/* <Comment comment={comment} /> */}</div>
      {card.link.url}
      {/* {title && title.text + '\n'} */}
      {/* {publishDate && publishDate.text + '\n'} */}
      {/* {card.link.oauthorName + '\n'} */}
      {/* {'(NEXT)Keywords\n'} */}
      {/* {card.comments.length === 0 ? "新建立" : undefined} */}
    </h1>
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
=======
import React, { useState } from 'react'
// import { RouteComponentProps, Redirect, Link, navigate, useLocation } from '@reach/router'
import { useQuery } from '@apollo/client'
// import { Layout, Button } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
// import { CardHead, CardBody } from '../components/card'
import { symbolToUrl, getCardUrlParam } from '../helper'

// interface RouteProps extends RouteComponentProps {
//   me?: QT.me_me
// }

export function ResolvedCardPage({ card }: { card: QT.cocardFragment }): JSX.Element {
  console.log(card)
  return <h1>Card</h1>
  // return (
  //   <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
  //     <CardHead card={card} />
  //     <CardBody card={card} />
  //     <Button
  //       onClick={() => {
  //         navigate(`/form?${getCardUrlParam(card)}`)
  //       }}
  //     >
  //       編輯
  //     </Button>
  //   </Layout.Content>
  // )
}

function FetchCard({ url }: { url: string }) {
  const { loading, data, error } = useQuery<QT.cocard, QT.cocardVariables>(queries.COCARD, {
    variables: { url },
    // fetchPolicy: 'no-cache',
  })
  if (loading) return <h1>loading</h1>
  if (error || !data) return <h1>{error?.message}</h1>
  if (data.cocard === null) {
    // 目前query cocard若沒找到會直接建立新的，所以這個原則上不會發生
    // navigate(`/webpage/form?${_toUrlParams('url', url)}`)
    console.error('something wrong')
    return <h1>Unpected error</h1>
  }
  return <ResolvedCardPage card={data.cocard} />
}

// export function CardPage({ path }: RouteProps): JSX.Element {
//   /** 入口，檢查有沒有url，有的話query cocard，然後轉至render-page */
//   const location = useLocation()
//   const params = new URLSearchParams(location?.search)
//   const url = params.get('u')
//   const symbol = params.get('s')

//   if (url) {
//     return <FetchCard url={url} />
//   } else if (symbol) {
//     try {
//       return <FetchCard url={symbolToUrl(symbol)} />
//     } catch {
//       return <h1>Symbol format error</h1>
//     }
//   } else {
//     return <h1>Require URL or Symbol</h1>
//   }
// }

export function CardPage(): JSX.Element {
  /** 入口，檢查有沒有url，有的話query cocard，然後轉至render-page */
  // const location = useLocation()
  // const params = new URLSearchParams(location?.search)
  // const url = params.get('u')
  // const symbol = params.get('s')
  const url = null
  const symbol = '$BA'

  if (url) {
    return <FetchCard url={url} />
  }
  if (symbol) {
    try {
      return <FetchCard url={symbolToUrl(symbol)} />
    } catch {
      return <h1>Symbol format error</h1>
    }
  }
  return <h1>Require URL or Symbol</h1>
}
>>>>>>> 514adbb... .
