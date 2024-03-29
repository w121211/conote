/* eslint-disable no-console */
import React, { FormEvent, useCallback, useEffect, useMemo, useState, createContext, useRef } from 'react'
import Link from 'next/link'
import router, { useRouter } from 'next/router'
import { ApolloClient, ApolloError, useApolloClient } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import { Token } from 'prismjs'
import { CardType } from '@prisma/client'
import RightArrow from '../../assets/svg/right-arrow.svg'
// import { editorValue } from '../apollo/cache'
import {
  Board,
  BoardQuery,
  BulletCount,
  Card,
  CardBodyInput,
  CardDocument,
  CardQuery,
  CardQueryVariables,
  Comment,
  CommentsDocument,
  CommentsQuery,
  CommentsQueryVariables,
  CreateSymbolCardDocument,
  CreateSymbolCardMutation,
  CreateSymbolCardMutationVariables,
  useBoardQuery,
  useBulletQuery,
  useCardQuery,
  useCommentsQuery,
  useCreateCardBodyMutation,
  useCreateHashtagMutation,
  useCreateOauthorCommentMutation,
  useMeQuery,
  useWebpageCardQuery,
} from '../apollo/query.graphql'
import classes from './card.module.scss'
import BoardPage from '../components/board/board-page'
import CreateBoardPage from '../components/board/create-board-page'
import Popover from '../components/popover/popover'
import { BulletEditor } from '../components/editor/editor'
import { Serializer } from '../components/editor/serializer'
import { LiElement } from '../components/editor/slate-custom-types'
import { tokenize } from '../lib/bullet/text'
import { Bullet, BulletDraft, RootBullet, RootBulletDraft } from '../lib/bullet/types'
import {
  CardBodyContent,
  CardHeadContent,
  CardHeadContentValue,
  CardHeadContentValueInjected,
  PinBoard,
} from '../lib/models/card'
import { injectCardHeadValue } from '../lib/models/card-helpers'
import UpDown from '../components/upDown/upDown'
import MyTooltip from '../components/my-tooltip/my-tooltip'

import BulletPanelSvg from '../components/bullet-panel/bullet-panel-svg'
import BulletPanel from '../components/bullet-panel/bullet-panel'
import SrcIcon from '../assets/svg/foreign.svg'
import { getLevels, Level, useLocalValue } from './editor/open-li'
// import { Node } from 'slate'

// type CardHeadAndParsedContent = Omit<CardHead, 'content'> & {
//   content: CardHeadContent
// }

// type CardBodyAndParsedContent = Omit<CardBody, 'content'> & {
//   content: CardBodyContent
// }

type CardParsed = Card & {
  headContent: CardHeadContent
  bodyContent: CardBodyContent
  headValue: CardHeadContentValueInjected
}

/**
 * 針對query後收到的gql card做後續parse，所以在此處理而非在後端
 */
export function parseCard(card: Card): CardParsed {
  const headContent: CardHeadContent = JSON.parse(card.head.content)
  const bodyContent: CardBodyContent = JSON.parse(card.body.content)
  // console.log(bodyContent)
  const headValue = injectCardHeadValue({ bodyRoot: bodyContent.self, value: headContent.value })
  return {
    ...card,
    headContent,
    bodyContent,
    headValue,
  }
}

function getTabUrl(): string | null {
  let url: string | null
  if (window.location.protocol.includes('extension')) {
    // popup的情況
    const params = new URLSearchParams(new URL(window.location.href).search)
    url = params.get('u')
  } else {
    // inject的情況
    url = window.location.href
  }

  return url
}

/**
 * 用 client.query(...) 而非使用 useQuery(...)，適用在非 component 但需要取得 card 的情況，例如取得 mirror
 *
 * @returns 當有 card 時返回 card body bullet root; 找不到 card 時 root 為 undefined，error 為 undefined; error 時只返回 error
 */
export async function queryAndParseCard(props: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  client: ApolloClient<object>
  symbol: string
  mirror?: true
}): Promise<{ root?: RootBullet; error?: ApolloError }> {
  const { symbol, client, mirror } = props

  const { data, error } = await client.query<CardQuery, CardQueryVariables>({
    query: CardDocument,
    variables: { symbol },
  })

  let root: RootBullet | undefined
  if (data && data.card) {
    const parsed = parseCard(data.card)
    root = {
      ...parsed.bodyContent.self,
      mirror, // 增加mirror property
    }
  }

  return { root, error }
}

