/* eslint-disable no-console */
import { ApolloClient, ApolloError, useApolloClient } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import { BoardStatus, CardType } from '@prisma/client'
import { Token } from 'prismjs'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { editorValue } from '../../apollo/cache'
import {
  Board,
  BoardQuery,
  Card,
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
import { CardBodyInput } from '../../apollo/type-defs.graphqls'
import { BulletEditor } from '../../components/editor/editor'
import { Serializer } from '../../components/editor/serializer'
import { LiElement } from '../../components/editor/slate-custom-types'
import { Node as BulletNode } from '../../lib/bullet/node'
import { tokenize } from '../../lib/bullet/tokenizer'
import { Bullet, BulletDraft, RootBullet, RootBulletDraft } from '../../lib/bullet/types'
import { CardBodyContent, CardHeadContent, CardHeadContentValueInjected, PinBoard } from '../../lib/models/card'
import { injectCardHeadValue } from '../../lib/models/card-helpers'

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

const BoardItem = (props: { boardId: string; pollId?: string }) => {
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

const TokenItem = (props: { token: Token | string }) => {
  const { token } = props
  if (typeof token === 'string') {
    return <span>{token}</span>
  }
  if (typeof token.content === 'string') {
    switch (token.type) {
      case 'ticker':
      case 'topic':
      case 'vote-chocie':
        return <a href={`/card/${token.content}`}>{token.content}</a>
      default:
        return <span>{token.content}</span>
    }
  }
  return null
}

const BulletItem = (props: { node: Bullet | BulletDraft }) => {
  // const [filtered, setFiltered] = useState()
  const { node } = props
  const headTokens = tokenize(node.head)
  const bodyTokens = node.body ? tokenize(node.body) : undefined
  return (
    <li>
      {headTokens.map((e, i) => (
        <TokenItem key={i} token={e} />
      ))}
      {node.hashtags &&
        node.hashtags.map((e, i) => (
          <a key={i} href={`/board/${e.boardId}`}>
            {e.text}
          </a>
        ))}

      {node.oauthorName && <span>@{node.oauthorName}</span>}

      {hastaggable(node) && <a href="/add_a_hashtag">(#)</a>}

      {bodyTokens && (
        <>
          <br />
          {bodyTokens.map((e, i) => (
            <TokenItem key={i} token={e} />
          ))}
        </>
      )}

      <ul>{node.children && node.children.map((e, i) => <BulletItem key={i} node={e} />)}</ul>
    </li>
  )
}

const CardBodyItem = (props: { card: Card; self: BulletDraft; mirrors?: BulletDraft[] }) => {
  const { card, self, mirrors } = props

  if (card.type === 'WEBPAGE') {
    // 可能有mirrors
    return (
      <div>
        <ul>
          <BulletItem node={self} />
        </ul>
        {mirrors &&
          mirrors.map((e, i) => (
            <ul key={i}>
              <BulletItem node={e} />
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
          <BulletItem key={i} node={e} />
        ))}
      </ul>
    </div>
  )
}

/**
 * Show a card 1. 有mirrors (ie webpage card) 2. 沒有mirrors
 */
const CardItem = (props: { card: Card }) => {
  const { card } = props
  const client = useApolloClient()
  const [showBoard, setShowBoard] = useState(false)

  const [self, setSelf] = useState<RootBullet | RootBulletDraft>()
  const [mirrors, setMirrors] = useState<RootBullet[] | RootBulletDraft[] | undefined>()

  const [pinBoardBuysell, setPinBoardBuysell] = useState<PinBoard | undefined>()
  const [edit, setEdit] = useState(false)
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
      <h3>Head</h3>
      {card.symbol}

      <h3>Board</h3>
      <button
        onClick={() => {
          setShowBoard(!showBoard)
        }}
      >
        Board
      </button>
      {showBoard && pinBoardBuysell && (
        <BoardItem boardId={pinBoardBuysell.boardId.toString()} pollId={pinBoardBuysell.pollId?.toString()} />
      )}

      <h3>Body</h3>

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
        <div>Loading</div>
      )}
    </div>
  )
}

const TestPage = (): JSX.Element => {
  const { user, error: userError, isLoading } = useUser()
  const { data: meData, loading: meLoading } = useMeQuery()
  const [symbol, setSymbol] = useState<string>('$GOOG')
  const { data, error, loading } = useCardQuery({
    variables: { symbol },
  })
  if (userError || error) {
    return <h1>Something goes wrong</h1>
  }
  if (meLoading || isLoading || loading) {
    return <h1>Loading</h1>
  }
  return (
    <div>
      <div>{(user === undefined || meData === undefined) && <a href="/api/auth/login">Login</a>}</div>
      <button
        onClick={() => {
          setSymbol('')
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setSymbol('$AAPL')
        }}
      >
        $AAPL
      </button>
      <button
        onClick={() => {
          setSymbol('$BA')
        }}
      >
        $BA
      </button>
      <button
        onClick={() => {
          setSymbol('$ROCK')
        }}
      >
        $ROCK
      </button>
      <button
        onClick={() => {
          setSymbol('[[https://www.youtube.com/watch?v=F57gz9O0ABw]]')
        }}
      >
        [[https://www.youtube.com/watch?v=F57gz9O0ABw]]
      </button>
      {data && data.card && <CardItem card={data.card} />}
    </div>
  )
}

export default TestPage
