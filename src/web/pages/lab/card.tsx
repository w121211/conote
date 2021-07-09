/* eslint-disable no-console */
import { ApolloClient, NormalizedCacheObject, useApolloClient } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import { BoardStatus, CardType } from '@prisma/client'
import { Token } from 'prismjs'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Descendant, Element } from 'slate'
import { useSlateStatic } from 'slate-react'
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
  useBoardQuery,
  useCardQuery,
  useCommentsQuery,
  useCreateCardBodyMutation,
  useCreateOauthorCommentMutation,
  useCreateSymbolCardMutation,
  useMeQuery,
  useSearchAllLazyQuery,
  useSearchAllQuery,
} from '../../apollo/query.graphql'
import { CardBodyInput, CardBulletRootInput } from '../../apollo/type-defs.graphqls'
import { QueryDataProvider } from '../../components/data-provider'
import { deserialize, serialize } from '../../lib/bullet-tree/serializer'
import { tokenize } from '../../lib/bullet-tree/tokenizer'
import { Bullet, BulletInput } from '../../lib/bullet-tree/types'
import { CardBodyContent, CardHeadContent, CardHeadContentValueInjected, NestedCardEntry } from '../../lib/models/card'
import { injectCardHeadValue } from '../../lib/models/card-helpers'
import { CardSymbol, parseSymbol } from '../../lib/models/symbol'
import { useCardLazyQuery } from '../../__generated__/apollo/query.graphql'
import BulletEditor from './bullet-editor'

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

// type NestedCardEntryWithParsedCard = NestedCardEntry & {
//   card?: CardWithParsedContent
// }

function parseCard(card: Card): CardParsed {
  const headContent: CardHeadContent = JSON.parse(card.head.content)
  const bodyContent: CardBodyContent = JSON.parse(card.body.content)
  const headValue = injectCardHeadValue({ bodyRoot: bodyContent.root, value: headContent.value })
  return {
    ...card,
    headContent,
    bodyContent,
    headValue,
  }
}

/**
 * 將原本的body bullet tree轉成顯示用的bullet tree
 */