/**
 * 用client.query(...)方式create symbol card
 *
 * @returns 當有card時返回card body bullet root; 找不到card時root為undefined，error為undefined; error時只返回error
 */
export async function createAndParseCard(props: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  client: ApolloClient<object>
  symbol: string
  mirror?: true
}): Promise<{ root?: RootBullet }> {
  const { symbol, client, mirror } = props

  const { data } = await client.mutate<CreateSymbolCardMutation, CreateSymbolCardMutationVariables>({
    mutation: CreateSymbolCardDocument,
    variables: { data: { symbol } },
  })

  let root: RootBullet | undefined
  if (data && data.createSymbolCard) {
    const parsed = parseCard(data.createSymbolCard)
    root = {
      ...parsed.bodyContent.self,
      mirror,
    }
  }
  return { root }
}

/**
 * 若是webpage card，query nested cards，並轉body
 */
async function buildCardBody(props: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  client: ApolloClient<object>
  card: CardParsed
}): Promise<{
  self: RootBullet
  mirrors?: RootBullet[]
}> {
  const { card, client } = props

  // 非webpage card，只有self
  if (card.type !== CardType.WEBPAGE) {
    return { self: card.bodyContent.self }
  }

  // Webpage card，需要query and parse mirrors
  const self = card.bodyContent.self
  self.self = true // 設定此root的self flag

  const mirrors: RootBullet[] = []
  if (card.bodyContent.mirrors) {
    const results = await Promise.all(
      card.bodyContent.mirrors.map(e => queryAndParseCard({ client, symbol: e.symbol, mirror: true })),
    )
    for (const { root, error } of results) {
      if (error) {
        // TODO: 針對fail的卡要怎樣處理？
        console.error(error)
        continue
      }
      if (root) {
        mirrors.push(root)
      }
    }
  }
  return { self, mirrors }
}

const OauthorCommentForm = ({
  boardId,
  pollId,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onUpdated = () => {},
}: {
  boardId: string
  pollId?: string
  onUpdated?: () => void
}) => {
  const [createOauthorComment] = useCreateOauthorCommentMutation({
    update(cache, { data }) {
      const res = cache.readQuery<CommentsQuery, CommentsQueryVariables>({
        query: CommentsDocument,
        variables: { boardId },
      })
      if (data?.createOauthorComment && res?.comments) {
        cache.writeQuery({
          query: CommentsDocument,
          variables: { boardId },
          data: { comments: res.comments.concat([data.createOauthorComment]) },
        })
        // addReplyCountByOne()
        // form.resetFields()
        if (onUpdated) {
          onUpdated()
        }
      }
    },
  })

  return (
    <div>
      <h3>Create oauthor comment/vote</h3>
      <form
        onSubmit={event => {
          event.preventDefault()
          const data: Record<string, string> = {}
          for (const [k, v] of new FormData(event.currentTarget).entries()) {
            data[k] = v as string
          }
          const vote =
            data['vote'] === 'NULL' ? undefined : { choiceIdx: ['BUY', 'SELL', 'WATCH'].indexOf(data['vote']) }
          createOauthorComment({
            variables: {
              boardId,
              pollId,
              oauthorName: data['oauthor'],
              data: {
                content: data['content'],
                vote,
              },
            },
          })
        }}
      >
        <label>
          Oauthor:
          <input type="text" id="oauthor" name="oauthor" defaultValue="刘翔的投资频道:youtube.com" />
        </label>
        <br />
        <label>
          Comment:
          <input type="text" id="content" name="content" defaultValue="Hahaha!" />
        </label>
        <br />
        <label>
          Vote:
          <select id="vote" name="vote">
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
            <option value="WATCH">WATCH</option>
            <option value="NULL">null</option>
          </select>
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <p>
      [{comment.vote?.choiceIdx}] {comment.content} (@{comment.oauthorName} @@{comment.userId})
    </p>
  )
}

