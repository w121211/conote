import { nanoid } from 'nanoid'
import { BehaviorSubject } from 'rxjs'
import { TreeNode } from '../../packages/docdiff/src'
import { LocalDBService } from './localforage'

export type Bullet = {
  id: string
  cid?: string
  head: string
}

export type Card = {
  id: string
  link?: string
  symbol: string
  state: CardState | null
}

export type CardInput = {
  symbol: string
  // # templateProps: CardTemplatePropsInput
  meta: Record<string, string>
}

export type CardState = {
  id: string
  body: {
    prevStateId: string
    subStateIds: string[]
    value: TreeNode<Bullet>[]
  }
}

export type DocLocation = {
  symbol: string
  mirror?: string
  path?: number[]
}

type DocProps = {
  cardInput: CardInput | null
  cardSnapshot: Card | null
  // prevState: CardState | null
  subSymbols?: string[] // 動態儲存還是只有在 submit 的時候直接輸出？
  symbol: string // use as cid
  value: TreeNode<Bullet>[]
  updatedAt?: number // UTC-seconds
}

export class Doc {
  readonly cid: string
  readonly symbol: string // as CID
  readonly cardSnapshot: Card | null // to keep the prev-state

  cardInput: CardInput | null // required if card is null
  subSymbols: string[]
  value: TreeNode<Bullet>[]

  updatedAt: number = Date.now() // timestamp

  constructor({
    cardInput,
    cardSnapshot,
    // prevState,
    subSymbols,
    symbol,
    value,
  }: DocProps) {
    if (cardSnapshot && cardSnapshot.symbol !== symbol) {
      throw 'cardSnapshot.symbol !== symbol'
    }
    if (cardSnapshot && cardInput) {
      throw 'Card-snapshot & card-input cannot co-exist'
    }
    if (cardSnapshot === null && cardInput === null) {
      throw 'Need card-input if no card-snapshot'
    }
    this.cid = symbol
    this.symbol = symbol
    this.cardSnapshot = cardSnapshot
    this.subSymbols = subSymbols ?? []
    this.cardInput = cardInput
    // this.store = new NestedNodeValueStore(value)
    this.value = value
  }

  // createBullet({
  //   head,
  //   authorId,
  //   sourceCardId,
  // }: {
  //   head: string
  //   authorId?: string
  //   sourceCardId?: string
  // }): DataNode<Bullet> {
  //   const cid = nanoid()
  //   const node: DataNode<Bullet> = {
  //     cid,
  //     data: {
  //       id: cid,
  //       cid,
  //       head,
  //       sourceCardId,
  //       authorId,
  //     },
  //   }
  //   return node
  // }

  // insertMarkerLines({
  //   markerlines,
  //   authorId,
  //   sourceCardId,
  // }: {
  //   markerlines: Markerline[]
  //   authorId?: string
  //   sourceCardId?: string
  // }): void {
  //   // const root = cloneDeep(rootBullet)
  //   for (const e of markerlines) {
  //     if (e.new && e.marker?.key && e.marker.value) {
  //       const { key, value } = e.marker
  //       const valueNode = this.createBullet({
  //         head: value,
  //         sourceCardId,
  //         authorId,
  //       })

  //       const found = TreeService.find(
  //         this.value,
  //         (node) => node.data?.head.includes(key) ?? false
  //       )
  //       if (found.length > 0) {
  //         this.value = TreeService.insert(
  //           this.value,
  //           valueNode,
  //           found[0].cid,
  //           -1
  //         )
  //       } else {
  //         // key node not found, create one
  //         const keyNode = this.createBullet({ head: key })
  //         this.value = TreeService.insert(
  //           this.value,
  //           keyNode,
  //           TreeService.tempRootCid,
  //           -1
  //         ) // insert key
  //         this.value = TreeService.insert(
  //           this.value,
  //           valueNode,
  //           keyNode.cid,
  //           -1
  //         ) // insert value
  //       }
  //     }
  //   }
  // }

  // insertBullet(
  //   bullet: DataNode<Bullet>,
  //   toParentCid: string,
  //   toIndex = -1
  // ): void {
  //   this.value = TreeService.insert(this.value, bullet, toParentCid, toIndex)
  // }

  toJSON(): Required<DocProps> {
    const { cardInput, cardSnapshot, symbol, subSymbols, value, updatedAt } =
      this
    return { cardInput, cardSnapshot, symbol, subSymbols, value, updatedAt }
  }

  static fromJSON(props: Required<DocProps>) {
    return new Doc(props)
  }

