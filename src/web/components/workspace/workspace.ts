import { ApolloClient } from '@apollo/client'
import { nanoid } from 'nanoid'
import { BehaviorSubject } from 'rxjs'
import { NodeChange, TreeNode } from '../../../packages/docdiff/src'
import { LocalDBService } from './local-db'
import {
  CardFragment,
  CreateCommitDocument,
  CreateCommitMutation,
  CreateCommitMutationVariables,
} from '../../apollo/query.graphql'
import { Bullet } from '../bullet/types'
import { EditorSerializer } from '../editor/serializer'
import { DocPath } from './doc-path'
import { Doc, DocEntry, DocEntryPack } from './doc'

class Workspace {
  readonly mainDoc$ = new BehaviorSubject<{
    doc: Doc | null
    error?: string
    // warn?: 'prev_doc_behind'
  }>({ doc: null })

  readonly status$ = new BehaviorSubject<'starting' | 'loading' | 'saving' | 'pushing' | 'droped' | null>('starting')

  readonly committedDocs$ = new BehaviorSubject<DocEntryPack[] | null>(null)

  readonly savedDocs$ = new BehaviorSubject<DocEntryPack[] | null>(null) // docs not pushed yet

  constructor() {
    this.updateEditingDocEntries()
    this.updateCommittedDocEntries()
  }

  _create({
    card,
    sourceCard,
    symbol,
  }: {
    card: CardFragment | null
    sourceCard: CardFragment | null
    symbol: string
  }): Doc {
    if (card?.state) {
      const value = card.state.body.value as unknown as TreeNode<Bullet>[]

      return new Doc({
        cardCopy: card,
        sourceCardCopy: sourceCard,
        cardInput: null,
        // editorValue: null,
        symbol,
        editorValue: EditorSerializer.toLiArray(value),
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
        editorValue: EditorSerializer.toLiArray(value),
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
      editorValue: EditorSerializer.toLiArray(value),
    })
  }

  /**
   * Commit a doc and its sub-docs to remote, once completed mvoe to commited-doc of local-db
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  async commit(doc: Doc, client: ApolloClient<object>): Promise<void> {
    if (doc.sourceCardCopy) {
      console.warn(`Need to commit from source card ${doc.sourceCardCopy.sym.symbol}`)
      return
    }
    const subDocs = await doc.getSubDocs()
    const allDocs = [doc, ...subDocs]
    const cardStateInputs = allDocs
      .map(e => e.toCardStateInput())
      .filter(e => (e.changes as NodeChange<Bullet>[]).length > 0)

    if (cardStateInputs.length === 0) {
      console.warn(`Doc(s) not changed, return`)
      return
    }

    const { data, errors } = await client.mutate<CreateCommitMutation, CreateCommitMutationVariables>({
      mutation: CreateCommitDocument,
      variables: {
        data: { cardStateInputs },
      },
    })
    if (errors) {
      console.error('Commit error', errors)
      return
    }
    if (data === undefined || data === null) {
      console.error('Commit error: return empty data')
      return
    }
    if (data) {
      console.log('CreateCommitMutation', data)

      for (const state of data.createCommit.cardStates) {
        if (state.cid === undefined || state.cid === null) {
          throw 'Commit return state error: should have cid'
        }
        const found = allDocs.find(e => e.cid === state.cid)
        if (found === undefined) {
          throw 'Commit return state error: cannot find corresponding doc'
        }
        found.committedAt = new Date(data.createCommit.updatedAt).getTime()
        found.committedState = state

        console.log(found)

        await found.saveToCommittedTable()
        await found.remove() // remove from doc-table
        // await Doc.removeDoc(e.cid)
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
    await this.updateEditingDocEntries()
  }

  async open({
    docPath,
    card,
    sourceCard,
  }: {
    docPath: DocPath
    card: CardFragment | null
    sourceCard: CardFragment | null
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
    const loaded = await Doc.load(symbol)
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
      await this.updateEditingDocEntries()

      doc.getChanges()
    } catch (err) {
      console.error(err)
    }
    this.status$.next(null)
  }

  async sync(): Promise<void> {
    throw 'Not implemented'
  }

  toDocEntries(docs: Doc[]): DocEntryPack[] {
    console.log('Get doc entries...')
    const dict: Record<string, { main: { symbol: string; entry?: DocEntry }; subs: DocEntry[] }> = {}
    // const docs = await Doc.getAllDocs()
    for (const e of docs) {
      const { sourceCardCopy } = e
      const entry = e.toDocEntry()
      if (sourceCardCopy) {
        const { symbol } = sourceCardCopy.sym
        if (symbol in dict) {
          dict[symbol].subs.push(entry)
        } else {
          dict[symbol] = {
            main: { symbol },
            subs: [entry],
          }
        }
      } else {
        const { symbol } = e
        dict[symbol] =
          symbol in dict
            ? {
                ...dict[symbol],
                main: { symbol, entry },
              }
            : {
                main: { symbol, entry },
                subs: [],
              }
      }
    }
    const entries = Object.values(dict)

    // sort entries
    // for (const entry of entries) {
    //   entry.subEntries.sort(e => -e.updatedAt)
    //   if (entry.subEntries.length > 0 && entry.updatedAt < entry.subEntries[0].updatedAt) {
    //     entry.updatedAt = entry.subEntries[0].updatedAt // align entry's updated with subEntries latest update
    //   }
    // }
    // entries.sort(e => -e.updatedAt)

    return entries
  }

  async updateEditingDocEntries(docSaved?: Doc): Promise<void> {
    this.savedDocs$.next(this.toDocEntries(await Doc.getAllDocs()))
  }

  async updateCommittedDocEntries(): Promise<void> {
    this.committedDocs$.next(this.toDocEntries(await Doc.getAllCommittedDocs()))
  }
}

export const workspace = new Workspace() // make globally available
