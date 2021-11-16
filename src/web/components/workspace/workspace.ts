import { nanoid } from 'nanoid'
import { BehaviorSubject } from 'rxjs'
import { TreeNode } from '../../../packages/docdiff/src'
import { LocalDBService } from './local-db'
import {
  Card,
  CardInput,
  CardStateInput,
  CreateCommitDocument,
  CreateCommitMutation,
  CreateCommitMutationVariables,
} from '../../apollo/query.graphql'
import { Bullet } from '../bullet/types'
import { LiElement } from '../editor/slate-custom-types'
import { EditorSerializer } from '../editor/serializer'
import { ApolloClient } from '@apollo/client'
import { DocPath } from './doc-path'

export type DocEntry = {
  symbol: string
  title: string // webpage-card use title instead of symbol
  cardId?: string
  sourceCardId?: string
  commitId?: string
  subEntries: DocEntry[]
  updatedAt: number
}

export type DocProps = {
  symbol: string
  cardInput: CardInput | null
  cardCopy: Card | null
  sourceCardCopy: Card | null
  // subSymbols?: string[]
  updatedAt?: number
  // value: TreeNode<Bullet>[]
  // syncValue: LiElement[]
  editorValue: LiElement[]
}

export class Doc {
  readonly cid: string
  readonly symbol: string // as CID
  readonly cardCopy: Card | null // to keep the prev-state,
  readonly sourceCardCopy: Card | null // indicate current doc is a mirror
  cardInput: CardInput | null // required if card is null
  editorValue: LiElement[]
  updatedAt: number = Date.now() // timestamp
  // value: TreeNode<Bullet>[]
  // editorValue: LiElement[] | null // local store

  constructor({ cardInput, cardCopy, sourceCardCopy, symbol, editorValue }: DocProps) {
    if (cardCopy && cardCopy.sym.symbol !== symbol) {
      throw 'cardSnapshot.symbol !== symbol'
    }
    if (cardCopy && cardInput) {
      throw 'Card-snapshot & card-input cannot co-exist'
    }
    if (cardCopy === null && cardInput === null) {
      throw 'Need card-input if no card-snapshot'
    }
    this.cid = symbol
    // this.editorValue = editorValue
    this.symbol = symbol
    this.cardCopy = cardCopy
    this.sourceCardCopy = sourceCardCopy
    // this.subSymbols = subSymbols ?? []
    this.cardInput = cardInput
    // this.store = new NestedNodeValueStore(value)
    this.editorValue = editorValue
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
    try {
      await LocalDBService.docTable.removeItem(this.cid)
    } catch (err) {
      console.error(err)
    }
  }

  async save(): Promise<void> {
    this.updatedAt = Date.now()
    try {
      await LocalDBService.docTable.setItem(this.cid, this.toJSON())
    } catch (err) {
      console.error(err)
    }
  }

  toDocEntry(): DocEntry {
    const { symbol, cardInput, cardCopy, sourceCardCopy, editorValue, updatedAt } = this
    const title = cardCopy?.meta.title ? cardCopy?.meta.title : symbol
    return {
      symbol,
      title,
      cardId: cardCopy?.id,
      sourceCardId: sourceCardCopy?.id,
      subEntries: [],
      updatedAt,
    }
  }

  toJSON(): Required<DocProps> {
    const { symbol, cardInput, cardCopy, sourceCardCopy, editorValue, updatedAt } = this
    return { symbol, cardInput, cardCopy, sourceCardCopy, editorValue, updatedAt }
  }

  toCardStateInput(): CardStateInput {
    const { cid, cardInput, cardCopy, sourceCardCopy, editorValue } = this
    return {
      cid,
      prevStateId: cardCopy?.state?.id,
      cardInput,
      cardId: cardCopy?.id,
      sourceCardId: sourceCardCopy?.id,
      changes: [], // TODO
      value: EditorSerializer.toTreeNodes(editorValue),
    }
  }

  async getSubDocs(): Promise<Doc[]> {
    return (await Doc.getAllDocs()).filter(e => e.sourceCardCopy?.sym.symbol === this.symbol)
  }

  static async getAllDocs(): Promise<Doc[]> {
    const keys = await LocalDBService.docTable.keys()
    console.log('Get all keys:', keys)
    const docs: Doc[] = []
    for (const e of keys) {
      const loaded = await Doc.loads(e)
      if (loaded === null) {
        throw 'getAllDocs() unexpected error'
      }
      docs.push(loaded)
    }
    return docs
  }

  static fromJSON(props: Required<DocProps>): Doc {
    return new Doc(props)
  }

  static async loads(symbol: string): Promise<Doc | null> {
    const saved: Required<DocProps> | null = await LocalDBService.docTable.getItem(symbol) // symbol as cid

    if (saved) {
      // console.log('Doc loaded', saved)
      return Doc.fromJSON(saved)
      // this.check(doc)
    }
    return null
  }
}

class Workspace {
  readonly mainDoc$ = new BehaviorSubject<{
    doc: Doc | null
    error?: string
    // warn?: 'prev_doc_behind'
  }>({ doc: null })

  readonly status$ = new BehaviorSubject<'starting' | 'loading' | 'saving' | 'pushing' | 'droped' | null>('starting')

  readonly committedEntries$ = new BehaviorSubject<DocEntry[] | null>(null)

  readonly workingEntries$ = new BehaviorSubject<DocEntry[] | null>(null)

  // public readonly savedDocs$: string[] = [] // docs not pushed yet

  constructor() {
    // LocalDBService.docTable.keys().then(keys => {
    //   this.latestDocCids$.next(keys)
    // })
    this._getDocEntries().then(entries => {
      this.workingEntries$.next(entries)
    })
  }

