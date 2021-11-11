import { ParsedUrlQuery } from 'querystring'

import { useRouter } from 'next/router'
import Link from 'next/link'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  BehaviorSubject,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  scan,
  share,
  Subject,
  withLatestFrom,
} from 'rxjs'
import { useObservable } from 'rxjs-hooks'
import localforage from 'localforage'
import { nanoid } from 'nanoid'

export type DataNode<T> = {
  id: string
  parentId?: string
  index?: number
  // prevId: string | null
  data?: T
  change?: 'move'
}

export type NestedNode<T> = DataNode<T> & {
  children: NestedNode<T>[]
}

export type Bullet = {
  id: string
  head: string
}

export type Change<T> = {
  type:
    | 'insert'
    | 'update'
    | 'move'
    | 'move-update'
    | 'delete'
    | 'change-parent'
    | 'change-parent-update'
  id: string
  // arrayId: string | null // for multiple array case, eg tree
  toParentId: string // refers to final state id
  toIndex: number | null // for insert only, others set to null
  data?: T
}

type NodePath = number[]

const NodeHelper = {
  getPartial<T>(root: NestedNode<T>, path: NodePath): NestedNode<T> {
    throw ''
  },

  setPartial<T>(
    root: NestedNode<T>,
    path: NodePath,
    children: NestedNode<Bullet>[]
  ): void {
    throw ''
  },
}

type NestedNodeValueParams<T> = {
  children: NestedNode<T>[]
}

type FakeCard = {
  id: string
  symbol: string
  link?: string
}

type FakeCardDoc = {
  id: string
  value: NestedNode<Bullet>[]
}

type CardInput = {
  symbol: string
  // # templateProps: CardTemplatePropsInput
  meta: Record<string, string>
}

type DocInput = {
  symbol: string // use as cid
  // cid: string // same as symbol
  prevDocId: string | null
  subDocSymbols?: string[] // help to get sub-docs in the database
  value: NestedNode<Bullet>[]
  cardInput?: CardInput // only needs if card does not exist, which creating card and doc in the same time
}

class NestedNodeValueStore<T> {
  readonly TEMP_ROOT_ID = 'TEMP_ROOT_ID'
  readonly root: NestedNode<T>

  constructor(children: NestedNode<T>[]) {
    this.root = {
      id: this.TEMP_ROOT_ID,
      children,
    }
  }

  get(): NestedNode<T>[] {
    return this.root.children
  }

  set(children: NestedNode<T>[]): void {
    this.root.children = children
  }

  getPartial(path: NodePath): NestedNode<T>[] {
    return NodeHelper.getPartial(this.root, path).children
  }

  setPartial(path: NodePath, children: NestedNode<T>[]): void {
    // NodeHelper.setPartial(this.root, path, children)
    this.root.children = children
  }

  static fromJSON<T>(json: NestedNodeValueParams<T>): NestedNodeValueStore<T> {
    const { children } = json
    return new NestedNodeValueStore(children)
  }

  toJSON(): NestedNodeValueParams<T> {
    return { children: this.root.children }
  }
}

class Doc {
  // readonly cid: string // use symbol as CID
  readonly prevDocId: string | null
  readonly symbol: string // use as CID
  readonly subDocSymbols: string[]
  readonly store: NestedNodeValueStore<Bullet>

  cardInput: CardInput | undefined

  constructor({
    prevDocId,
    symbol,
    subDocSymbols,
    cardInput,
    value,
  }: DocInput) {
    // this.cid = cid
    this.prevDocId = prevDocId
    this.symbol = symbol
    this.subDocSymbols = subDocSymbols ?? []
    this.cardInput = cardInput
    this.store = new NestedNodeValueStore(value)
  }

  toJSON(): DocInput {
    const { prevDocId, symbol, subDocSymbols, store, cardInput } = this
    return {
      prevDocId,
      symbol,
      subDocSymbols,
      cardInput,
      // value: store.getPartial([]),
      value: store.get(),
    }
  }

  static fromJSON(input: DocInput) {
    return new Doc(input)
  }
}

type DocLocation = {
  symbol: string
  mirror?: string
  path?: number[]
}

type CurrentDoc = {
  doc: Doc | null
  // warn?: 'prev_doc_behind'
  error?: string
}

class DocService {
  readonly docTable: LocalForage
  readonly curDoc$ = new BehaviorSubject<CurrentDoc>({ doc: null })

  readonly status$ = new BehaviorSubject<
    'starting' | 'loading' | 'saving' | 'pushing' | null
  >('starting')
  // public readonly savedDocs$: string[] = [] // docs not pushed yet

  constructor(docTable: LocalForage) {
    this.docTable = docTable
  }

  check(doc: Doc): void {
    // check subdocs
    // check prev-doc is current head
    // if (cardDoc?.id && cardDoc.id !== doc.prevDocId) {
    //   curDoc = { doc, warn: 'prev_doc_behind' }
    // }
  }