export const BoardItem = (props: { boardId: string; pollId?: string }) => {
  const { boardId, pollId } = props
  // const [reload, setReload] = useState(false)
  const boardResult = useBoardQuery({ variables: { id: boardId } })
  const commentsResult = useCommentsQuery({ variables: { boardId } })

  if (boardResult.loading || commentsResult.loading) {
    return <div>Loading</div>
  }
  if (boardResult.error || commentsResult.error) {
    return <div>Error</div>
  }
  return (
    <div>
      {boardResult.data && boardResult.data.board && (
        <p>
          {boardResult.data.board.hashtag}
          {boardResult.data.board.poll && boardResult.data.board.poll.choices.map((e, i) => <span key={i}>e</span>)}
        </p>
      )}
      {commentsResult.data &&
        commentsResult.data.comments &&
        commentsResult.data.comments.map((e, i) => <CommentItem key={i} comment={e} />)}
      <OauthorCommentForm boardId={boardId} pollId={pollId} />
    </div>
  )
}

function hastaggable(node: Bullet | BulletDraft): boolean {
  if (node.id && !node.freeze) {
    return true
  }
  return false
}

const TokenItem = (props: {
  token: Token | string
  handleSymbol?: (symbol: string) => void
  depth?: number
  self?: boolean
  handleClickChoice?: (content: string) => void
}) => {
  const { token, handleSymbol, depth, self, handleClickChoice } = props
  // console.log(token)
  if (typeof token === 'string') {
    return <span className={classes.text}>{token}</span>
  }
  if (typeof token.content === 'string') {
    switch (token.type) {
      case 'ticker':
      case 'topic':
        return (
          <>
            {self ? (
              <span className={classes.self}>Self</span>
            ) : (
              <span
                className={`${classes.link} ${depth === 0 ? classes.mirrorTitle : ''}`}
                onClick={e => {
                  // e.preventDefault()
                  if (
                    typeof token.content === 'string' &&
                    (token.content.startsWith('$') || token.content.startsWith('[['))
                  ) {
                    // console.log(token.content)
                    handleSymbol && handleSymbol(token.content)
                  }
                }}
              >
                {token.content}
              </span>
            )}
          </>
        )
      case 'vote-chocie':
        return (
          <span
            className={classes.link}
            onClick={e => {
              // e.preventDefault()
              e.stopPropagation()
              handleClickChoice && handleClickChoice(token.content as string)
            }}
          >
            {token.content}
          </span>
        )
      // case 'mark':
      //   return <span className={classes.marker}>{token.content}</span>
      default:
        return <span>{token.content}</span>
    }
  }
  return null
}

// const markerTemplate=(text:string,marker:string,deth) => {

// }

const markToText = (
  e: string,
  handleSymbol?: (symbol: string) => void,
  handleClickChoice?: (content: string) => void,
): JSX.Element => {
  switch (e) {
    case '[vs]':
      return (
        <span>
          比較<span className={classes.markerSyntax}>{e}</span>
        </span>
      )
    case '[*]':
      return (
        <span>
          概要<span className={classes.markerSyntax}>{e}</span>
        </span>
      )
    case '[+]':
      return (
        <span>
          加<span className={classes.markerSyntax}>{e}</span>
        </span>
      )
    case '[-]':
      return (
        <span>
          減<span className={classes.markerSyntax}>{e}</span>
          {/* {console.log()} */}
        </span>
      )
    case '[?]':
      return (
        <span>
          提問<span className={classes.markerSyntax}>{e}</span>
        </span>
      )
    case '[key]':
      return (
        <span>
          關鍵字<span className={classes.markerSyntax}>{e}</span>
        </span>
      )
    case '[!]':
      return (
        <span>
          最新<span className={classes.markerSyntax}>{e}</span>
        </span>
      )
    default:
      return (
        // <span>
        //   {/* {console.log(e)} */}
        //   {/* {e.replace('[[', '').replace(']]', '')} */}
        //   {e}
        // </span>
        <>
          {tokenize(e).map((el, i) => (
            <TokenItem token={el} key={i} handleSymbol={handleSymbol} handleClickChoice={handleClickChoice} />
          ))}
        </>
      )
  }
}