  async save() {
    this.updatedAt = Date.now()
    try {
      await LocalDBService.docTable.setItem(this.cid, this.toJSON())
    } catch (err) {
      console.error(err)
    }
  }

  static async loads(symbol: string): Promise<Doc | null> {
    const saved: Required<DocProps> | null =
      await LocalDBService.docTable.getItem(symbol) // symbol as cid

    if (saved) {
      console.log('Doc loaded', saved)
      return Doc.fromJSON(saved)
      // this.check(doc)
    }
    return null
  }

  check(): void {
    throw 'Not implemented'
    // check subdocs
    // check prev-doc is current head
    // if (cardDoc?.id && cardDoc.id !== doc.prevDocId) {
    //   curDoc = { doc, warn: 'prev_doc_behind' }
    // }
  }
}

class Workspace {
  readonly allDocCids$ = new BehaviorSubject<string[]>([])

  readonly curDoc$ = new BehaviorSubject<{
    doc: Doc | null
    error?: string
    // warn?: 'prev_doc_behind'
  }>({ doc: null })

  readonly status$ = new BehaviorSubject<
    'starting' | 'loading' | 'saving' | 'pushing' | 'droped' | null
  >('starting')

  // public readonly savedDocs$: string[] = [] // docs not pushed yet

  _create({ card, symbol }: { card: Card | null; symbol: string }): Doc {
    if (card?.state) {
      return new Doc({
        cardSnapshot: card,
        cardInput: null,
        value: card.state.body.value,
        symbol,
      })
    }
    if (card) {
      // Has card but no card-state -> ie a new webpage-card, use webpage-template
      if (card.link === undefined) {
        throw 'Expect card.link exist'
      }
      return new Doc({
        symbol,
        cardSnapshot: card,
        cardInput: null,
        value: [
          {
            cid: nanoid(),
            data: { id: nanoid(), head: `a new webpage-card ${symbol}` },
            children: [],
          },
        ],
      })
    }
    // No card, card-doc -> a new symbol-card
    return new Doc({
      symbol,
      cardSnapshot: null,
      cardInput: { symbol, meta: {} },
      value: [
        {
          cid: nanoid(),
          data: { id: nanoid(), head: `a new symbol-card ${symbol}` },
          children: [],
        },
      ],
    })
  }

  /**
   * Push a doc to remote (and drop local?)
   *
   * @throw Sub-doc not found
   */
  async commit(doc: Doc): Promise<void> {
    // Collect all subdocs, new cards
    // const prepare = (doc: Doc) => {
    //   const { prevDocId, symbol, subDocSymbols, cardInput, store } = doc
    //   return {
    //     prevDocId,
    //     symbol,
    //     subDocSymbols,
    //     cardInput,
    //     changes: [],
    //     finalValue: store.getPartial([]),
    //   }
    // }
    const subDocs = await Promise.all(
      doc.subSymbols.map(async (e) => {
        const doc: DocProps | null = await LocalDBService.docTable.getItem(e)
        if (doc === null) {
          throw `Subdoc ${e} not found `
        }
        return doc
      })
    )
    // const allDocs = [doc, ...subDocs].map((e) => prepare(e))

    // Remove committed docs
    // await LocalDBService.docTable.removeItem(doc.cid)
  }

  /**
   * Push all saved docs to remote
   */
  async commitAll(): Promise<void> {
    throw 'Not implemented'
  }

  /**
   * Drop all tables
   */
  async drop(): Promise<void> {
    console.log('Droping local database')
    await LocalDBService.drop()
    this.curDoc$.next({ doc: null })
    this.allDocCids$.next([])
    this.status$.next('droped')
  }

  async open({
    card,
    loc,
  }: {
    card: Card | null
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

    const loaded = await Doc.loads(symbol)
    if (loaded) {
      this.curDoc$.next({ doc: loaded })
      this.status$.next(null)
      return
    }

    // No local doc, create one
    const doc = this._create({ card, symbol })
    // this.save(doc)
    this.curDoc$.next({ doc })
    this.status$.next(null)
  }

  /**
   * Save to local IndexedDB
   */
  async save(doc: Doc): Promise<void> {
    console.log('Saving')
    this.status$.next('saving')
    try {
      doc.save()
      this.allDocCids$.next(await LocalDBService.docTable.keys())
    } catch (err) {
      console.error(err)
    }
    this.status$.next(null)
  }

  async sync(): Promise<void> {
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
}

export const workspace = new Workspace() // make globally available
