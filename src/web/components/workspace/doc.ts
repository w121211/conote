import { CardInput, CardStateInput } from 'graphql-let/__generated__/__types__'
import { NodeChange, TreeChangeService, TreeNode } from '../../../packages/docdiff/src'
import { CardFragment, CardStateFragment } from '../../apollo/query.graphql'
import { Bullet } from '../bullet/bullet'
import { LiElement } from '../editor/slate-custom-types'
import { EditorSerializer } from '../editor/serializer'
import { LocalDBService } from './local-db'

export type DocEntry = {
  symbol: string
  title: string // webpage-card use title instead of symbol
  cardId?: string
  sourceCardId?: string
  commitId?: string
  updatedAt: number
}

export type DocEntryPack = {
  main: { symbol: string; entry?: DocEntry }
  subs: DocEntry[]
}

export type DocProps = {
  symbol: string
  cardInput: CardInput | null
  cardCopy: CardFragment | null
  sourceCardCopy: CardFragment | null
  // value: TreeNode<Bullet>[]
  editorValue: LiElement[]
  // changes: NodeChange<Bullet>[]
  createdAt?: number
  updatedAt?: number
  committedAt?: number | null
  committedState?: CardStateFragment | null
}

const isBulletEqual = (a: Bullet, b: Bullet) => {
  return a.head === b.head
}

export class Doc {
  readonly cid: string
  readonly symbol: string // as CID
  readonly cardCopy: CardFragment | null // to keep the prev-state,
  readonly sourceCardCopy: CardFragment | null // indicate current doc is a mirror
  cardInput: CardInput | null // required if card is null
  editorValue: LiElement[]
  // value: TreeNode<Bullet>[]
  // changes: NodeChange<Bullet>[] = []
  createdAt: number
  updatedAt: number
  committedAt: number | null = null
  committedState: CardStateFragment | null = null

  constructor({
    cardInput,
    cardCopy,
    sourceCardCopy,
    symbol,
    editorValue,
    createdAt,
    updatedAt,
    committedAt,
    committedState,
  }: DocProps) {
    if (cardCopy && cardCopy.sym.symbol !== symbol) {
      throw `cardSnapshot.symbol !== symbol: ${cardCopy.sym.symbol}, ${symbol}`
    }
    if (cardCopy && cardInput) {
      throw 'Card-snapshot & card-input cannot co-exist'
    }
    if (cardCopy === null && cardInput === null) {
      throw 'Need card-input if no card-snapshot'
    }
    this.cid = symbol
    this.symbol = symbol
    this.cardCopy = cardCopy
    this.sourceCardCopy = sourceCardCopy
    // this.subSymbols = subSymbols ?? []
    this.cardInput = cardInput
    this.editorValue = editorValue
    this.createdAt = createdAt ?? Date.now()
    this.updatedAt = updatedAt ?? Date.now()
    // this.getChanges()
    this.committedAt = committedAt ?? null
    this.committedState = committedState ?? null
  }

  static async getAllDocs(): Promise<Doc[]> {
    console.log('Get all docs...')
    const cids = await LocalDBService.docTable.keys()
    const promises = cids.map(async e => {
      const loaded = await Doc.load(e)
      if (loaded === null) {
        throw 'getAllDocs() unexpected error'
      }
      return loaded
    })
    const docs = await Promise.all(promises)
    return docs
  }

  static async getAllCommittedDocs(): Promise<Doc[]> {
    console.log('Get all committed docs...')
    const cids = await LocalDBService.docCommittedTable.keys()
    const promises = cids.map(async e => {
      const loaded = await Doc.loadFromCommittedTable(e)
      if (loaded === null) {
        throw 'getAllCommittedDocs() unexpected error'
      }
      return loaded
    })
    const docs = await Promise.all(promises)
    return docs
  }