const BulletItem = (props: {
  node: Bullet | BulletDraft

  // handleClickChoice?:(content:string)=>void
  depth: number
  type: string
  handleSymbol: (symbol: string) => void
  cardId: string
  mirror?: boolean
}) => {
  // const [filtered, setFiltered] = useState()

  const { depth, node, handleSymbol, cardId, mirror } = props
  // console.log(node)
  const [showBoard, setShowBoard] = useState<number | undefined>()
  const [showPanel, setShowPanel] = useState<boolean>(false)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [showChildren, setShowChildren] = useState(depth < depth + 2 ? true : false)
  const [clickChoiceIdx, setClickChoiceIdx] = useState<number | undefined>()
  // const [choice,setChoice]=useState<BulletCount>()
  // const { node } = props

  const headTokens = tokenize(node.head)
  const bodyTokens = node.body ? tokenize(node.body) : undefined
  const { data: bulletData, loading, error } = useBulletQuery({ variables: { id: `${node.id ?? ''}` } })

  //   useEffect(()=>{
  //     if(bulletData?.bullet){
  // setChoice(bulletData.bullet.count)

  //     }

  //   },[bulletData])

  const hideBoard = (i: number) => {
    setShowBoard(undefined)
  }
  const hideCreateBoard = () => {
    setShowCreateBoard(false)
  }
  const handleClickChoice = (content: string) => {
    const hashtagIdx = node.hashtags?.findIndex(e => e.boardId === node.boardId)
    const filterHead = node.head.split(' ').filter(e => e.startsWith('<'))
    const contentIdx = filterHead.findIndex(e => e === content)
    setClickChoiceIdx(contentIdx)

    setShowBoard(hashtagIdx)
  }

  // const [createHashtag] = useCreateHashtagMutation()

  const nextDepth = depth + 1
  const cutString = (s: string) => {
    if (s.length > 6) {
      return s.substring(0, 5) + '...'
    }
    return s
  }
  return (
    <>
      {depth < 2 && (!node.children || (node.children && node.children.length === 0)) ? null : (
        <li className={classes.inlineValue}>
          <div className={classes.bulletPanelSibling}></div>

          <span className={classes.bulletWrapper}>
            <span
              className={classes.bullet}
              onClick={() => {
                setShowChildren(prev => !prev)
              }}
            >
              <svg
                viewBox="0 0 18 18"
                className={`${classes.bulletSvg} ${
                  showChildren || (node.children.length === 0 && node.children) ? '' : classes.bulletSvgBg
                } ${mirror && classes.mirrorBullet}`}
              >
                <circle cx="9" cy="9" r="4" />
              </svg>
              {/* • */}
            </span>
            {node.oauthorName ? (
              <MyTooltip className={classes.bulletTooltip}>
                <span className={classes.oauthorName}> @{cutString(node.oauthorName.split(':', 1)[0])}</span>
              </MyTooltip>
            ) : null}

            {showCreateBoard && node.id && (
              <CreateBoardPage
                subTitle={node.head}
                bulletId={node.id}
                cardId={cardId}
                visible={showCreateBoard}
                hideBoard={hideCreateBoard}
              />
            )}
          </span>
          {(hastaggable(node) || node.sourceUrl) && (
            <BulletPanel className={classes.bulletPanel} visible={showPanel}>
              {[
                { icon: '#', text: '新增標籤' },
                { icon: <SrcIcon />, text: '查看來源' },
              ]}
            </BulletPanel>
          )}
          <span className={classes.bulletContent}>
            {depth === 0
              ? headTokens.map((el, i) => (
                  <TokenItem token={el} key={i} handleSymbol={handleSymbol} depth={0} self={!mirror} />
                ))
              : markToText(node.head, handleSymbol, handleClickChoice)}
            {/* {headTokens.map(
            (e, i) => (
              
        

                <TokenItem key={i} token={e} />
              
            ),
            // ),
          )} */}
            {node.hashtags &&
              node.hashtags.map((e, i) => (
                <span
                  className={classes.hashtag}
                  key={i}
                  onClick={() => {
                    setShowBoard(i)
                  }}
                >
                  {' ' + e.text}
                  {e.boardId && (
                    <Popover visible={i === showBoard} hideBoard={() => hideBoard(i)} subTitle={node.head}>
                      <BoardPage
                        title={e.text}
                        boardId={e.boardId.toString()}
                        pollId={node.pollId?.toString()}
                        clickedChoiceIdx={i === showBoard ? clickChoiceIdx : undefined}
                        // description={e.content}
                        // visible={showBoard}
                        // hideBoard={hideBoard}
                      />
                    </Popover>
                  )}
                </span>
                // <Link key={i} href={`/lab/board/[board]`} as={`/lab/board/${e.boardId}`}>
                //   {e.text}
                // </Link>
              ))}

            {/* {bulletData?.bullet.count && node.id && (
              <UpDown choice={bulletData.bullet.count} bulletId={node.id.toString()} />
            )} */}

            {bodyTokens && (
              <div className={classes.bulletBody}>
                {/* <br /> */}
                {bodyTokens.map((e, i) => (
                  <TokenItem key={i} token={e} handleSymbol={handleSymbol} />
                ))}
              </div>
            )}

            {/* 若為topic ticker 標題一律顯示children */}
            {/* {headTokens.find(e => typeof e !== 'string' && (e.type === 'topic' || e.type === 'ticker')) && (
            <ul>{node.children && node.children.map((e, i) => <BulletItem key={i} node={e} />)}</ul>
          )} */}
            {/* 若為topic ticker標題的children click bullet控制是否渲染children */}
            {showChildren && (
              <ul>
                {node.children &&
                  node.children.map((e, i) => (
                    <BulletItem
                      key={i}
                      node={e}
                      depth={nextDepth}
                      type={props.type}
                      handleSymbol={handleSymbol}
                      cardId={cardId}
                    />
                  ))}
              </ul>
            )}
          </span>
        </li>
      )}
    </>
  )
}