  create({
    card,
    cardDoc,
    symbol,
  }: {
    card: FakeCard | null
    cardDoc: FakeCardDoc | null
    symbol: string
  }): Doc {
    if (cardDoc) {
      // Got card-doc
      return new Doc({
        symbol,
        prevDocId: cardDoc.id,
        value: cardDoc.value,
      })
    }
    if (card) {
      // Got card, not card-doc -> a new webpage-card, use webpage-template
      if (card.link === undefined) {
        throw 'Expect link exist'
      }
      return new Doc({
        symbol,
        prevDocId: null,
        value: [
          {
            id: nanoid(),
            data: { id: nanoid(), head: `a new webpage-card ${symbol}` },
            children: [],
          },
        ],
      })
    }
    // No card, card-doc -> a new symbol-card
    return new Doc({
      symbol,
      prevDocId: null,
      value: [
        {
          id: nanoid(),
          data: { id: nanoid(), head: `a new symbol-card ${symbol}` },
          children: [],
        },
      ],
      cardInput: { symbol, meta: {} },
    })
  }

  /**
   * Drop all tables
   */
  async drop(): Promise<void> {
    dropDatabase()
  }

  async open({
    card,
    cardDoc,
    loc,
  }: {
    card: FakeCard | null
    cardDoc: FakeCardDoc | null
    loc: DocLocation
  }): Promise<void> {
    // Save current editing doc before opening another
    // console.log(this.curDoc$.getValue())
    const curDoc = this.curDoc$.getValue()
    if (curDoc.doc) {
      await this.save(curDoc.doc)
    }

    const { symbol } = loc
    this.curDoc$.next({ doc: null })
    this.status$.next('loading')

    const saved: DocInput | null = await this.docTable.getItem(symbol)
    if (saved) {
      // Found local doc
      const doc = Doc.fromJSON(saved)
      this.check(doc)
      this.curDoc$.next({ doc })
      this.status$.next(null)
      return
    }
    const doc = this.create({ card, cardDoc, symbol })
    // this.save(doc)
    console.log(doc)
    this.curDoc$.next({ doc })
    this.status$.next(null)
  }

  /**
   * Push a doc to remote (and drop local?)
   *
   * @throw Given sub-doc cid not found
   */
  async push(doc: Doc): Promise<void> {
    // Collect all subdocs, new cards
    // const doc = await doc.

    const prepare = (doc: Doc) => {
      const { prevDocId, symbol, subDocSymbols, cardInput, store } = doc
      return {
        prevDocId,
        symbol,
        subDocSymbols,
        cardInput,
        changes: [],
        finalValue: store.getPartial([]),
      }
    }

    const subDocs = await Promise.all(
      doc.subDocSymbols.map(async (e) => {
        const doc: DocInput | null = await this.docTable.getItem(e)
        if (doc === null) {
          throw `subdoc ${e} not found `
        }
        return doc
      })
    )
    // const allDocs = [doc, ...subDocs].map((e) => prepare(e))
    // remote pushes
  }

  /**
   * Push all saved docs to remote
   */
  async pushAll(): Promise<void> {
    throw 'Not implemented'
  }

  // async query(symbol: string): Promise<Doc | null> {
  //   const delay = new Promise((resolve) => setTimeout(resolve, 500)) // in ms
  //   await delay
  //   if (symbol === 'AAA') {
  //     return new Doc({
  //       cid: symbol,
  //       prevDocId: null,
  //       value: new NestedNodeValue([
  //         {
  //           id: 'AAA',
  //           data: { id: 'AAA', head: 'Mocking a queried doc' },
  //           children: [],
  //         },
  //       ]),
  //       subDocCids: [],
  //     })
  //   }
  //   return null // Mock doc not found case
  // }

  /**
   * Save to local IndexedDB
   */
  async save(doc: Doc): Promise<void> {
    this.status$.next('saving')
    console.log('Saving', doc, doc.toJSON())
    try {
      await this.docTable.setItem(doc.symbol, doc.toJSON())
    } catch (err) {
      console.error(err)
    }
    this.status$.next(null)
  }
}

class CardService {
  readonly card$ = new BehaviorSubject<string | null>(null)

  set(card: string) {
    //
  }

  create(symbol: string) {
    //
  }
}

// Globally available

const dbName = 'conoteDatabase'

const docTable = localforage.createInstance({
  name: dbName,
  storeName: 'docTable',
})

const dropDatabase = (): void => {
  localforage.dropInstance({
    name: dbName,
    storeName: 'docTable',
  })
}

const docService = new DocService(docTable)

