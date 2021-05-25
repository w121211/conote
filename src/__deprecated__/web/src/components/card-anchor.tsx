import React, { ReactElement, useState, useEffect } from 'react'
// import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client'
// import { Link, navigate, redirectTo } from '@reach/router'
// import { AutoComplete, Button, Modal, Popover, Tag, Tooltip, Radio, Form, Input } from 'antd'
// import { TextEditor, Section, ExtTokenStream, streamToStr } from '@conote/editor'
// import * as queries from '../graphql/queries'
// import * as QT from '../graphql/query-types'
// import { AnchorPanel } from './tile-panel'
// import { QueryCommentModal } from './tile'
// import { toUrlParams } from '../helper'
// import { PollChoices } from './poll-form'
// import classes from './card.module.scss'
// import { argumentsObjectFromField } from '@apollo/client/utilities'
// import { SpaceContext } from 'antd/lib/space'

// function RenderSection({ sect }: { sect: Section }): JSX.Element | null {
//   if (sect.stream) {
//     return (
//       <div>
//         {console.log(sect.stream)}
//         <RenderTokenStream stream={sect.stream} />
//       </div>
//     )
//   }
//   return null
// }

// export function RenderCardBody({ sects }: { sects: Section[] }): JSX.Element {
//   return (
//     <pre>
//       {sects.map((e, i) => (
//         <RenderSection key={i} sect={e} />
//       ))}
//     </pre>
//   )
// }

// export function CardBody({
//   card,
//   bySrc,
//   className,
// }: {
//   card: QT.cocardFragment
//   bySrc?: string
//   className?: string
// }): JSX.Element {
//   if (card.body === null) return <p>[Error]: null body</p>

//   // const meta: CardMeta | undefined = card.meta ? (JSON.parse(card.meta) as CardMeta) : undefined
//   const editor = new TextEditor(card.body.text, card.link.url, card.link.oauthorName ?? undefined)
//   editor.flush({ attachMarkerlinesToTokens: true })

//   return (
//     <>
//       <QueryCommentModal commentId={card.meta.commentId.toString()}>
//         <div>discuss</div>
//       </QueryCommentModal>
//       <RenderCardBody sects={editor.getSections()} />
//     </>
//   )
// }

// function RenderTokenStream({
//   stream,
//   className,
//   showPanel,
// }: {
//   stream: ExtTokenStream
//   className?: string
//   showPanel?: boolean
// }): JSX.Element | null {
//   const [Panel, setPanel] = useState(false)
//   const onFocusHandler = (e: any) => {
//     e.stopPropagation()
//     // e.preventDefault()
//     setPanel(true)
//   }
//   const onBlurHandler = (e: any) => {
//     e.stopPropagation()
//     // e.preventDefault()
//     setPanel(false)
//   }
//   // console.log(opacity)
//   if (typeof stream === 'string') {
//     // return stream.search(/\n+/g) >= 0 || stream.search(/ {2,}/g) >= 0 || stream === ' ' ? (
//     return stream.search(/\n+/g) >= 0 || stream.search(/ {2,}/g) >= 0 || stream === ' ' ? null : (
//       // <>
//       //   {stream}
//       //   {/* {console.log(stream)} */}
//       // </>
//       <span className={classes.black}>
//         {stream.replace(/^ +/g, '').replace(/ +$/g, '')}
//         {/* {children} */}
//       </span>
//     )
//   }
//   if (Array.isArray(stream)) {
//     // console.log(stream)

//     const hasStr = stream.some(e => typeof e === 'string')
//     const noReturn = stream.every(e => e !== '\n')
//     // if (condition) console.log(stream)