const CardBodyItem = (props: {
  card: Card
  self: BulletDraft
  mirrors?: BulletDraft[]
  handleSymbol: (symbol: string) => void
}) => {
  const { card, self, mirrors, handleSymbol } = props

  if (card.type === 'WEBPAGE') {
    // 可能有mirrors
    return (
      <div className={classes.cardBodyItem}>
        {/* {self && <span className={classes.tickerTitle}>Self</span>} */}
        <ul>
          <BulletItem node={self} handleSymbol={handleSymbol} depth={0} type={card.type} cardId={card.id} />
        </ul>
        {/* {self.children &&
          self.children.map((e, i) => (
            <ul key={i}>
              <BulletItem node={e} handleSymbol={handleSymbol} depth={0} type={card.type} cardId={card.id} />
            </ul>
          ))} */}
        {mirrors &&
          mirrors.map((e, i) => (
            <ul key={i}>
              {/* {<span className={classes.tickerTitle}>{markToText(e.head, handleSymbol)}</span>} */}
              {/* {e.children.map((el, ind) => { */}
              {/* return ( */}
              <BulletItem
                node={e}
                handleSymbol={handleSymbol}
                depth={0}
                type={card.type}
                cardId={card.id}
                key={i}
                mirror
              />
              {/* })} */}
            </ul>
          ))}
      </div>
    )
  }
  // 沒有mirrors ，從第二層開始顯示 (ie 忽略root)
  return (
    <div>
      <ul>
        {self.children?.map((e, i) => (
          <BulletItem key={i} node={e} handleSymbol={handleSymbol} depth={1} type={card.type} cardId={card.id} />
        ))}
      </ul>
    </div>
  )
}

/**
 * Show a card 1. 有mirrors (ie webpage card) 2. 沒有mirrors
 */