async function buildBodyTree(props: {
  card: CardParsed
  // eslint-disable-next-line @typescript-eslint/ban-types
  client: ApolloClient<object>
}): Promise<Bullet | BulletInput> {
  const { card, client } = props

  if (card.type === CardType.WEBPAGE) {
    const tempRoot: BulletInput = {
      head: 'tempRoot',
      // temp: true,
      children: [card.bodyContent.root],
    }

    if (card.bodyContent.nestedCards) {
      const results = await Promise.all(
        card.bodyContent.nestedCards.map(e =>
          client.query<CardQuery, CardQueryVariables>({
            query: CardDocument,
            variables: { symbol: e.cardSymbol },
          }),
        ),
      )
      for (const { error, data } of results) {
        if (error) {
          console.error(error)
        }
        if (data && data.card) {
          const nestedCard = parseCard(data.card)
          const mirrorBullet: Bullet = {
            ...nestedCard.bodyContent.root,
            mirror: true,
          }
          tempRoot.children?.push(mirrorBullet)
        }
      }
    }

    return tempRoot
  } else {
    return card.bodyContent.root
  }
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

const bodyRootDemo: BulletInput = {
  head: 'root',
  children: [
    {
      head: '1 $ABC [[123]]',
      hashtags: [
        {
          userId: 'string',
          boardId: 123,
          boardStatus: BoardStatus.ACTIVE,
          text: '#string',
        },
      ],
      oauthorName: 'Hello',
    },
    { head: '2', body: '222 222' },
    {
      head: '3',
      children: [
        {
          head: '1',
          hashtags: [
            {
              userId: 'string',
              boardId: 123,
              boardStatus: BoardStatus.ACTIVE,
              text: '#string',
            },
          ],
          oauthorName: 'Hello',
        },
        { head: '2', body: '222 222' },
        { head: '3' },
      ],
    },
  ],
}

function hastaggable(node: Bullet | BulletInput): boolean {
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

const BulletItem = (props: { node: Bullet | BulletInput }) => {
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

/**
 * Show a card
 */
const CardItem = (props: { card: Card }) => {
  const { card } = props
  const parsedCard = parseCard(card)
  const pinBoard = parsedCard.headValue.pinBoards.find(e => e.pinCode === 'BUYSELL')

  const client = useApolloClient()
  // const [createCardBody] = useCreateCardBodyMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<CardQuery, CardQueryVariables>({
  //       query: CardDocument,
  //       variables: { symbol: card.symbol },
  //     })
  //     if (data?.createCardBody && res?.card) {
  //       cache.writeQuery<CardQuery, CardQueryVariables>({
  //         query: CardDocument,
  //         variables: { symbol: card.symbol },
  //         data: { card: { ...res.card, body: data.createCardBody } },
  //       })
  //     }
  //     // if (afterUpdate && data?.createCardBody) {
  //     //   afterUpdate(data.createCardBody)
  //     // }
  //   },
  // })

  const [showBoard, setShowBoard] = useState(false)
  const [edit, setEdit] = useState(false)
  const [bodyTree, setBodyTree] = useState<BulletInput>() // tree root不顯示
  // const [bodyChildren, setBodyChildren] = useState<BulletInput[]>(bodyRootDemo.children ?? [])
  const [bodyChildren, setBodyChildren] = useState<BulletInput[]>([])
  const [editorValue, setEditorValue] = useState<Descendant[]>([])

  useEffect(() => {
    async function build() {
      const tree = await buildBodyTree({ card: parsedCard, client })
      setBodyTree(tree)
      setBodyChildren(tree.children ?? [])
    }
    build()
  }, [card])

  useEffect(() => {
    setEditorValue(bodyChildren.map(e => deserialize(e)))
  }, [bodyChildren])

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
      {showBoard && pinBoard && (
        <BoardItem boardId={pinBoard.boardId.toString()} pollId={pinBoard.pollId?.toString()} />
      )}

      <h3>Body</h3>
      <button
        onClick={() => {
          setEdit(!edit)
        }}
      >
        Edit
      </button>
      {edit ? (
        <BulletEditor
          initialValue={editorValue}
          onClose={({ value }) => {
            // const input = serialize(value[0])
            // if (input === null) {
            //   throw new Error('Bullet input不能為null')
            // }
            // setBodyRoot(input)
            setBodyChildren(serialize(value))
            setEdit(false)
          }}
        />
      ) : (
        <ul>
          {bodyChildren.map((e, i) => (
            <BulletItem key={i} node={e} />
          ))}
        </ul>
      )}
      <button
      // onClick={() => {}}
      >
        Submit
      </button>
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

// --- Unused ---

/**
 * Create a new symbol card
 */
const SymbolCardForm = (props: { source?: Card }) => {
  const { source } = props
  const [createSymbolCard, { data, loading }] = useCreateSymbolCardMutation({
    // update(cache, { data }) {
    //   const res = cache.readQuery<CardQuery, CardQueryVariables>({
    //     query: CardDocument,
    //     variables: { symbol: card.symbol },
    //   })
    //   if (data?.createCardBody && res?.card) {
    //     cache.writeQuery<CardQuery, CardQueryVariables>({
    //       query: CardDocument,
    //       variables: { symbol: card.symbol },
    //       data: { card: { ...res.card, body: data.createCardBody } },
    //     })
    //   }
    // },
  })

  if (loading) {
    return <div>Get or creating card...</div>
  }
  if (data?.createSymbolCard) {
    return <div>Card created: {data?.createSymbolCard.symbol} </div>
  }
  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault()
          const data: Record<string, string> = {}
          for (const [k, v] of new FormData(event.currentTarget).entries()) {
            data[k] = v as string
          }
          createSymbolCard({
            variables: {
              data: {
                symbol: data['symbol'],
                templateProps: {
                  template: data['template'],
                  title: data['title'],
                  // ticker?: Maybe<Scalars['String']>;
                },
              },
            },
          })
        }}
      >
        <label>
          Symbol:
          <input type="text" id="symbol" name="symbol" defaultValue="$ROCK" />
        </label>
        <br />
        <label>
          Template:
          <select id="template" name="template">
            <option value="ticker">Ticker</option>
            <option value="topic">Topic</option>
          </select>
        </label>
        <br />
        <label>
          Title:
          <input type="text" id="title" name="title" defaultValue="Rock'n Roll" />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

/**
 * Search a symbol
 */
const SymbolSearchForm = () => {
  // const { source } = props
  const [term, setTerm] = useState('')
  const [searchAll, { loading, data }] = useSearchAllLazyQuery()
  if (loading) {
    return <div>Searching...</div>
  }
  if (data?.searchAll) {
    if (data.searchAll.length === 0) {
      return <div>{term} not found, create one</div>
    }
    return (
      <div>
        {data.searchAll.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </div>
    )
  }
  return (
    <div>
      <form
        onSubmit={event => {
          event.preventDefault()
          const data: Record<string, string> = {}
          for (const [k, v] of new FormData(event.currentTarget).entries()) {
            data[k] = v as string
          }
          searchAll({ variables: { term } })
        }}
      >
        <label>
          Search:
          <input type="text" id="term" name="term" defaultValue="$ROCK" />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

/**
 * Add a new nested card and create oauthor comment/vote all in one.
 * First search a symbol, if not exist, show card creation inputs.
 */
const NestedCardForm = () => {
  // const { source } = props
  // const [search, setSearch] = useState('')
  const [searchAll, searchAllResult] = useSearchAllLazyQuery()
  const [queryCard, cardResult] = useCardLazyQuery()
  const [term, setTerm] = useState('')
  // const [searched, setSearched] = useState(false)
  const [symbol, setSymbol] = useState<CardSymbol | null>(null)
  // const [card, setCard] = useState<Card | null>(null)

  // const a = parseSymbol()

  useEffect(() => {
    if (symbol !== null) {
      queryCard({ variables: { symbol: symbol.symbolName } })
    }
  }, [symbol])

  return (
    <div>
      {symbol === null && (
        <form
          onSubmit={event => {
            event.preventDefault()
            const data: Record<string, string> = {}
            for (const [k, v] of new FormData(event.currentTarget).entries()) {
              data[k] = v as string
            }
            searchAll({ variables: { term: data['term'] } })
            setTerm(data['term'])
          }}
        >
          <label>
            Search:
            <input type="text" id="term" name="term" defaultValue="$ROCK" />
          </label>
          <br />
          <input type="submit" value="Search" />
        </form>
      )}

      {searchAllResult.data?.searchAll &&
        searchAllResult.data.searchAll.map((e, i) => (
          <button
            key={i}
            onClick={() => {
              setSymbol(parseSymbol(e))
            }}
          >
            {e}
          </button>
        ))}

      <h3>{symbol?.symbolName ?? term}</h3>

      <form
        onSubmit={event => {
          event.preventDefault()
          const data: Record<string, string> = {}
          for (const [k, v] of new FormData(event.currentTarget).entries()) {
            data[k] = v as string
          }
          searchAll({ variables: { term } })
        }}
      >
        {/* <label>
          Search:
          <input type="text" id="term" name="term" defaultValue="$ROCK" />
        </label> */}
        <br />
        <label>
          @Oauthor vote:
          <select id="vote" name="vote">
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
            <option value="WATCH">WATCH</option>
            <option value="NULL">null</option>
          </select>
        </label>
        <br />
        <label>
          @Oauthor comment:
          <input type="text" id="term" name="term" defaultValue="$ROCK" />
        </label>

        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

const CardBodyItem = (props: { card: CardParsed; onChange?: (props: { input: BulletInput }) => void }) => {
  const { card, onChange } = props
  const [edit, setEdit] = useState(false)
  const [input, setInput] = useState<BulletInput>(card.bodyContent.root)

  // const initialValue = [deserialize(card.bodyContent.root)]
  const initialValue = [deserialize(input)]
  // return useMemo(() => {
  //   console.log('editor memo')
  //   return (
  //     <>
  // <button
  //   onClick={() => {
  //     console.log(value)
  //   }}
  // >
  //   Submit
  // </button>
  // <BulletEditor
  //   initialValue={initialValue}
  //   onChange={({ value }) => {
  //     setValue(value)
  //   }}
  // />
  //     </>
  //   )
  // }, [])
  return (
    <div>
      <button
        onClick={() => {
          setEdit(!edit)
        }}
      >
        edit
      </button>
      {/* {edit ? (
        <BulletEditor
          initialValue={initialValue}
          onClose={({ root }) => {
            const input = serialize(root)
            if (input === null) {
              throw new Error('Bullet input不能為null')
            }
            if (onChange) {
              onChange({ input })
            }
            setInput(input)
            setEdit(false)
          }}
        />
      ) : (
        <ul>
          {input?.children?.map((e, i) => (
            <BulletItem key={i} node={e} />
          ))}
        </ul>
      )} */}
    </div>
  )
}
