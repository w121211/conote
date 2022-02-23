import { isEqual } from 'lodash'
import { nanoid } from 'nanoid'
import { CardInput, CardMetaInput, CardStateInput } from 'graphql-let/__generated__/__types__'
import { NodeChange, TreeChangeService, TreeNode } from '@conote/docdiff'
import { CardFragment, CardStateFragment } from '../../apollo/query.graphql'
import { Bullet } from '../bullet/bullet'
import { LiElement } from '../editor/slate-custom-types'
import { EditorSerializer } from '../editor/serializer'
import { LocalDatabaseService } from './local-database'

export type DocProps = {
  cid?: string
  fromDocCid: string | null // null for roots, TODO: handle if remote symbol name changed
  cardInput: CardInput | null
  cardCopy: CardFragment | null
  editorValue: LiElement[]
  // value: TreeNode<Bullet>[]
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
  readonly fromDocCid: string | null
  readonly cardCopy: CardFragment | null // keep the previous state, TODO: sync to the latest card state if remote updated

  cardInput: CardInput | null // required if card is null
  editorValue: LiElement[]
  // value: TreeNode<Bullet>[]
  // changes: NodeChange<Bullet>[] = []
  createdAt: number
  updatedAt: number
  committedAt: number | null = null
  committedState: CardStateFragment | null = null

  editorValueLastSaved: LiElement[]
  isEditorValueChangedSinceSave = false

  constructor({
    cid,
    fromDocCid,
    cardCopy,
    cardInput,
    editorValue,
    createdAt,
    updatedAt,
    committedAt,
    committedState,
  }: DocProps) {
    if (cardCopy === null && cardInput === null) {
      throw 'cardCopy === null && cardInput === null'
    }
    this.cid = cid ?? nanoid()
    this.fromDocCid = fromDocCid
    this.cardCopy = cardCopy
    this.cardInput = cardInput
    this.editorValue = editorValue
    this.editorValueLastSaved = editorValue
    this.createdAt = createdAt ?? Date.now()
    this.updatedAt = updatedAt ?? Date.now()
    this.committedAt = committedAt ?? null
    this.committedState = committedState ?? null
  }

  static createDoc({
    symbol,
    card,
    fromDocCid,
  }: {
    symbol: string // required if card is null
    card: CardFragment | null
    fromDocCid: string | null
  }): Doc {
    if (card) {
      if (card.state) {
        const value = card.state.body.value as unknown as TreeNode<Bullet>[]
        return new Doc({
          fromDocCid,
          cardCopy: card,
          cardInput: null,
          editorValue: EditorSerializer.toLiArray(value),
        })
      } else {
        // Has card but no card-state -> ie a new webpage-card, use webpage-template
        if (card.link === undefined) {
          throw 'card.link === undefined'
        }
        return new Doc({
          fromDocCid,
          cardCopy: card,
          cardInput: null,
          editorValue: [
            {
              type: 'li',
              children: [{ type: 'lc', cid: nanoid(), children: [{ text: '' }] }],
              // children: [{ type: 'lc', cid: nanoid(), children: [{ text: `a new webpage-card ${symbol}` }] }],
            },
          ],
        })
      }
    }
    // No card -> a new symbol-card
    // TODO: check symbol format is valid
    return new Doc({
      fromDocCid,
      cardCopy: null,
      cardInput: { symbol, meta: {} },
      editorValue: [
        {
          type: 'li',
          children: [{ type: 'lc', cid: nanoid(), children: [{ text: '' }] }],
          // children: [{ type: 'lc', cid: nanoid(), children: [{ text: `a new symbol-card ${symbol}` }] }],
        },
      ],
    })
  }

  static async getAllDocs(): Promise<Doc[]> {
    if (typeof window === 'undefined') {
      return []
    }

    console.log('Get all docs... (heavy, use with caution)')
    const cids = await LocalDatabaseService.docTable.keys()
    const promises = cids.map(async e => {
      const found = await Doc.find({ cid: e })
      if (found === null) {
        throw 'getAllDocs() unexpected error'
      }
      return found
    })
    const docs = await Promise.all(promises)
    return docs
  }

  static async getAllCommittedDocs(): Promise<Doc[]> {
    console.log('Get all committed docs...')
    const cids = await LocalDatabaseService.committedDocTable.keys()
    const promises = cids.map(async e => {
      const found = await Doc.findCommittedDoc(e)
      if (found === null) {
        throw 'getAllCommittedDocs() unexpected error'
      }
      return found
    })
    const docs = await Promise.all(promises)
    return docs
  }

  static async find({ cid, symbol }: { cid?: string; symbol?: string }): Promise<Doc | null> {
    if (cid) {
      const found = await LocalDatabaseService.docTable.getItem<Required<DocProps>>(cid)
      if (found) {
        // this.check(doc) // check remote for updates
        return new Doc(found)
      }
      return null
    }
    if (symbol) {
      const allDocs = await this.getAllDocs()
      const filtered = allDocs.filter(e => e.getSymbol() === symbol)
      if (filtered.length > 1) {
        throw 'found more than one doc has same symbol name'
      }
      if (filtered.length === 1) {
        return filtered[0]
      }
      return null
    }
    throw 'find({cid, symbol}) requires cid or symbol'
  }

  static async findCommittedDoc(cid: string): Promise<Doc | null> {
    const found = await LocalDatabaseService.committedDocTable.getItem<Required<DocProps>>(cid)
    if (found) {
      // this.check(doc)
      return new Doc(found)
    }
    return null
  }

  static async removeDoc(cid: string): Promise<void> {
    try {
      await LocalDatabaseService.docTable.removeItem(cid)
    } catch (err) {
      console.error(err)
    }
  }

  static async removeCommittedDoc(cid: string): Promise<void> {
    try {
      await LocalDatabaseService.docTable.removeItem(cid)
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
      await LocalDatabaseService.docTable.setItem(this.cid, this.toJSON())
      this.editorValueLastSaved = this.editorValue
      this.isEditorValueChangedSinceSave = true
      // this.updateChanges()
      // this.getChanges()
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Save just committed doc to committed-table
   */
  async saveCommittedDoc(): Promise<void> {
    const { committedAt, committedState } = this
    if (committedAt && committedState) {
      try {
        await LocalDatabaseService.committedDocTable.setItem(this.cid, this.toJSON()) // overwrite previous doc
      } catch (err) {
        console.error(err)
      }
      return
    }
    throw 'Save to committed-table require committedState & committedAt'
  }

  setEditorValue(value: LiElement[]): void {
    this.editorValue = value

    if (!this.isEditorValueChangedSinceSave) {
      // check is changed, do comparison only if value not changed yet
      this.isEditorValueChangedSinceSave = JSON.stringify(value) !== JSON.stringify(this.editorValueLastSaved)
    }
    // console.log(this.isEditorValueChangedSinceSave)
  }

  toJSON(): Required<DocProps> {
    const {
      cid,
      fromDocCid,
      cardInput,
      cardCopy,
      // sourceCardCopy,
      editorValue,
      createdAt,
      updatedAt,
      committedAt,
      committedState,
    } = this
    return {
      cid,
      fromDocCid,
      cardInput,
      cardCopy,
      // sourceCardCopy,
      editorValue,
      createdAt,
      updatedAt,
      committedAt,
      committedState,
    }
  }

  toCardStateInput(): CardStateInput {
    const { cid, fromDocCid, cardInput, cardCopy, editorValue } = this
    // const changes = this.updateChanges()
    return {
      cid,
      fromDocCid,
      cardInput,
      cardId: cardCopy?.id,
      prevStateId: cardCopy?.state?.id,
      changes: this.getChanges(), // TODO: flatten
      value: EditorSerializer.toTreeNodes(editorValue), // TODO: flatten
    }
  }

  getCardMetaInput(): CardMetaInput {
    if (this.cardInput?.meta) {
      return this.cardInput.meta
    }
    if (this.cardCopy?.meta) {
      return this.cardCopy.meta
    }
    return {}
  }

  getChanges(): NodeChange<Bullet>[] {
    const startValue = this.cardCopy?.state?.body.value
      ? (this.cardCopy.state.body.value as unknown as TreeNode<Bullet>[])
      : []
    const changes = TreeChangeService.getChnages(this.getValue(), startValue, isBulletEqual)
    // console.log(this.editorValue)
    // console.log(this.cardCopy?.state?.body.value, this.getValue(), changes)
    return changes
  }

  getSymbol(): string {
    if (this.cardCopy) {
      return this.cardCopy.sym.symbol
    }
    if (this.cardInput) {
      return this.cardInput.symbol
    }
    throw 'doc cardCopy & cardInput are both null'
  }

  getValue(): TreeNode<Bullet>[] {
    return EditorSerializer.toTreeNodes(this.editorValue)
  }

  updateCardMetaInput(metaInput: CardMetaInput): { isUpdated: boolean } {
    if (this.cardInput?.meta && isEqual(metaInput, this.cardInput.meta)) {
      return { isUpdated: false }
    }
    if (this.cardInput) {
      this.cardInput.meta = metaInput
    } else {
      this.cardInput = {
        symbol: this.getSymbol(),
        meta: metaInput,
      }
    }
    return { isUpdated: true }
  }

  updateCardSymbol(newSymbol: string): void {
    if (this.cardCopy) {
      console.warn('Rename created card symbol is not supported yet.')
      return
    }
    if (this.getSymbol() === newSymbol) {
      return // no need to change
    }
    if (this.cardInput) {
      this.cardInput.symbol = newSymbol
    }
  }
}