export const CardItem = (props: { card: Card; handleSymbol: (symbol: string) => void }) => {
  const { card, handleSymbol } = props
  // console.log(card)
  // const parsedCard = parseCard(card)
  // const pinBoard = parsedCard.headValue.pinBoards.find(e => e.pinCode === 'BUYSELL')

  const client = useApolloClient()
  const [showBoard, setShowBoard] = useState(false)

  const [headContentValue, setHeadContentValue] = useState<CardHeadContentValue | undefined>()
  const [self, setSelf] = useState<RootBullet | RootBulletDraft>()
  const [mirrors, setMirrors] = useState<RootBullet[] | RootBulletDraft[] | undefined>()

  const [pinBoardBuysell, setPinBoardBuysell] = useState<PinBoard | undefined>()
  const [edit, setEdit] = useState(false)
  const [bodyTree, setBodyTree] = useState<BulletDraft>() // tree root不顯示

  // useEffect(() => {
  //   if (root && path) {
  //     const levels = getLevels(root, path)
  //     levels.pop() // 最後一個是當前的 li ，不需要
  //     setLevels(levels)
  //   }
  // }, [root, path])

  const contentRef = useRef<HTMLDivElement>(null)
  const handleClickOutOfEditor = (e: MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      setEdit(false)
    }
  }
  useEffect(() => {
    document.body.addEventListener('click', handleClickOutOfEditor, true)
    return () => {
      document.body.removeEventListener('click', handleClickOutOfEditor), true
    }
  }, [])

  // const [bodyChildren, setBodyChildren] = useState<BulletDraft[]>(bodyRootDemo.children ?? [])
  // const [bodyChildren, setBodyChildren] = useState<BulletDraft[]>([])
  // const [editorValue, setEditorValue] = useState<Descendant[]>([])
  // console.log(card)
  const hideBoard = () => {
    setShowBoard(false)
  }

  // useEffect(() => {
  //   async function build() {
  //     const tree = await buildBodyTree({ card: parsedCard, client })
  //     setBodyTree(tree)
  //     setBodyChildren(tree.children ?? [])
  //     // console.log(tree)
  //     // console.log(card)
  //   }
  //   build()
  // console.log(card)
  const [editorInitialValue, setEditorInitialValue] = useState<LiElement[] | undefined>()
  const cardini: CardBodyContent = JSON.parse(card.body.content)
  const { root, mirror, path, openedLi, value, setLocalValue } = useLocalValue([Serializer.toRootLi(cardini.self)])
  // console.log('openLi', openedLi)

  useEffect(() => {
    async function _parseAndBuildCard() {
      const parsed = parseCard(card)
      setHeadContentValue(parsed.headContent.value)
      // console.log(parsed)
      // TODO: 改為更general的方式，而不是只針對BUYSELL
      const _pinBoardBuysell = parsed.headValue.pinBoards.find(e => e.pinCode === 'BUYSELL')
      setPinBoardBuysell(_pinBoardBuysell)

      const { self, mirrors } = await buildCardBody({ client, card: parsed })
      setSelf(self)
      setMirrors(mirrors)

      const lis: LiElement[] =
        card.type === 'WEBPAGE'
          ? [Serializer.toRootLi(self), ...(mirrors ?? []).map(e => Serializer.toRootLi(e))]
          : [Serializer.toRootLi(self)]

      // console.log(lis)

      setEditorInitialValue(lis)

      // setEdit(false) // 需要重設來trigger editor rerender
    }

    _parseAndBuildCard()
  }, [card])

  // useEffect(() => {
  //   if (editorInitialValue) {
  //     setLocalValue(editorInitialValue)
  //   }
  // }, [editorInitialValue])

  const onCloseEditor = useCallback(() => {
    const value = editorValue() // 從cache取得目前的editor value
    if (value === undefined) {
      setEdit(false)
      return
    }
    setEditorInitialValue(value)

    const [first, ...rest] = value
      .map(e => {
        console.log(e)
        try {
          return Serializer.toRootBulletDraft(e)
        } catch (err) {
          console.warn(err)
        }
      })
      .filter((e): e is RootBulletDraft => e !== undefined)

    console.log(first)

    setSelf(first)
    if (card.type === 'WEBPAGE') {
      setMirrors(rest)
    }
    setEdit(false)
  }, [])

  const [createCardBody, { error }] = useCreateCardBodyMutation({
    update(cache, { data }) {
      const res = cache.readQuery<CardQuery, CardQueryVariables>({
        query: CardDocument,
        variables: { symbol: card.symbol },
      })
      if (data?.createCardBody && res?.card) {
        cache.writeQuery<CardQuery, CardQueryVariables>({
          query: CardDocument,
          variables: { symbol: card.symbol },
          data: { card: { ...res.card, body: data.createCardBody } },
        })
      }
      // if (afterUpdate && data?.createCardBody) {
      //   afterUpdate(data.createCardBody)
      // }
    },
  })

  const onSubmit = useCallback(async () => {
    // console.log(self)
    // console.log(mirrors)
    const data: CardBodyInput = card.type === 'WEBPAGE' ? { self, mirrors } : { self }
    try {
      await createCardBody({
        variables: { cardId: card.id, data },
      })
    } catch (err) {
      console.log(err)
    }
  }, [self, mirrors])
  // console.log(card)
  const formateDate = (date: any) => {
    let yourDate = new Date(date)
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - offset * 60 * 1000)
    return yourDate.toISOString().split('T')[0]
  }
  // const creatDate=new Date(card.createdAt)
  // const updateDate=new Date(card.updatedAt)
  return (
    <div>
      {/* <h3>Head</h3> */}
      {/* <h1 className={classes.title}>{}</h1> */}
      <span className={classes.title}>{headContentValue?.title || card.symbol}</span>
      {/* {console.log(pinBoard)} */}
      {pinBoardBuysell && pinBoardBuysell.pinCode === 'BUYSELL' && (
        <div>
          <span
            className={classes.tags}
            onClick={() => {
              setShowBoard(!showBoard)
            }}
          >
            看多/看空/觀望
          </span>
        </div>
      )}
      <div className={classes.date}>
        <span>創建於{formateDate(card.createdAt)} / </span>
        <span>更新於{formateDate(card.updatedAt)}</span>
      </div>
      {/* {parsedCard.headContent.value.template}
      {parsedCard.headContent.value.keywords}
      {parsedCard.headContent.value.tags} */}
      {/* <h3>Board</h3> */}
      {/* <button
        onClick={() => {
          setShowBoard(!showBoard)
        }}
      >
        Board
      </button> */}
      {showBoard && pinBoardBuysell && (
        <Popover visible={showBoard} subTitle={self?.head} hideBoard={hideBoard}>
          <BoardPage
            boardId={pinBoardBuysell.boardId.toString()}
            pollId={pinBoardBuysell.pollId?.toString()}
            title={'看多/看空/觀望'}
            // visible={showBoard}
            // hideBoard={hideBoard}
          />
        </Popover>
      )}
      {/* {showBoard && pinBoard && (
        <BoardItem boardId={pinBoard.boardId.toString()} pollId={pinBoard.pollId?.toString()} />
      )} */}
      {/* {console.log(pinBoard)} */}
      {/* <h3>Body</h3> */}
      {/* <button
        data-type="secondary"
        onClick={() => {
          if (edit) onCloseEditor()
          else setEdit(true)
        }}
      >
        編輯
      </button> */}
      <span>{edit ? '編輯模式' : '閱讀模式'}</span>

      {!edit && editorInitialValue && (
        <button
          data-type="primary"
          onClick={event => {
            event.preventDefault()
            onSubmit()
          }}
        >
          送出
        </button>
      )}

      {error && <div>Submit fail...</div>}

      <div onClick={() => setEdit(true)} ref={contentRef}>
        {/* {console.log(editorInitialValue)} */}
        {
          self ? (
            <>
              <BulletEditor
                initialValue={value}
                oauthorName={card.link?.oauthorName ?? undefined}
                sourceUrl={card.link?.url}
                withMirror={card.type === 'WEBPAGE'}
                readOnly={!edit}
                onValueChange={value => {
                  setLocalValue(value)
                }}
                // boardId={pinBoardBuysell.boardId.toString()}
                // pollId={pinBoardBuysell.pollId?.toString()}
              />
              {/* <CardBodyItem card={card} self={self} mirrors={mirrors} handleSymbol={handleSymbol} /> */}
            </>
          ) : // ) : (
          // )
          null
          // <ul className={classes.bulletUl}>
          //   {mirrors?.map((e, i) => (
          //     <>
          //       {/* {card.type === 'WEBPAGE' && ( */}
          //       <>
          //         {e.children && e.children.length !== 0 && (
          //           <span className={classes.tickerTitle}>
          //             {e.head === card.symbol ? 'Self' : markToText(e.head, handleSymbol)}
          //           </span>
          //         )}
          //         {e.children &&
          //           e.children.map((el, i) => (
          //             <BulletItem
          //               key={i}
          //               node={el}
          //               depth={0}
          //               type={card.type}
          //               handleSymbol={handleSymbol}
          //               cardId={card.id}
          //             />
          //           ))}
          //       </>
          //       {/* )} */}
          //       {/* {card.type === 'TICKER' && <BulletItem key={i} node={e} />} */}
          //     </>
          //   ))}
          // </ul>
        }
      </div>
      {/* <button
      // onClick={() => {}}
      >
      Submit
    </button> */}
      {/* {pinBoard && (
        <BoardPage
          boardId={pinBoard.boardId.toString()}
          pollId={pinBoard.pollId?.toString()}
          visible={showBoard}
          hideBoard={hideBoard}
        />
      )} */}
      {/* {/* <BoardPage boardId={}/> */}
    </div>
  )
}

