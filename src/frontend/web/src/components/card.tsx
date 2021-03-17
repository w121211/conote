import React, { ReactElement, useState, useEffect } from 'react'
import { useQuery, useMutation, useLazyQuery, useApolloClient } from '@apollo/client'
import { Link, navigate, redirectTo } from '@reach/router'
import { AutoComplete, Button, Modal, Popover, Tag, Tooltip, Radio, Form, Input } from 'antd'
import { TextEditor, Section, ExtTokenStream, streamToStr, MarkToConnectedContentRecord } from '@conote/editor'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { AnchorPanel } from './tile-panel'
import { QueryCommentModal } from './tile'
import { toUrlParams } from '../helper'
import { PollChoices } from './poll-choice'

// Define in 'server/models/card.ts'
interface CardMeta {
  symbol?: string
  conn: MarkToConnectedContentRecord
}

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
          <QueryCommentModal cardId={stream.markerline.commentId.toString()}>
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

  const meta: CardMeta | undefined = card.meta ? (JSON.parse(card.meta) as CardMeta) : undefined
  const editor = new TextEditor(card.body.text, card.link.url, card.link.oauthorName ?? undefined)
  // console.log(meta?.conn)
  editor.addConnectedContents(meta?.conn ?? {})
  editor.flush({ embedMarkerlinesToTokens: true })

  return <RenderCardBody sects={editor.getSections()} />
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

// --------- Form ---------

function CardInput() {
  /**
   * 理想（類code-editor）：
   * 1. 自動在前方增加hash（無法消除）
   * 2. 打"[[______]]", "$___"會開啟搜尋視窗
   * 3. (NEXT)換行後會automark前一行
   * 範例：
   * -------------------
   * | # OOOOOOO[[OO]]OOO
   * | # ...
   * ____________________
   * TODO:
   * - autocomplete: 搜尋ticker
   * - (改在別的地方處理)允許update、delete comment
   * - poll?
   */
  // const [options, setOptions] = useState<{ value: string }[]>([]);
  // const [error, setError] = useState<string | null>(null)
  // const [notes, setNotes] = useState<string[]>([])
  // const [searchAll, { loading, data }] = useLazyQuery<QT.searchAll, QT.searchAllVariables>(queries.SEARCH_ALL)
  // const [automark, { loading, data }] = useLazyQuery<QT.automark, QT.automarkVariables>(queries.AUTOMARK)

  // const initialValue = {
  //   text: initInputText({ comments })
  // }
  // function onSearch(term: string) {
  //   console.log(`search term: ${term}`)
  //   if (term.endsWith("#")) {
  //     setOptions([{ value: "..." }])
  //     searchAll({ variables: { term } })
  //   } else {
  //     setOptions([])
  //   }
  //   // if (term.length === 0)
  //   //   setOptions([])
  //   // else {
  //   //   searchAll({ variables: { term } })
  //   //   if (data && data.searchAll)
  //   //     setOptions(data.searchAll.map((e) => ({ value: e })))
  //   // }
  // }
  // function onSelect(data: string) {
  //   console.log('onSelect', data)
  //   // redirect('/topic/some_where')
  // }
  // function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {}
  // function onChange({ target: { value } }: { target: { value: string } }) {
  //   setValue(value)
  // }
  // function onKeyDown(e: React.KeyboardEvent) {
  //   console.log(e.key)
  //   // if (e.key === "Enter") {
  //     // if (value === "") {
  //       // setError("note不得空白")
  //       // return
  //     // }
  //     // setNotes([...notes, value])
  //     // setValue("")
  //   // }
  // }
  // if (!loading && data && data.searchAll) {
  //   // setOptions([])
  //   console.log(data.searchAll)
  //   setOptions(data.searchAll.map((e) => ({ value: e })))
  // }
  // if (data?.automark) {
  //   setNotes([...notes, value])
  // }
  return (
    <>
      {/* {isHash ? <span>[Note mode]</span> : null} */}
      {/* {notes.map((e, i) => <p key={i}># {e}</p>)} */}
      {/* <AutoComplete style={{ width: 200 }} value={value} onSelect={onSelect} onChange={onChange} onSearch={onSearch} onKeyDown={onKeyDown}>
        {data && data.searchAll.map((e, i) => <AutoComplete.Option key={i} value={e}>{e}</AutoComplete.Option>)}
        <Input value={value} onChange={onChange} onPressEnter={onPressEnter} />
      </AutoComplete> */}
      {/* {!!error && <p>{error}</p>} */}
      {/* <Input.TextArea rows={4} onChange={onChange} value={value} autoSize={true} /> */}
      <Form.Item name="card">
        <Input.TextArea rows={4} autoSize />
      </Form.Item>
    </>
  )
}

