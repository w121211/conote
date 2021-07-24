// import { ReactElement, useState, useEffect } from 'react'
// import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client'
// import { Link, navigate, redirectTo } from '@reach/router'
// import { AutoComplete, Button, Modal, Popover, Tag, Tooltip, Radio, Form, Input } from 'antd'
import React, { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react'
import { Editor, Section, ExtTokenStream, streamToStr, ExtToken } from '../../packages/editor/src/index'
// import { CocardFragment, CommentFragment } from '../apollo/query.graphql'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AnchorPanel } from './tile-panel'
import { QueryCommentModal } from './tile'
import { toUrlParams } from '../lib/helper'
import { PollChoices } from '../__deprecated__/poll-form'
// import { Link } from './link'
import { MyTooltip } from '../components/my-tooltip/my-tooltip'
import BulletEditor from '../__deprecated__/slate-editor/bullet'
import Question from './question/question'
import classes from './card.module.scss'
import ClockIcon from '../assets/svg/clock.svg'
import LinkIcon from '../assets/svg/link.svg'
// import { CardMeta } from '../lib/models/card'
import Linechart from './bar/lineChart'
import HeaderForm from './header-form/header-form'
import MyEditBtnPopover from '../__deprecated__/my-editBtn-popover/my-editBtn-popover'
// import moduleName from 'react-router';

type myRef = {
  spanScrollIntoview: () => void
  anchorScrollIntoView: () => void
  anchor: () => HTMLSpanElement

  hlSpan: () => HTMLSpanElement
}
const RenderTokenStream = forwardRef(
  (
    {
      stream,

      showQuestion,

      commentIdHandler,
      anchorIdHandler,
      cardCommentId,

      clickPoll,
      showDiscuss,
      anchorIdHL,
      hlElementHandler,
      meAnchor,
      showHeaderForm,
      pathPush,
      symbolHandler,
    }: {
      stream: ExtTokenStream
      className?: string

      titleRef?: (arr: any[]) => void
      showQuestion?: () => void
      type?: string
      cardCommentId: number
      commentIdHandler?: (commentId: string) => void
      anchorIdHandler?: (anchorId: string) => void
      commentId?: string
      clickPoll?: (commentId: string) => void
      showDiscuss?: () => void
      highLightClassName?: boolean
      anchorIdHL?: string
      hlElementHandler?: (el: HTMLSpanElement) => void
      meAnchor?: string
      showHeaderForm: boolean
      pathPush: (symbol: string) => void
      symbolHandler: (symbol: string) => void
    },
    ref: any,
  ): JSX.Element | null => {
    // const inlineValueArr: string[] = [classes.inlineValue]
    // const [Panel, setPanel] = useState(false)
    const highLightRef = useRef<HTMLSpanElement>(null)
    // const [commentTextArea, setCommentTextArea] = useState(inlineValueArr)

    const onFocusHandler = (e: any) => {
      e.stopPropagation()
      // e.preventDefault()
      // setPanel(true)
    }
    const onBlurHandler = (e: any) => {
      e.stopPropagation()
      // e.preventDefault()
      // if (!commentTextArea) {
      // setPanel(false)
      // }
    }
    const router = useRouter()
    // console.log(commentTextArea)

    if (typeof stream === 'string') {
      // return stream.search(/\n+/g) >= 0 || stream.search(/ {2,}/g) >= 0 || stream === ' ' ? (
      return stream.search(/\n+/g) >= 0 || stream.search(/ {2,}/g) >= 0 || stream === ' ' ? null : (
        // <>
        //   {stream}
        //   {/* {console.log(stream)} */}
        // </>
        // 一般render
        <span
          // id={`${meAnchor}`}
          className={`${classes.text} }`}
          // ref={el => {
          //   if (meAnchor === anchorIdHL && hlElementHandler && el) {
          //     hlElementHandler(el)
          //     el.scrollIntoView({ behavior: 'smooth' })
          //   }
          // }}
        >
          {stream.replace(/^ +/g, '').replace(/ +$/g, '')}
          {/* {console.log(meAnchor)} */}
          {/* {console.log(hlRef)} */}
          {/* {highLightClassName && highLightRef.current && hlElementHandler
              ? hlElementHandler(highLightRef?.current)
              : null} */}
          {/* {children} */}
        </span>
      )
    }
    if (Array.isArray(stream)) {
      const hasStr = stream.some(e => typeof e === 'string')
      const noReturn = stream.every(e => e !== '\n')
      // if (condition) console.log(stream)

      return (
        <>
          {/* {console.log(stream)} */}
          {hasStr && noReturn ? (
            //包含hover效果
            // <div className={classes.array} onClick={onFocusHandler} onBlur={onBlurHandler} tabIndex={0}>
            <span
              id={`${meAnchor}`}
              className={`${classes.array} ${meAnchor === anchorIdHL && meAnchor !== undefined ? 'highLight' : ''}`}
              // className={`${classes.array} `}
              ref={el => {
                if (meAnchor === anchorIdHL && hlElementHandler && el) {
                  hlElementHandler(el)
                  el.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              {stream.map((e, i) => {
                return (
                  <RenderTokenStream
                    key={i}
                    stream={e}
                    // showPanel={Panel}
                    ref={ref}
                    showQuestion={showQuestion}
                    commentIdHandler={commentIdHandler}
                    anchorIdHandler={anchorIdHandler}
                    clickPoll={clickPoll}
                    showDiscuss={showDiscuss}
                    anchorIdHL={anchorIdHL}
                    hlElementHandler={hlElementHandler}
                    meAnchor={meAnchor}
                    cardCommentId={cardCommentId}
                    showHeaderForm={showHeaderForm}
                    pathPush={pathPush}
                    symbolHandler={symbolHandler}
                  />
                )
              })}
            </span>
          ) : (
            //一般render
            stream.map((e, i) => {
              // console.log(e)
              return (
                <RenderTokenStream
                  key={i}
                  stream={e}
                  ref={ref}
                  showQuestion={showQuestion}
                  commentIdHandler={commentIdHandler}
                  anchorIdHandler={anchorIdHandler}
                  // pollCommentIdHandler={pollCommentIdHandler}
                  clickPoll={clickPoll}
                  showDiscuss={showDiscuss}
                  anchorIdHL={anchorIdHL}
                  // highLightClassName={highLightClassName}
                  hlElementHandler={hlElementHandler}
                  meAnchor={meAnchor}
                  cardCommentId={cardCommentId}
                  showHeaderForm={showHeaderForm}
                  pathPush={pathPush}
                  symbolHandler={symbolHandler}
                />
              )
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
      case 'vote-chocie':
        return (
          // <button>
          <>
            {/* {console.log(stream)} */}
            {/* {stream.content} */}
            {/* <RenderTokenStream
              stream={stream.content}
              ref={ref}
              showQuestion={showQuestion}
              commentIdHandler={commentIdHandler}
            /> */}
          </>
          // </button>
        )

      case 'sect-symbol':
        // console.log(`symbol: ${content}`)
        return (
          <>
            {showHeaderForm ? (
              <HeaderForm
                initialValue={{
                  title: content,
                  authorChoice: 'buy',
                  authorLines: '兩種觀點皆合理 短期注意系統化風險 看好美股的長期走勢，版塊輪動不會有大規模回調',
                }}
              />
            ) : (
              <span
                id={content}
                className={classes.tickerTitle}
                onClick={() => {
                  pathPush(content)
                  symbolHandler(content)
                }}
                ref={
                  ref
                  // console.log(el)
                }
              >
                {/* <Link href={`/card?${toUrlParams({ s: content })}`}>{content.replace('[[', '').replace(']]', '')}</Link> */}
                <span>{content.replace('[[', '').replace(']]', '')}</span>

                {content.search(/^\$[A-Z]+$/gm) !== -1 && (
                  <>
                    <span className={classes.symbolFullName}>Unity Software Inc.</span>
                    <span className={classes.symbolPrice}>
                      <span className={classes.price}>249.29</span>
                      <span className={`${classes.priceChange} ${classes.green}`}>+1.00(+0.40%)</span>
                      {/* <span className={`${classes.pricePercent} ${classes.green}`}>+0.40%</span> */}
                    </span>
                    {/* <span className={classes.headerChartArea}>
                      <div className={classes.headerVote}>
                        <div className={classes.voteHeader}>你的預測是？</div>
                        <div className={classes.voteChoices}>
                          <span>買</span>
                          <span>賣</span>
                          <span>觀望</span>
                        </div>
                      </div>
                      <span className={classes.headerAuthorLines}>
                        <Linechart />
                        <div className={classes.authorLineWrapper}>
                          <span className={classes.authorTagWrapper}>
                            <span className={classes.authorTag}>@娜娜</span>
                            <span className={classes.choiceTag}>買</span>
                          </span>
                          <span>兩種觀點皆合理 短期注意系統化風險 看好美股的長期走勢，版塊輪動不會有大規模回調</span>
                        </div>
                      </span>
                    </span> */}
                  </>
                )}
              </span>
            )}
          </>
        )

      case 'multiline-marker':
        if (Array.isArray(stream.content)) {
          if (stream.content.find(e => typeof e !== 'string' && e.content === '[?]')) {
            return (
              <ul>
                <Question stream={stream.content} cardCommentId={cardCommentId} />
                {/* <RenderTokenStream
                  stream={stream.content}
                  showQuestion={showQuestion}
                  commentIdHandler={commentIdHandler}
                  anchorIdHandler={anchorIdHandler}
                  clickPoll={clickPoll}
                  showDiscuss={showDiscuss}
                  anchorIdHL={anchorIdHL}
                  hlElementHandler={hlElementHandler}
                /> */}
                {/* {console.log(stream)} */}
              </ul>
            )
          }
          // const contentArr=stream.content as any[]
        }
        return (
          <ul>
            <RenderTokenStream
              stream={stream.content}
              ref={ref}
              showQuestion={showQuestion}
              commentIdHandler={commentIdHandler}
              anchorIdHandler={anchorIdHandler}
              // pollCommentIdHandler={pollCommentIdHandler}
              clickPoll={clickPoll}
              showDiscuss={showDiscuss}
              anchorIdHL={anchorIdHL}
              // highLightClassName={highLightClassName}
              hlElementHandler={hlElementHandler}
              cardCommentId={cardCommentId}
              showHeaderForm={showHeaderForm}
              pathPush={pathPush}
              symbolHandler={symbolHandler}
            />
            {/* {console.log(stream)} */}
          </ul>
        )
      case 'inline-marker':
        if (Array.isArray(stream.content)) {
          if (stream.content.find(e => typeof e !== 'string' && e.content === '[?]')) {
            return <Question stream={stream.content} cardCommentId={cardCommentId} />
          }
        }
        return (
          <RenderTokenStream
            stream={stream.content}
            ref={ref}
            showQuestion={showQuestion}
            commentIdHandler={commentIdHandler}
            anchorIdHandler={anchorIdHandler}
            // pollCommentIdHandler={pollCommentIdHandler}
            clickPoll={clickPoll}
            showDiscuss={showDiscuss}
            anchorIdHL={anchorIdHL}
            // highLightClassName={highLightClassName}
            hlElementHandler={hlElementHandler}
            cardCommentId={cardCommentId}
            showHeaderForm={showHeaderForm}
            pathPush={pathPush}
            symbolHandler={symbolHandler}
          />
        )
      case 'inline-value':
      case 'line-value': {
        if (stream.markerline?.poll && stream.markerline.commentId) {
          return (
            // <QueryCommentModal commentId={stream.markerline.commentId.toString()}>
            // <button onClick={showQuestion}>
            <>
              <RenderTokenStream
                stream={stream.content}
                ref={ref}
                showQuestion={showQuestion}
                // commentOnClickHandler={commentOnClickHandler}
                // pollCommentIdHandler={pollCommentIdHandler}
                // commentIdHandler={commentIdHandler}
                anchorIdHandler={anchorIdHandler}
                clickPoll={clickPoll}
                showDiscuss={showDiscuss}
                anchorIdHL={anchorIdHL}
                // highLightClassName={highLightClassName}
                hlElementHandler={hlElementHandler}
                cardCommentId={cardCommentId}
                showHeaderForm={showHeaderForm}
                pathPush={pathPush}
                symbolHandler={symbolHandler}
              />
              {/* {console.log(stream)} */}
              <button
                onClick={() => {
                  stream.markerline?.commentId && clickPoll && clickPoll(stream.markerline.commentId.toString())
                  stream.markerline?.anchorId &&
                    anchorIdHandler &&
                    anchorIdHandler(stream.markerline.anchorId.toString())
                  showQuestion && showQuestion()
                }}
              >
                參與投票
              </button>
            </>
            // </button>
            // </QueryCommentModal>
          )
        }
        if (!stream.markerline?.commentId && stream.markerline?.anchorId) {
          // return <PollChoices pollId={'10'} choices={['aaa', 'bbb']} />
          return (
            // <QueryCommentModal id={stream.markerline.commentId.toString()}>
            <li className={classes.inlineValue}>
              <span className={classes.bulletWrapper}>
                <span className={classes.bullet}>•</span>
              </span>
              {/* <svg viewBox="0 0 18 18" className={classes.bullet}>
                <circle cx="9" cy="9" r="3.5"></circle>
              </svg> */}
              <RenderTokenStream
                stream={stream.content}
                ref={ref}
                showQuestion={showQuestion}
                commentIdHandler={commentIdHandler}
                anchorIdHandler={anchorIdHandler}
                // pollCommentIdHandler={pollCommentIdHandler}
                clickPoll={clickPoll}
                showDiscuss={showDiscuss}
                anchorIdHL={anchorIdHL}
                meAnchor={stream.markerline.anchorId.toString()}
                // highLightClassName={anchorIdHL === stream.markerline.anchorId.toString()}
                hlElementHandler={hlElementHandler}
                cardCommentId={cardCommentId}
                showHeaderForm={showHeaderForm}
                pathPush={pathPush}
                symbolHandler={symbolHandler}
              />
              {/* {stream.markerline && commentIdHandler(stream.markerline.commentId.toString())} */}
              {/* {stream.markerline && anchorIdHandler(stream.markerline.anchorId.toString())} */}
            </li>
            // {/* </QueryCommentModal> */}
          )
        }
        if (stream.marker && (stream.marker.key.search('[key]') >= 0 || stream.marker.key.search('[~]') >= 0)) {
          return (
            <RenderTokenStream
              stream={stream.content}
              ref={ref}
              showQuestion={showQuestion}
              commentIdHandler={commentIdHandler}
              anchorIdHandler={anchorIdHandler}
              // pollCommentIdHandler={pollCommentIdHandler}
              clickPoll={clickPoll}
              showDiscuss={showDiscuss}
              anchorIdHL={anchorIdHL}
              // highLightClassName={highLightClassName}
              hlElementHandler={hlElementHandler}
              cardCommentId={cardCommentId}
              showHeaderForm={showHeaderForm}
              pathPush={pathPush}
              symbolHandler={symbolHandler}
            />
          )
        }
        return (
          // {/* {console.log(stream.content)} */}
          <RenderTokenStream
            stream={stream.content}
            ref={ref}
            showQuestion={showQuestion}
            commentIdHandler={commentIdHandler}
            anchorIdHandler={anchorIdHandler}
            // pollCommentIdHandler={pollCommentIdHandler}
            clickPoll={clickPoll}
            showDiscuss={showDiscuss}
            anchorIdHL={anchorIdHL}
            // highLightClassName={highLightClassName}
            hlElementHandler={hlElementHandler}
            cardCommentId={cardCommentId}
            showHeaderForm={showHeaderForm}
            pathPush={pathPush}
            symbolHandler={symbolHandler}
          />
        )
      }

      case 'line-mark':
      case 'inline-mark':
        return (
          <>
            {content === '[vs]' && (
              <span className={classes.marker}>
                比較<span className={classes.markerSyntax}>{content}</span>
              </span>
            )}
            {content === '[*]' && (
              <span className={classes.marker}>
                介紹<span className={classes.markerSyntax}>{content}</span>
              </span>
            )}
            {content === '[+]' && (
              <span className={classes.marker}>
                優勢/機會<span className={classes.markerSyntax}>{content}</span>
              </span>
            )}
            {content === '[-]' && (
              <span className={classes.marker}>
                劣勢/危機<span className={classes.markerSyntax}>{content}</span>
                {/* {console.log()} */}
              </span>
            )}
            {content === '[?]' && (
              <span className={classes.marker}>
                提問<span className={classes.markerSyntax}>{content}</span>
              </span>
            )}
            {content === '[key]' && (
              <span className={classes.marker}>
                關鍵字<span className={classes.markerSyntax}>{content}</span>
              </span>
            )}
            {['[+]', '[-]', '[?]', '[key]', '[*]', '[vs]'].includes(content) || (
              <span className={classes.marker}>
                {/* {console.log(content)} */}
                {content.replace('[', '').replace(']', '')}
              </span>
            )}
          </>
        )
      // return <span className={classes.marker}>{content}</span>
      case 'ticker':
      case 'topic': {
        // console.log(`symbol: ${content}`)
        return (
          <span
            className={classes.keyword}
            onClick={() => {
              pathPush(content)
              symbolHandler(content)
            }}
          >
            {/* {console.log(content)} */}
            {/* <Link href={`/card?${toUrlParams({ s: content })}`}>{content.replace('[[', '').replace(']]', '')}</Link> */}
            <span>{content.replace('[[', '').replace(']]', '')}</span>
          </span>
        )
      }
      case 'stamp': {
        const panel =
          stream.markerline && stream.markerline.anchorId ? (
            <AnchorPanel
              anchorId={stream.markerline.anchorId.toString()}
              anchorIdHandler={anchorIdHandler}
              meAuthor={false}
              showDiscuss={showDiscuss}
              // commentMouseUpHandler={commentMouseUpHandler}
            />
          ) : null
        const src =
          stream.markerline && stream.markerline.src ? (
            <Link href={`/card?${toUrlParams({ u: stream.markerline.src })}`}>src</Link>
          ) : null

        if (panel || src)
          return (
            <span className={classes.panel}>
              {/* <span> */}
              {/* {console.log(stream.markerline)} */}
              {panel}
              {src}
            </span>
          )
        return null
      }
      default:
        // Recursive
        return (
          <RenderTokenStream
            stream={stream.content}
            ref={ref}
            showQuestion={showQuestion}
            commentIdHandler={commentIdHandler}
            anchorIdHandler={anchorIdHandler}
            // pollCommentIdHandler={pollCommentIdHandler}
            clickPoll={clickPoll}
            showDiscuss={showDiscuss}
            anchorIdHL={anchorIdHL}
            // highLightClassName={highLightClassName}
            hlElementHandler={hlElementHandler}
            cardCommentId={cardCommentId}
            showHeaderForm={showHeaderForm}
            pathPush={pathPush}
            symbolHandler={symbolHandler}
          />
        )
    }
  },
)
RenderTokenStream.displayName = 'RenderTokenStream'

const RenderSection = forwardRef(
  (
    {
      sect,
      text,
      showQuestion,
      cardCommentId,
      // pollCommentIdHandler,
      anchorIdHandler,
      clickPoll,
      showDiscuss,
      anchorIdHL,
      hlElementHandler,
      pathPush,
      symbolHandler,
    }: // commentId
    {
      sect: Section
      text: string
      showQuestion?: () => void
      cardCommentId: number
      // pollCommentIdHandler?: (commentId: string) => void
      clickPoll?: (commentId: string) => void
      anchorIdHandler?: (anchorId: string) => void
      showDiscuss?: () => void
      anchorIdHL?: string
      hlElementHandler?: (el: HTMLSpanElement) => void
      // commentId:string
      pathPush: (symbol: string) => void
      symbolHandler: (symbol: string) => void
    },
    ref,
  ): JSX.Element | null => {
    const [showEditor, setShowEditor] = useState(false)
    const [showHeaderForm, setShowHeaderForm] = useState(false)
    const [showPopover, setShowPopover] = useState(false)

    const showHeaderFormHandler = () => {
      setShowHeaderForm(true)
    }

    if (sect.stream && sect.stream.length !== 0) {
      return (
        <div className={classes.cardSection}>
          {/* {console.log(sect.stream)} */}
          <div className={classes.cardSectionInner}>
            {showEditor ? (
              <>
                <RenderTokenStream
                  stream={sect.stream}
                  ref={ref}
                  showQuestion={showQuestion}
                  showDiscuss={showDiscuss}
                  anchorIdHandler={anchorIdHandler}
                  clickPoll={clickPoll}
                  anchorIdHL={anchorIdHL}
                  hlElementHandler={hlElementHandler}
                  cardCommentId={cardCommentId}
                  showHeaderForm={showHeaderForm}
                  pathPush={pathPush}
                  symbolHandler={symbolHandler}
                />
                <BulletEditor />
              </>
            ) : (
              <RenderTokenStream
                stream={sect.stream}
                ref={ref}
                showQuestion={showQuestion}
                showDiscuss={showDiscuss}
                anchorIdHandler={anchorIdHandler}
                clickPoll={clickPoll}
                anchorIdHL={anchorIdHL}
                hlElementHandler={hlElementHandler}
                cardCommentId={cardCommentId}
                showHeaderForm={showHeaderForm}
                pathPush={pathPush}
                symbolHandler={symbolHandler}
              />
            )}
            {/* {console.log(sect)} */}
            <span
              className={classes.sectionEditBtn}
              onClick={() => {
                setShowEditor(prev => !prev)
                setShowHeaderForm(prev => !prev)
                // setShowEditor(prev => !prev)
                // setShowHeaderForm(prev => !prev)
              }}
            >
              <span className={classes.sectionEditBtnText}>{showEditor ? '儲存' : '編輯'}</span>
              {/* {!showEditor && !showHeaderForm && showPopover && (
                <MyEditBtnPopover showHeaderFormHandler={showHeaderFormHandler} />
              )} */}
              {/* <svg width="30" height="30" viewBox="0 0 30 30" preserveAspectRatio="xMinYMin meet">
                <path d="M 3 10 L 15 24 L 27 10" fill="transparent" /> */}
              {/* </svg> */}
            </span>
          </div>
        </div>
      )
    }
    return null
  },
)
RenderSection.displayName = 'RenderSection'

export const RenderCardBody = forwardRef(
  (
    {
      sects,
      text,
      titleRef,
      showQuestion,
      cardCommentId,
      // pollCommentIdHandler,
      anchorIdHandler,
      clickPoll,
      showDiscuss,
      anchorIdHL,
      hlElementHandler,
      pathPush,
      symbolHandler,
    }: {
      sects?: Section[]
      text?: string[]
      titleRef?: (arr: any[]) => void
      showQuestion?: () => void
      cardCommentId?: number
      // pollCommentIdHandler?: (commentId: string) => void
      anchorIdHandler?: (anchorId: string) => void
      clickPoll?: (commentId: string) => void
      showDiscuss?: () => void
      anchorIdHL?: string
      hlElementHandler?: (el: HTMLSpanElement) => void
      pathPush: (symbol: string) => void
      symbolHandler: (symbol: string) => void
    },
    ref,
  ): JSX.Element => {
    // const sectsFilter: (Section | string)[] = [
    //   ...sects.filter(e => e.nestedCard !== undefined || e.stream?.length !== 0),
    // ]
    // sectsFilter[sectsFilter.length] = 'newcard'
    // const [sectArr, setSectArr] = useState(sectsFilter)
    // console.log(sectArr)
    type MyRef = {
      spanRef: any[]
      anchorRef: any[]
    }
    const myRef = useRef<any>([])

    interface PanelArr {
      content: string
      panel: boolean
    }

    return (
      <>
        {/* {console.log(sects)} */}
        {/* {sectsFilter
          // {sects
          //   .filter(e => e.nestedCard !== undefined || e.stream?.length !== 0)
          .map((e, i) => {
            if (typeof e === 'string') {
              return (
                <div className={`${classes.cardSection} ${classes.opacity50}`}>
                  <div className={classes.cardSectionInner}>
                    <HeaderForm initialValue={{ authorChoice: '', authorLines: '', title: '' }} />
                    <BulletEditor />
                  </div>
                </div>
              )
            }
            return (
              <RenderSection
                key={i}
                sect={e}
                text={(text && text[i]) || ''}
                ref={el => {
                  // console.log(el)
                  myRef.current[i] = el
                }}
                showQuestion={showQuestion}
                cardCommentId={cardCommentId || 0}
                anchorIdHandler={anchorIdHandler}
                // pollCommentIdHandler={pollCommentIdHandler}
                clickPoll={clickPoll}
                showDiscuss={showDiscuss}
                anchorIdHL={anchorIdHL}
                hlElementHandler={hlElementHandler}
                pathPush={pathPush}
                symbolHandler={symbolHandler}
              />
            )
          })} */}
        {/* {console.log(myRef.current)} */}
        {titleRef && titleRef(myRef.current)}
        {/* <div>newCard</div> */}
      </>
    )
  },
)
RenderCardBody.displayName = 'RenderCardBody'

export const CardBody = ({
  // card,
  bySrc,
  // cardCommentId,
  titleRefHandler,
  showQuestion,
  commentIdHandler,
  // pollCommentIdHandler,
  anchorIdHandler,
  clickPoll,
  showDiscuss,
  anchorIdHL,
  hlElementHandler,
  pathPush,
  symbolHandler,
}: {
  // card: CocardFragment
  bySrc?: string
  // cardCommentId: number
  titleRefHandler?: (arr: any[]) => void
  showQuestion?: () => void
  commentIdHandler?: (commentId: string) => void
  // pollCommentIdHandler: (commentId: string) => void
  clickPoll: (commentId: string) => void
  anchorIdHandler: (anchorId: string) => void
  showDiscuss: () => void
  anchorIdHL: string
  hlElementHandler: (el: HTMLSpanElement) => void
  pathPush: (symbol: string) => void
  symbolHandler?: (symbol: string) => void
}): JSX.Element => {
  // console.log(card)

  // if (card.body === null) return <p>[Error]: null body</p>

  // const meta: CardMeta | undefined = card.meta ? (JSON.parse(card.meta) as CardMeta) : undefined
  // const editor = new Editor(card.body?.text, card.body?.meta, card.link.url, card.link.oauthorName ?? undefined)
  // editor.flush({ attachMarkerlinesToTokens: true })
  // // console.log(editor.getText())
  // const text = editor.getText().split(/^\n/gm)
  // console.log(text.split(/^\n/gm))
  return (
    <>
      {/* <RenderCardBody
      sects={editor.getSections()}
      text={text}
      titleRef={titleRefHandler}
      showQuestion={showQuestion}
      // cardCommentId={(card.meta as CardMeta).commentId}
      anchorIdHandler={anchorIdHandler}
      // pollCommentIdHandler={pollCommentIdHandler}
      clickPoll={clickPoll}
      showDiscuss={showDiscuss}
      anchorIdHL={anchorIdHL}
      // ref={ref}
      hlElementHandler={hlElementHandler}
      pathPush={pathPush}
      // symbolHandler={symbolHandler}
    /> */}
    </>
  )
}

export function CardHead({
  // card,
  sect,
  height,
}: {
  // card: CocardFragment
  sect: Section[]
  height: number
}): JSX.Element {
  const headerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const hasWindow = typeof window !== undefined
  const [windowWidth, setWindowWidth] = useState(hasWindow ? window.innerWidth : null)
  useEffect(() => {
    if (hasWindow) {
      window.addEventListener('resize', () => {
        setWindowWidth(window.innerWidth)
      })
      return () =>
        window.removeEventListener('resize', () => {
          // setWindowWidth(window.innerWidth)
        })
    }
  }, [hasWindow])
  // const title = findOneComment(MARKER_FORMAT.srcTitle.mark, card.comments)
  // const publishDate = findOneComment(MARKER_FORMAT.srcPublishDate.mark, card.comments);
  // const _comment: CommentFragment = {
  //   __typename: 'Comment',
  //   id: 'string',
  //   userId: 'string',
  //   cocardId: 10,
  //   ocardId: null,
  //   selfcardId: null,
  //   isTop: false,
  //   text: 'Buy vs Sell',
  //   // replies: [],
  //   // topReplies: null,
  //   poll: null,
  //   count: {
  //     __typename: 'CommentCount',
  //     id: 'string;',
  //     nViews: 1,
  //     nUps: 2,
  //     nDowns: 3,
  //   },
  //   meta: null,
  //   createdAt: null,
  // }

  // let cardTitle = card.link.url
  // // ticker的title
  // const cardDomain = card.link.domain
  // if (cardDomain === '_') {
  //   cardTitle = cardTitle.slice(2)
  // }
  const [titleClick, setTitleClick] = useState(false)
  const titleClickedHandler = () => {
    setTitleClick(prev => !prev)
  }
  // console.log(height)

  return (
    <></>
    // <div
    //   className={classes.header}
    //   ref={headerRef}
    //   style={{
    //     top: `-${
    //       headerRef.current &&
    //       windowWidth &&
    //       (windowWidth < 500 ? headerRef.current.clientHeight - 80 : headerRef.current.clientHeight - 45)
    //     }px`,
    //   }}
    // >
    //   <div>
    //     {cardDomain === '_' ? (
    //       <h1 className={classes.tickerTitle}>{cardTitle.replace('[[', '').replace(']]', '')}</h1>
    //     ) : (
    //       <>
    //         <div className={classes.headerTopWrapper}>
    //           <span className={classes.flexContainer}>
    //             <span className={classes.author}>
    //               {/* <a href={cardTitle} target="_blank" rel="noreferrer"> */}
    //               {card.link.oauthorName?.replace(/(.+):.+/gm, '$1')}
    //               {/* <LinkIcon className={classes.linkIcon} /> */}
    //               {/* </a> */}
    //             </span>
    //             {/* <span className={classes.webName}></span> */}
    //             <span className={classes.date}>2021 / 4 / 9</span>
    //           </span>
    //           {/* <ClockIcon className={classes.clockIcon} /> */}
    //           {/* <span className={classes.date}>{publishDate && stringToArr(publishDate.text ?? "", "T", 0)}</span> */}
    //           {/* <MyTooltip
    //         title="ARK女股神Cathie Wood持续加仓买入已经拥有1400万美元 不能错过的新能源股票 电动三宝
    //         蔚来，理想，小鹏，特斯拉股票交易策略更新 NIU股票小牛电动股票分析 美股投资"
    //       > */}
    //           <a className={classes.link} href={cardTitle} target="_blank" rel="noreferrer">
    //             <span
    //               className={`${classes.title} ${titleClick ? classes.titleExpand : ''} ${
    //                 height > 90 && classes.scroll
    //               } `}
    //               onClick={titleClickedHandler}
    //               ref={titleRef}
    //             >
    //               {/* {console.log(headerRef.current?.offsetTop - height)} */}
    //               ARK女股神Cathie Wood持续加仓买入已经拥有1400万美元 不能错过的新能源股票 电动三宝
    //               蔚来，理想，小鹏，特斯拉股票交易策略更新 NIU股票小牛电动股票分析 美股投资
    //             </span>
    //             {/* <LinkIcon className={classes.linkIcon} /> */}
    //             {/* 連結{'\n'} */}
    //           </a>
    //         </div>
    //         <div className={`${classes.symbolContainer} ${height > 90 && classes.scroll && classes.scroll}`}>
    //           {/* <span>Tags:</span> */}
    //           {sect.map((e, i) => {
    //             if (e.nestedCard) {
    //               return (
    //                 <span key={i} className={classes.symbol}>
    //                   {e.nestedCard.symbol}
    //                 </span>
    //               )
    //             }
    //           })}
    //         </div>
    //         <span
    //           className={`${classes.title} ${classes.titleShort} ${height > 91 && classes.scroll}`}
    //           // onClick={titleClickedHandler}
    //           // ref={titleRef}
    //         >
    //           {/* {console.log(headerRef.current?.offsetTop - height)} */}
    //           ARK女股神Cathie Wood持续加仓买入已经拥有1400万美元 不能错过的新能源股票 电动三宝
    //           蔚来，理想，小鹏，特斯拉股票交易策略更新 NIU股票小牛电动股票分析 美股投资
    //         </span>
    //         {/* </MyTooltip> */}
    //       </>
    //     )}
    //   </div>

    //   {/* <div><Comment comment={comment} /></div> */}
    //   {/* {console.log(card)} */}
    //   {/* {cardTitle} */}
    //   {/* {title && title.text + '\n'} */}
    //   {/* {publishDate && publishDate.text + '\n'} */}
    //   {/* {card.link.oauthorName + '\n'} */}
    //   {/* {'(NEXT)Keywords\n'} */}
    //   {/* {card.comments.length === 0 ? "新建立" : undefined} */}
    // </div>
  )
  // }

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
}