const Editor = ({
  shareValue,
}: {
  shareValue: NestedNodeValueStore<Bullet>
}): JSX.Element => {
  const [value, setValue] = useState<NestedNode<Bullet>[]>(
    // shareValue.getPartial([])
    shareValue.root.children
  )

  useEffect(() => {
    setValue(shareValue.root.children)
  }, [shareValue])

  return (
    <div>
      <button
        onClick={() => {
          shareValue.set([
            ...value,
            {
              id: nanoid(),
              data: { id: nanoid(), head: 'hello world' },
              children: [],
            },
          ])
          setValue(shareValue.get())
          // shareValue.setPartial([], v)
        }}
      >
        Mutate
      </button>

      {value.map((e, i) => (
        <div key={i}>{e.data?.head ?? '*******'}</div>
      ))}
    </div>
  )
}

// const CreateDoc = ({ symbol }: { symbol: string }): JSX.Element => {
//   return (
//     <div>
//       <button
//         onClick={() => {
//           docService.create(symbol, 'Ticker template')
//         }}
//       >
//         Ticker template
//       </button>
//       <button
//         onClick={() => {
//           docService.create(symbol, 'Event template')
//         }}
//       >
//         Event template
//       </button>
//     </div>
//   )
// }

const CardHead = ({
  card,
  symbol,
}: {
  card: FakeCard | null
  symbol: string
}): JSX.Element => {
  return (
    <div>
      <h1>{symbol}</h1>
    </div>
  )
}

const Workspace = ({
  card,
  cardDoc,
  loc,
}: {
  card: FakeCard | null
  cardDoc: FakeCardDoc | null
  loc: DocLocation
}): JSX.Element | null => {
  const curDoc = useObservable(() => docService.curDoc$)

  useEffect(() => {
    docService.open({ card, cardDoc, loc })
  }, [card, cardDoc, loc])

  if (loc === undefined || curDoc === null) {
    return null
  }
  if (curDoc.doc === null) {
    return <div>Unexpected error</div>
  }
  return (
    <div>
      <button
        onClick={() => {
          if (curDoc.doc) {
            docService.drop()
          }
        }}
      >
        Drop
      </button>
      <button
        onClick={() => {
          if (curDoc.doc) {
            docService.push(curDoc.doc)
          }
        }}
      >
        Push
      </button>

      <CardHead card={card} symbol={loc.symbol} />

      <Editor shareValue={curDoc.doc.store} />
    </div>
  )
}

const getDocLocation = (query: ParsedUrlQuery): DocLocation => {
  const symbol = query['symbol']
  const path = query['p']
  const mirror = query['m']
  const author = query['a']

  if (typeof symbol !== 'string') {
    throw '[conote] Symbol not found in url query'
  }
  return {
    symbol,
    path:
      typeof path === 'string' ? path.split('.').map((e) => parseInt(e)) : [],
    mirror: typeof mirror === 'string' ? mirror : undefined,
    // mirrorSymbol: typeof mirror === 'string' ? mirror : undefined,
    // author: typeof author === 'string' ? author : undefined,
  }
}

const Page = (): JSX.Element | null => {
  const router = useRouter()
  const [loc, setLoc] = useState<DocLocation>()
  const [card, setCard] = useState<FakeCard | null>(null)
  const [cardDoc, setCardDoc] = useState<FakeCardDoc | null>(null)

  useEffect(() => {
    if (router.isReady) {
      const loc = getDocLocation(router.query)
      setLoc(loc)

      const { symbol } = loc

      // Mocking query card result
      if (symbol === 'BBB') {
        // mocking card 'BBB' is not found
        setCard(null)
        setCardDoc(null)
      } else if (symbol === 'URL') {
        // mocking card 'URL' is a new webpage-card
        setCard({ id: nanoid(), symbol, link: 'some-url.com' })
        setCardDoc(null)
      } else {
        const id = nanoid()
        setCard({ id: nanoid(), symbol })
        setCardDoc({
          id: nanoid(),
          value: [
            {
              id,
              data: { id, head: `${symbol}: A queried card doc` },
              children: [],
            },
          ],
        })
      }
    }
  }, [router])

  if (loc === undefined) {
    return null
  }
  return (
    <div>
      <p>
        <Link
          href={{
            pathname: '/workspace/workspace',
            query: { symbol: 'AAA' },
          }}
        >
          <a>AAA</a>
        </Link>
      </p>
      <p>
        <Link
          href={{
            pathname: '/workspace/workspace',
            query: { symbol: 'BBB' },
          }}
        >
          <a>BBB</a>
        </Link>
      </p>
      <p>
        <Link
          href={{
            pathname: '/workspace/workspace',
            query: { symbol: 'AAA', path: '1.2' },
          }}
        >
          <a>AAA@1.2</a>
        </Link>
      </p>

      <Workspace card={card} cardDoc={cardDoc} loc={loc} />
    </div>
  )
}

export default Page
