/* eslint-disable no-console */
import React, { FormEvent, useCallback, useEffect, useMemo, useState, createContext } from 'react'
import Link from 'next/link'
import { ApolloClient, ApolloError, useApolloClient } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import { Token } from 'prismjs'
import { CardType } from '@prisma/client'
import RightArrow from '../../assets/svg/right-arrow.svg'
import { editorValue } from '../../apollo/cache'
import {
  Board,
  BoardQuery,
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
  useCardQuery,
  useCommentsQuery,
  useCreateCardBodyMutation,
  useCreateOauthorCommentMutation,
  useMeQuery,
} from '../../apollo/query.graphql'
import classes from '../../components/card.module.scss'
import BoardPage from '../../components/board/board-page'
import CreateBoardPage from '../../components/board/create-board-page'
import Popover from '../../components/popover/popover'
import { BulletEditor } from '../../components/editor/editor'
import { Serializer } from '../../components/editor/serializer'
import { LiElement } from '../../components/editor/slate-custom-types'
import { tokenize } from '../../lib/bullet/tokenizer'
import { Bullet, BulletDraft, RootBullet, RootBulletDraft } from '../../lib/bullet/types'
import { CardBodyContent, CardHeadContent, CardHeadContentValueInjected, PinBoard } from '../../lib/models/card'
import { injectCardHeadValue } from '../../lib/models/card-helpers'

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
function parseCard(card: Card): CardParsed {
  const headContent: CardHeadContent = JSON.parse(card.head.content)
  const bodyContent: CardBodyContent = JSON.parse(card.body.content)
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
 * 用client.query(...)方式query card，而非使用useQuery(...)，適用在非component但需要取得card的情況，例如取得mirrors
 *
 * @returns 當有card時返回card body bullet root; 找不到card時root為undefined，error為undefined; error時只返回error
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

const TokenItem = (props: { token: Token | string; handleSymbol?: (symbol: string) => void }) => {
  const { token, handleSymbol } = props
  // console.log(token)
  if (typeof token === 'string') {
    return <span className={classes.text}>{token}</span>
  }
  if (typeof token.content === 'string') {
    switch (token.type) {
      case 'ticker':
      case 'topic':
      case 'vote-chocie':
        return (
          <span
            className={classes.link}
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
        )
      // case 'mark':
      //   return <span className={classes.marker}>{token.content}</span>
      default:
        return <span>{token.content}</span>
    }
  }
  return null
}

const markToText = (e: string, handleSymbol?: (symbol: string) => void) => {
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
            <TokenItem token={el} key={i} handleSymbol={handleSymbol} />
          ))}
        </>
      )
  }
}