export const SymbolContext = createContext({ symbol: '' })

const TestPage = ({
  pathSymbol,
  webPageUrl,
  handlePathPush,
}: {
  pathSymbol?: string
  webPageUrl?: string
  handlePathPush: (e: string) => void
}): JSX.Element => {
  const { user, error: userError, isLoading } = useUser()
  const { data: meData, loading: meLoading } = useMeQuery()
  const router = useRouter()
  const [symbol, setSymbol] = useState<string>('$GOOG')
  // const [path, setPath] = useState<string[]>(['$GOOG'])
  // const [showBoardPage, setShowBoardPage] = useState(false)
  // const[url,setUrl]=useState('')
  // useEffect(()=>{
  //   const tabUrl=getTabUrl()
  //   tabUrl&&setUrl(tabUrl)
  // },[])
  const { data, error, loading } = useCardQuery({
    variables: { symbol: pathSymbol ?? '' },
  })
  const { data: webpageData } = useWebpageCardQuery({ variables: { url: webPageUrl ?? '' } })

  // const { root, mirror, path, openedLi, value, setLocalValue } = useLocalValue()
  const [levels, setLevels] = useState<Level[]>()

  // useEffect(() => {
  //   if (root && path) {
  //     const levels = getLevels(root, path)
  //     levels.pop() // 最後一個是當前的 li ，不需要
  //     setLevels(levels)
  //   }
  // }, [root, path])

  const handleSymbol = (symbol: string) => {
    handlePathPush(symbol)
    router.push(`/card/${encodeURIComponent(symbol)}`)
    // setSymbol(symbol)
    // console.log(symbol)
  }

  if (user === undefined && !loading && meData === undefined && !meLoading) {
    return (
      <>
        <a href="/api/auth/login">Login</a>
        <span>以繼續瀏覽</span>
      </>
    )
  }

  if (loading || meLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* <SymbolContext.Provider value={{ symbol: pathSymbol ?? '' }}> */}
      {/* <button
        onClick={() => {
          setSymbol('')
          // handlePathPush('')
        }}
      >
        Clear
      </button> */}
      <button
        onClick={() => {
          router.push('/card/$AAPL')
          // setSymbol('$AAPL')
          handlePathPush('$AAPL')
          // setPath([...path, '$AAPL'])
        }}
      >
        $AAPL
      </button>
      <button
        onClick={() => {
          router.push('/card/$BA')
          // setSymbol('$BA')
          handlePathPush('$BA')
          // setPath([...path, '$BA'])
        }}
      >
        $BA
      </button>
      <button
        onClick={() => {
          router.push('/card/$ROCK')
          // setSymbol('$ROCK')
          handlePathPush('$ROCK')
          // setPath([...path, '$ROCK'])
        }}
      >
        $ROCK
      </button>
      <button
        onClick={() => {
          router.push(`/card/${encodeURIComponent('[[https://www.youtube.com/watch?v=F57gz9O0ABw]]')}`)
          // setSymbol('[[https://www.youtube.com/watch?v=F57gz9O0ABw]]')
          handlePathPush('[[https://www.youtube.com/watch?v=F57gz9O0ABw]]')
          // setPath([...path, '[[https://www.youtube.com/watch?v=F57gz9O0ABw]]'])
        }}
      >
        [[https://www.youtube.com/watch?v=F57gz9O0ABw]]
      </button>

      {/* {console.log(data?.card)} */}
      {data && data.card && <CardItem card={data.card} handleSymbol={handleSymbol} />}
      {webpageData && webpageData.webpageCard && (
        <>
          {console.log('getWebpage', webPageUrl)}
          <CardItem card={webpageData.webpageCard} handleSymbol={handleSymbol} />
        </>
      )}

      {!data?.card && !webpageData?.webpageCard && <BulletEditor />}
      {/* {value && (
        <BulletEditor
          initialValue={value}
          onValueChange={value => {
            setLocalValue(value)
          }}
        />
      )} */}
      {/* <BoardPage boardId={}/> */}
      {/* </SymbolContext.Provider> */}
    </div>
  )
}

export default TestPage