//     return (
//       <>
//         {hasStr && noReturn ? (
//           //包含hover效果
//           <div className={classes.array} onFocus={onFocusHandler} onBlur={onBlurHandler} tabIndex={0}>
//             {stream.map((e, i) => {
//               return <RenderTokenStream key={i} stream={e} showPanel={Panel} />
//             })}
//           </div>
//         ) : (
//           //一般render
//           stream.map((e, i) => {
//             return <RenderTokenStream key={i} stream={e} />
//           })
//         )}
//       </>
//     )
//   }
//   // const err = token.marker ? <span>({token.marker.error})</span> : null
//   const content = streamToStr(stream.content)
//   switch (stream.type) {
//     // case 'sect-ticker':
//     // case 'sect-topic': {
//     //   console.log(`symbol: ${content}`)
//     //   return (
//     //     <span>
//     //       <Link to={`/card?${toUrlParams({ s: content })}`}>{content}</Link>
//     //     </span>
//     //   )
//     // }
//     case 'sect-symbol': {
//       // console.log(`symbol: ${content}`)
//       return (
//         <span className={classes.tickerTitle}>
//           <Link to={`/card?${toUrlParams({ s: content })}`}>
//             {content}
//             {/* {console.log()} */}
//           </Link>
//         </span>
//       )
//     }
//     case 'multiline-marker':
//       return (
//         <ul>
//           <RenderTokenStream stream={stream.content} />
//         </ul>
//       )
//     case 'inline-marker':
//       return <RenderTokenStream stream={stream.content} />
//     case 'inline-value':
//     case 'line-value': {
//       if ((stream.markerline?.comment || stream.markerline?.poll) && stream.markerline.commentId) {
//         return (
//           <QueryCommentModal commentId={stream.markerline.commentId.toString()}>
//             <RenderTokenStream stream={stream.content} />
//           </QueryCommentModal>
//         )
//       }
//       if (stream.markerline?.comment && stream.markerline.commentId) {
//         return <PollChoices pollId={'10'} choices={['aaa', 'bbb']} />
//         // return (
//         //   <QueryCommentModal id={stream.markerline.commentId.toString()}>
//         //     <RenderTokenStream stream={stream.content} />
//         //   </QueryCommentModal>
//         // )
//       }
//       return (
//         <li className={classes.inlineValue}>
//           <RenderTokenStream stream={stream.content} />
//         </li>
//       )
//     }
//     case 'line-mark':
//     case 'inline-mark':
//       return (
//         <span className={classes.marker}>
//           {content.replace('[+]', '優勢').replace('[-]', '劣勢').replace('[?:poll]', '投票')}
//         </span>
//       )
//     // return <span className={classes.marker}>{content}</span>
//     case 'ticker':
//     case 'topic': {
//       // console.log(`symbol: ${content}`)
//       return (
//         <Link to={`/card?${toUrlParams({ s: content })}`}>
//           {content}
//           {/* {console.log(stream)} */}
//         </Link>
//       )
//     }
//     case 'stamp': {
//       const panel =
//         stream.markerline && stream.markerline.anchorId ? (
//           <AnchorPanel anchorId={stream.markerline.anchorId.toString()} meAuthor={false} />
//         ) : null
//       const src =
//         stream.markerline && stream.markerline.src ? (
//           <Link to={`/card?${toUrlParams({ u: stream.markerline.src })}`}>src</Link>
//         ) : null

//       if (panel || src)
//         return (
//           <span className={`${showPanel ? classes.visible : classes.hidden}`}>
//             {/* {console.log(showPanel)} */}
//             {panel}
//             {src}
//           </span>
//         )
//       return null
//     }
//     default:
//       // Recursive
//       return <RenderTokenStream stream={stream.content} />
//   }
// }

// function RenderSection({ sect }: { sect: Section }): JSX.Element | null {
//   if (sect.stream) {
//     return (
//       <div>
//         {console.log(sect.stream)}
//         <RenderTokenStream stream={sect.stream} />
//       </div>
//     )
//   }
//   return null
// }

// export function RenderCardBody({ sects }: { sects: Section[] }): JSX.Element {
//   return (
//     <pre>
//       {sects.map((e, i) => (
//         <RenderSection key={i} sect={e} />
//       ))}
//     </pre>
//   )
// }

// export function CardBody({
//   card,
//   bySrc,
//   className,
// }: {
//   card: QT.cocardFragment
//   bySrc?: string
//   className?: string
// }): JSX.Element {
//   if (card.body === null) return <p>[Error]: null body</p>

//   // const meta: CardMeta | undefined = card.meta ? (JSON.parse(card.meta) as CardMeta) : undefined
//   const editor = new TextEditor(card.body.text, card.link.url, card.link.oauthorName ?? undefined)
//   editor.flush({ attachMarkerlinesToTokens: true })

//   return (
//     <>
//       <QueryCommentModal commentId={card.meta.commentId.toString()}>
//         <div>discuss</div>
//       </QueryCommentModal>
//       <RenderCardBody sects={editor.getSections()} />
//     </>
//   )
// }