export function CardForm({ card, onFinishFn }: { card: QT.cocardFragment; onFinishFn?: () => void }): JSX.Element {
  /**
   * TODO:
   * - 目前無法即時檢查輸入的ticker, topic是否存在
   * - submit時，若有不合格的input應該要提出warning & 無法submit
   * - input中有symbol時，提供symbol連結，但目前不會同時檢驗該symbol是否存在....（感覺要先檢驗比較好？）
   * - cache(目前只要一離開card就需要重來)
   * - `<QueryOcard />`無法解決初始render時會互相卡住的問題，最好替換回最為直接的query.refetch
   */
  // const [queryOcard, { refetch }] = useLazyQuery<QT.ocard, QT.ocardVariables>(queries.OCARD)
  const [createCardBody] = useMutation<QT.createCardBody, QT.createCardBodyVariables>(queries.CREATE_CARD_BODY, {
    update(cache, { data }) {
      const q = cache.readQuery<QT.cocard, QT.cocardVariables>({
        query: queries.COCARD,
        variables: { url: card.link.url },
      })
      if (data?.createCardBody && q?.cocard) {
        cache.writeQuery<QT.cocard, QT.cocardVariables>({
          query: queries.COCARD,
          variables: { url: card.link.url },
          data: { cocard: { ...q.cocard, body: data.createCardBody } },
        })
      }
      // if (card.__typename === 'Selfcard') {
      //   const q = cache.readQuery<QT.mycard, QT.mycardVariables>({
      //     query: queries.MYCARD,
      //     variables: { symbolName: card.symbol.name },
      //   })
      //   if (data?.createWebpageCardBody && q?.mycard) {
      //     cache.writeQuery<QT.mycard, QT.mycardVariables>({
      //       query: queries.MYCARD,
      //       variables: { symbolName: card.symbol.name },
      //       data: { mycard: { ...q.mycard, body: data?.createWebpageCardBody } },
      //     })
      //   }
      // }
    },
  })
  const editor = new TextEditor(card.body?.text, card.link.url, card.link.oauthorName ?? undefined)
  const [sects, setSects] = useState<Section[]>(editor.getSections())
  // const [symbols, setSymbols] = useState<string[]>([])
  // const symbolTokens = symbols.reduce<Array<string | PrismToken>>((acc, cur) => acc.concat(MK.tokenizeSymbol(cur)), [])

  function onValuesChange(changedValues: { input: string }) {
    if (changedValues['input']) {
      const editor = new TextEditor(undefined, card.link.url, card.link.oauthorName ?? undefined)
      editor.setBody(changedValues['input'])
      editor.flush()
      setSects(editor.getSections())
      // setSymbols([])
    }
  }

  async function onFinish(values: { input: string }) {
    const res = await createCardBody({
      variables: { cardId: card.id, data: { text: values['input'] } },
    })
    if (onFinishFn !== undefined) {
      onFinishFn()
    }
  }

  if (card.body === null) return <p>[Error]: null body</p>

  return (
    <div>
      {/* {symbolTokens.map((e, i) => <RenderToken key={i} token={e} />)} */}
      <Form onFinish={onFinish} initialValues={{ input: editor.getBody() }} onValuesChange={onValuesChange}>
        <Form.Item name="input">
          <Input.TextArea rows={10} autoSize />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            儲存
          </Button>
        </Form.Item>
      </Form>
      <RenderCardBody sects={sects} />
    </div>
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

function makeCardId(comment: QT.commentFragment): string {
  let id: string
  if (comment.cocardId) id = 'Cocard:' + comment.ocardId
  else if (comment.ocardId) id = 'Ocard:' + comment.ocardId
  else if (comment.selfcardId) id = 'Ocard:' + comment.ocardId
  else throw new Error()
  return id
}

function getVoteIdx(str: string): number | undefined {
  /** []buy [X]sell []watch  -> return 1 */
  const re = /\[.?\]/gm
  let m
  const matches = []
  while ((m = re.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === re.lastIndex) re.lastIndex++
    // 選擇的選項標為1，其餘為0
    matches.push(m[0].length > 2 ? 1 : 0)
  }
  return matches.indexOf(1)
}

function mapVoters(voteComments: QT.commentFragment[], nChoices: number): string[][] {
  const voters: string[][] = []
  for (let i = 0; i < nChoices; i++) {
    const _voteChoiceN: string[] = []
    for (const e of voteComments) {
      if (e.text && getVoteIdx(e.text) === i) {
        _voteChoiceN.push(makeCardId(e))
      }
    }
    voters.push(_voteChoiceN)
  }
  return voters
}

function filterCommentsByVote(
  voteIdx: number,
  voters: string[][],
  comments: QT.commentFragment[],
): QT.commentFragment[] {
  // const voters = ["Ocard:1", "Selfcard:1"]
  const votersByVote = voters[voteIdx]
  return comments.filter(e => votersByVote.indexOf(makeCardId(e)) >= 0)
}

function ShowCardClicker({
  selfcardId,
  ocardId,
  children,
}: {
  selfcardId?: string
  ocardId?: string
  children: React.ReactNode
}) {
  if (!selfcardId && !ocardId) throw new Error('selfcardId及ocardId至少需要一個')
  return <span>{children}</span>
}

function QueryCardModal({ card, mycard }: { card: QT.cocard_cocard; mycard?: QT.selfcard_selfcard }) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [cardId, setCardId] = useState<[string, number] | null>(null)
  function onClick(comment: QT.commentFragment): void {
    // console.log('onClick')
    if (comment.ocardId) setCardId(['Ocard', comment.ocardId])
    else if (comment.selfcardId) setCardId(['Selfcard', comment.selfcardId])
    else return
    setIsModalVisible(true)
  }
  /** (NEXT)將mycard的comments放入裡面，便利push到cocard */
  // const battles = oneCommentByKey({ comments: card.comments, key: "battles" })
  return (
    <>
      <Modal
        visible={isModalVisible}
        onCancel={function () {
          setIsModalVisible(false)
        }}
      >
        {/* {cardId && cardId[0] === 'Ocard' && <QueryOcard id={cardId[1].toString()} />} */}
        {/* {cardId && cardId[0] === 'Selfcard' && <QuerySelfcard id={cardId[1].toString()} />} */}
      </Modal>
    </>
  )
}

function QueryOcard({
  oauthorName,
  symbolName,
  updateNestedOcards,
}: {
  oauthorName: string
  symbolName?: string
  updateNestedOcards(symbol: string, card?: QT.ocard_ocard, error?: string): void
}) {
  /** 僅用於call api，不render（需要這樣寫是因為目前apollo似乎沒有提供直接query data的方法，都得搭配hook） */
  console.log('called QueryOcard()', symbolName)
  const { error, data } = useQuery<QT.ocard, QT.ocardVariables>(queries.OCARD, {
    variables: { oauthorName, symbolName },
  })
  if (symbolName === undefined) return null
  if (error) updateNestedOcards(symbolName, undefined, error.toString())
  else if (data?.ocard) updateNestedOcards(symbolName, data?.ocard)
  return null
}

// function NestedTickerOcard({ symbolName, oauthorName, src }: { symbolName: string; oauthorName: string; src: string }) {
//   const { data, error, loading } = useQuery<QT.ocard, QT.ocardVariables>(queries.OCARD, {
//     variables: { symbolName, oauthorName },
//   })
//   if (loading) return <span>~ Loading... ~</span>
//   if (data?.ocard) return <CardBody card={data.ocard} rootFormat={MK.TICKER_FORMATTER} bySrc={src} />
//   return <span>Error!</span>
// }