const BulletItem = (props: {
  node: Bullet | BulletDraft
  handleShowBoard?: (boardId: number | undefined) => void
  depth: number
  type: string
  handleSymbol: (symbol: string) => void
  cardId: string
}) => {
  // const [filtered, setFiltered] = useState()
  const { depth, node, handleSymbol, cardId } = props
  const [showBoard, setShowBoard] = useState(false)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [showChildren, setShowChildren] = useState(depth < 1 ? true : false)
  // const { node } = props
  const headTokens = tokenize(node.head)
  const bodyTokens = node.body ? tokenize(node.body) : undefined
  console.log(node.hashtags)
  const hideBoard = () => {
    setShowBoard(false)
  }
  const hideCreateBoard = () => {
    setShowCreateBoard(false)
  }

  const nextDepth = depth + 1
  return (
    <>
      {props.type === 'WEBPAGE' &&
      depth === 0 &&
      (!node.children || (node.children && node.children.length === 0)) ? null : (
        <li className={classes.inlineValue}>
          <span className={classes.bulletWrapper}>
            <span
              className={classes.bullet}
              onClick={() => {
                setShowChildren(prev => !prev)
              }}
            >
              <svg viewBox="0 0 18 18" className={`${classes.bulletSvg} ${node.children && classes.bulletSvgBg}`}>
                <circle cx="9" cy="9" r="4" />
              </svg>
              {/* • */}
            </span>
          </span>

          <span>
            {markToText(node.head, handleSymbol)}
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
                    setShowBoard(true)
                  }}
                >
                  {e.text}
                  {e.boardId && (
                    <Popover visible={showBoard} hideBoard={hideBoard} subTitle={markToText(node.head)}>
                      <BoardPage
                        title={e.text}
                        boardId={e.boardId.toString()}
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

            {node.oauthorName && <span className={classes.oauthorName}>@{node.oauthorName.split(':', 1)}</span>}

            {hastaggable(node) && (
              <>
                <span
                  className={classes.link}
                  onClick={() => {
                    setShowCreateBoard(true)
                  }}
                >
                  (#)
                  {/* {console.log(headTokens, bodyTokens)} */}
                </span>
                {showCreateBoard && node.id && (
                  <CreateBoardPage
                    subTitle={markToText(node.head)}
                    bulletId={node.id.toString()}
                    cardId={cardId}
                    visible={showCreateBoard}
                    hideBoard={hideCreateBoard}
                  />
                )}
              </>
            )}

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

const CardBodyItem = (props: { card: Card; self: BulletDraft; mirrors?: BulletDraft[] }) => {
  const { card, self, mirrors } = props

  if (card.type === 'WEBPAGE') {
    // 可能有mirrors
    return (
      <div>
        <ul>
          <BulletItem
            node={self}
            handleSymbol={_ => {
              _
            }}
            depth={0}
            type={card.type}
            cardId={card.id}
          />
        </ul>
        {mirrors &&
          mirrors.map((e, i) => (
            <ul key={i}>
              <BulletItem
                node={e}
                handleSymbol={_ => {
                  _
                }}
                depth={0}
                type={card.type}
                cardId={card.id}
              />
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
          <BulletItem
            key={i}
            node={e}
            handleSymbol={_ => {
              _
            }}
            depth={0}
            type={card.type}
            cardId={card.id}
          />
        ))}
      </ul>
    </div>
  )
}

/**
 * Show a card 1. 有mirrors (ie webpage card) 2. 沒有mirrors
 */

const CardItem = (props: { card: Card; handleSymbol: (symbol: string) => void }) => {
  const { card, handleSymbol } = props
  // const parsedCard = parseCard(card)
  // const pinBoard = parsedCard.headValue.pinBoards.find(e => e.pinCode === 'BUYSELL')

  const client = useApolloClient()
  const [showBoard, setShowBoard] = useState(false)

  const [self, setSelf] = useState<RootBullet | RootBulletDraft>()
  const [mirrors, setMirrors] = useState<RootBullet[] | RootBulletDraft[] | undefined>()

  const [pinBoardBuysell, setPinBoardBuysell] = useState<PinBoard | undefined>()
  const [edit, setEdit] = useState(false)
  const [bodyTree, setBodyTree] = useState<BulletDraft>() // tree root不顯示
  // const [bodyChildren, setBodyChildren] = useState<BulletDraft[]>(bodyRootDemo.children ?? [])
  const [bodyChildren, setBodyChildren] = useState<BulletDraft[]>([])
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

  useEffect(() => {
    async function _parseAndBuildCard() {
      const parsed = parseCard(card)

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

      console.log(lis)

      setEditorInitialValue(lis)
      setEdit(false) // 需要重設來trigger editor rerender
    }

    _parseAndBuildCard()
  }, [card])

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
    console.log(self)
    console.log(mirrors)
    const data: CardBodyInput = card.type === 'WEBPAGE' ? { self, mirrors } : { self }
    try {
      await createCardBody({
        variables: { cardId: card.id, data },
      })
    } catch (err) {
      console.log(err)
    }
  }, [self, mirrors])

  return (
    <div>
      {/* <h3>Head</h3> */}
      <span className={classes.title}>{self?.head}</span>
      {/* {console.log(pinBoard)} */}
      {pinBoardBuysell && pinBoardBuysell.pinCode === 'BUYSELL' && (
        <span
          className={classes.tags}
          onClick={() => {
            setShowBoard(!showBoard)
          }}
        >
          看多/看空/觀望
        </span>
      )}
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
        <Popover
          visible={showBoard}
          subTitle={
            <span
              className={classes.tags}
              // onClick={() => {
              //   setShowBoard(!showBoard)
              // }}
            >
              {self?.head}
            </span>
          }
          hideBoard={hideBoard}
        >
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
      <button
        onClick={() => {
          if (edit) onCloseEditor()
          else setEdit(true)
        }}
      >
        Edit
      </button>

      {!edit && editorInitialValue && (
        <button
          onClick={event => {
            event.preventDefault()
            onSubmit()
          }}
        >
          Submit
        </button>
      )}

      {error && <div>Submit fail...</div>}

      {self ? (
        edit ? (
          <BulletEditor
            initialValue={editorInitialValue}
            oauthorName={card.link?.oauthorName ?? undefined}
            sourceUrl={card.link?.url}
            withMirror={card.type === 'WEBPAGE'}
          />
        ) : (
          <CardBodyItem card={card} self={self} mirrors={mirrors} />
        )
      ) : (
        <ul className={classes.bulletUl}>
          {bodyChildren.map((e, i) => (
            <>
              {/* {card.type === 'WEBPAGE' && ( */}
              <>
                {e.children && e.children.length !== 0 && (
                  <span className={classes.tickerTitle}>
                    {e.head === card.symbol ? 'Self' : markToText(e.head, handleSymbol)}
                  </span>
                )}
                {e.children &&
                  e.children.map((el, i) => (
                    <BulletItem
                      key={i}
                      node={el}
                      depth={0}
                      type={card.type}
                      handleSymbol={handleSymbol}
                      cardId={card.id}
                    />
                  ))}
              </>
              {/* )} */}
              {/* {card.type === 'TICKER' && <BulletItem key={i} node={e} />} */}
            </>
          ))}
        </ul>
      )}
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
  handlePathPush,
}: {
  pathSymbol: string
  handlePathPush: (e: string) => void
}): JSX.Element => {
  const { user, error: userError, isLoading } = useUser()
  const { data: meData, loading: meLoading } = useMeQuery()
  const [symbol, setSymbol] = useState<string>('$GOOG')
  // const [path, setPath] = useState<string[]>(['$GOOG'])
  // const [showBoardPage, setShowBoardPage] = useState(false)
  // const[url,setUrl]=useState('')
  // useEffect(()=>{
  //   const tabUrl=getTabUrl()

  //   tabUrl&&setUrl(tabUrl)
  // },[])
  const { data, error, loading } = useCardQuery({
    variables: { symbol: pathSymbol },
  })

  const handleSymbol = (symbol: string) => {
    handlePathPush(symbol)
    setSymbol(symbol)
  }
  return (
    // <div>
    <SymbolContext.Provider value={{ symbol: pathSymbol }}>
      <div>{(user === undefined || meData === undefined) && <a href="/api/auth/login">Login</a>}</div>
      <button
        onClick={() => {
          setSymbol('')
          handlePathPush('')
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setSymbol('$AAPL')
          handlePathPush('$AAPL')
          // setPath([...path, '$AAPL'])
        }}
      >
        $AAPL
      </button>
      <button
        onClick={() => {
          setSymbol('$BA')
          handlePathPush('$BA')
          // setPath([...path, '$BA'])
        }}
      >
        $BA
      </button>
      <button
        onClick={() => {
          setSymbol('$ROCK')
          handlePathPush('$ROCK')
          // setPath([...path, '$ROCK'])
        }}
      >
        $ROCK
      </button>
      <button
        onClick={() => {
          setSymbol('[[https://www.youtube.com/watch?v=F57gz9O0ABw]]')
          handlePathPush('[[https://www.youtube.com/watch?v=F57gz9O0ABw]]')
          // setPath([...path, '[[https://www.youtube.com/watch?v=F57gz9O0ABw]]'])
        }}
      >
        [[https://www.youtube.com/watch?v=F57gz9O0ABw]]
      </button>

      {data && data.card && <CardItem card={data.card} handleSymbol={handleSymbol} />}
      {/* <BoardPage boardId={}/> */}
    </SymbolContext.Provider>
    // {/* </div> */}
  )
}

export default TestPage