  _create({ card, sourceCard, symbol }: { card: Card | null; sourceCard: Card | null; symbol: string }): Doc {
    if (card?.state) {
      const value: TreeNode<Bullet>[] = card.state.body.value
      return new Doc({
        cardCopy: card,
        sourceCardCopy: sourceCard,
        cardInput: null,
        // editorValue: null,
        symbol,
        editorValue: EditorSerializer.toLis(value),
      })
    }
    if (card) {
      // Has card but no card-state -> ie a new webpage-card, use webpage-template
      if (card.link === undefined) {
        throw 'Expect card.link exist'
      }
      const value: TreeNode<Bullet>[] = [
        {
          cid: nanoid(),
          data: { id: nanoid(), head: `a new webpage-card ${symbol}` },
          children: [],
        },
      ]
      return new Doc({
        symbol,
        cardInput: null,
        cardCopy: card,
        sourceCardCopy: null, // force set to null
        editorValue: EditorSerializer.toLis(value),
      })
    }
    // No card nor card-doc -> a new symbol-card
    const value: TreeNode<Bullet>[] = [
      {
        cid: nanoid(),
        data: { id: nanoid(), head: `a new symbol-card ${symbol}` },
        children: [],
      },
    ]
    return new Doc({
      symbol,
      cardInput: { symbol, meta: {} },
      cardCopy: null,
      sourceCardCopy: sourceCard,
      editorValue: EditorSerializer.toLis(value),
    })
  }

  async _getDocEntries(): Promise<DocEntry[]> {
    console.log('get doc entries...')
    const docs = await Doc.getAllDocs()
    const dict: Record<string, DocEntry> = Object.fromEntries(docs.map(e => [e.symbol, e.toDocEntry()]))
    const subSymbols: string[] = []

    for (const doc of docs) {
      const { sourceCardCopy } = doc
      if (sourceCardCopy) {
        const subEntry = dict[doc.symbol]
        if (subEntry === undefined) {
          throw 'getDocEntries() unexpected error'
        }

        // push to parent's sub-entries
        subSymbols.push(subEntry.symbol)
        const { symbol: parentSymbol } = sourceCardCopy.sym
        console.log(dict, subEntry, parentSymbol)
        if (parentSymbol in dict) {
          dict[parentSymbol].subEntries.push(subEntry)
        } else {
          dict[parentSymbol] = {
            symbol: parentSymbol,
            title: sourceCardCopy.meta.title ?? parentSymbol,
            cardId: sourceCardCopy.id,
            subEntries: [subEntry],
            updatedAt: subEntry.updatedAt,
          }
        }
      }
    }

    for (const e of subSymbols) {
      delete dict[e] // remove entry from dict
    }

    const entries: DocEntry[] = Object.values(dict)

    // sort entries
    // for (const entry of entries) {
    //   entry.subEntries.sort(e => -e.updatedAt)
    //   if (entry.subEntries.length > 0 && entry.updatedAt < entry.subEntries[0].updatedAt) {
    //     entry.updatedAt = entry.subEntries[0].updatedAt // align entry's updated with subEntries latest update
    //   }
    // }
    // entries.sort(e => -e.updatedAt)

    console.log(entries)

    return entries
  }

  /**
   * Commit a doc to remote (and drop local?)
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  async commit(doc: Doc, client: ApolloClient<object>): Promise<void> {
    if (doc.sourceCardCopy) {
      console.warn(`Need to commit from source card ${doc.sourceCardCopy.sym.symbol}`)
      return
    }
    const subDocs = await doc.getSubDocs()
    const allDocs = [doc, ...subDocs]
    const { data, errors } = await client.mutate<CreateCommitMutation, CreateCommitMutationVariables>({
      mutation: CreateCommitDocument,
      variables: {
        data: {
          cardStateInputs: allDocs.map(e => e.toCardStateInput()),
        },
      },
    })
    if (errors) {
      console.error('Commit error', errors)
    } else {
      console.log(data)
      // Remove committed docs
      for (const e of allDocs) {
        await e.remove()
      }
    }
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
    this.mainDoc$.next({ doc: null })
    this.status$.next('droped')
    await this.updateDocEntries()
  }

  async open({
    docPath,
    card,
    sourceCard,
  }: {
    docPath: DocPath
    card: Card | null
    sourceCard: Card | null
  }): Promise<void> {
    // Save current editing doc before opening another
    const curDoc = this.mainDoc$.getValue()
    if (curDoc.doc) {
      await this.save(curDoc.doc)
    }

    // console.log(sourceCard)

    const { symbol } = docPath
    this.mainDoc$.next({ doc: null })
    this.status$.next('loading')

    // TODO: check with remote has card-state updated?
    const loaded = await Doc.loads(symbol)
    if (loaded) {
      this.mainDoc$.next({ doc: loaded })
      this.status$.next(null)
      return
    }

    // No local doc, create one
    const doc = this._create({ card, sourceCard, symbol })
    this.mainDoc$.next({ doc })
    this.status$.next(null)
  }

  /**
   * Save to local IndexedDB
   */
  async save(doc: Doc): Promise<void> {
    console.log('Saving')
    this.status$.next('saving')
    try {
      await doc.save()
      await this.updateDocEntries()
    } catch (err) {
      console.error(err)
    }
    this.status$.next(null)
  }

  async sync(): Promise<void> {
    throw 'Not implemented'
  }

  async updateDocEntries(docSaved?: Doc): Promise<void> {
    this.workingEntries$.next(await this._getDocEntries())
  }
}

export const workspace = new Workspace() // make globally available