  static async load(cid: string): Promise<Doc | null> {
    const found: Required<DocProps> | null = await LocalDBService.docTable.getItem(cid)
    if (found) {
      // this.check(doc) // check remote for updates
      return new Doc(found)
    }
    return null
  }

  static async loadFromCommittedTable(cid: string): Promise<Doc | null> {
    const found: Required<DocProps> | null = await LocalDBService.docCommittedTable.getItem(cid)
    if (found) {
      // this.check(doc)
      return new Doc(found)
    }
    return null
  }

  static async removeDoc(cid: string): Promise<void> {
    try {
      await LocalDBService.docTable.removeItem(cid)
    } catch (err) {
      console.error(err)
    }
  }

  static async removeFromCommittedTable(cid: string): Promise<void> {
    try {
      await LocalDBService.docTable.removeItem(cid)
    } catch (err) {
      console.error(err)
    }
  }

  check(): void {
    throw 'Not implemented'
    // check subdocs
    // check prev-doc is current head
    // if (cardDoc?.id && cardDoc.id !== doc.prevDocId) {
    //   curDoc = { doc, warn: 'prev_doc_behind' }
    // }
  }

  async remove(): Promise<void> {
    Doc.removeDoc(this.cid)
  }

  async save(): Promise<void> {
    this.updatedAt = Date.now()
    try {
      await LocalDBService.docTable.setItem(this.cid, this.toJSON())
      // this.updateChanges()
      // this.getChanges()
    } catch (err) {
      console.error(err)
    }
  }

  async saveToCommittedTable(): Promise<void> {
    const { committedAt, committedState } = this
    if (committedAt && committedState) {
      try {
        await LocalDBService.docCommittedTable.setItem(this.cid, this.toJSON()) // overwrite previous doc
      } catch (err) {
        console.error(err)
      }
      return
    }
    throw 'Save to committed-table require committedState & committedAt'
  }

  toDocEntry(): DocEntry {
    const { symbol, cardInput, cardCopy, sourceCardCopy, editorValue, updatedAt } = this
    const title = cardCopy?.meta.title ? cardCopy?.meta.title : symbol
    return {
      symbol,
      title,
      cardId: cardCopy?.id,
      sourceCardId: sourceCardCopy?.id,
      updatedAt,
    }
  }

  toJSON(): Required<DocProps> {
    const {
      symbol,
      cardInput,
      cardCopy,
      sourceCardCopy,
      editorValue,
      createdAt,
      updatedAt,
      committedAt,
      committedState,
    } = this
    return {
      symbol,
      cardInput,
      cardCopy,
      sourceCardCopy,
      editorValue,
      createdAt,
      updatedAt,
      committedAt,
      committedState,
    }
  }

  toCardStateInput(): CardStateInput {
    const { cid, cardInput, cardCopy, sourceCardCopy, editorValue } = this
    // const changes = this.updateChanges()
    return {
      cid,
      prevStateId: cardCopy?.state?.id,
      cardInput,
      cardId: cardCopy?.id,
      sourceCardId: sourceCardCopy?.id,
      changes: this.getChanges(), // TODO: flatten
      value: EditorSerializer.toTreeNodes(editorValue), // TODO: flatten
    }
  }

  getChanges(): NodeChange<Bullet>[] {
    const startValue = this.cardCopy?.state?.body.value
      ? (this.cardCopy.state.body.value as unknown as TreeNode<Bullet>[])
      : []
    const changes = TreeChangeService.getChnages(this.getValue(), startValue, isBulletEqual)
    console.log(this.editorValue)
    console.log(this.cardCopy?.state?.body.value, this.getValue(), changes)
    return changes
  }

  async getSubDocs(): Promise<Doc[]> {
    return (await Doc.getAllDocs()).filter(e => e.sourceCardCopy?.sym.symbol === this.symbol)
  }

  getValue(): TreeNode<Bullet>[] {
    return EditorSerializer.toTreeNodes(this.editorValue)
  }
}
