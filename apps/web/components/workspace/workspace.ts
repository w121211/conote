import { ApolloClient } from '@apollo/client'
import { BehaviorSubject } from 'rxjs'
import { NodeChange, TreeNode, TreeService } from '@conote/docdiff'
import {
  CreateCommitDocument,
  CreateCommitMutation,
  CreateCommitMutationVariables,
  NoteFragment,
} from '../../apollo/query.graphql'
import { Doc } from './doc'
import { DocIndex, DocIndexService } from './doc-index'
import { LocalDatabaseService } from './local-database'

type DocSubject = {
  doc: Doc | null
  error?: string
  // warn?: 'prev_doc_behind'
}

class Workspace {
  readonly mainDoc$ = new BehaviorSubject<DocSubject>({ doc: null })
  readonly modalDoc$ = new BehaviorSubject<DocSubject>({ doc: null })
  readonly committedDocIndicies$ = new BehaviorSubject<TreeNode<DocIndex>[] | null>(null)
  readonly editingDocIndicies$ = new BehaviorSubject<TreeNode<DocIndex>[] | null>(null) // docs in editing and not committed yet

  readonly status$ = new BehaviorSubject<'initiating' | 'loading' | 'saving' | 'pushing' | 'droped' | null>(
    'initiating',
  )

  constructor() {
    this.updateEditingDocIndicies()
    // this.updateCommittedDocEntries()
  }

  // _whichDoc(isModal?: true): BehaviorSubject<{
  //   doc: Doc | null
  //   error?: string
  //   // warn?: 'prev_doc_behind'
  // }> {
  //   const doc$ = isModal ? this.modalDoc$ : this.mainDoc$
  //   if (isModal) {
  //     // check is allow to open in modal
  //     if (this.mainDoc$.getValue().doc === null) {
  //       throw 'main-doc is null, not able to open a modal-doc'
  //     }
  //   }
  //   return doc$
  // }

  closeDoc({ isModal }: { isModal?: true }): void {
    // const _doc$ = this._whichDoc(isModal)
    const doc$ = isModal ? this.modalDoc$ : this.mainDoc$
    doc$.next({ doc: null })
  }

  /**
   * Commit a doc and its children to remote, once completed mvoe to commited-doc of local-db
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  async commit(rootDocIndex: TreeNode<DocIndex>, client: ApolloClient<object>): Promise<void> {
    if (rootDocIndex.parentCid !== TreeService.tempRootCid) {
      throw 'docNode.parentCid !== TreeService.tempRootCid, need to commit from root-doc(s)'
    }
    const promises = TreeService.toList<DocIndex>([rootDocIndex]).map<Promise<Doc>>(async e => {
      const found = await Doc.find({ cid: e.cid })
      if (found === null) {
        throw 'found === null'
      }
      return found
    })
    const docs = await Promise.all<Doc>(promises)
    const noteStateInputs = docs.map(e => e.toNoteStateInput())
    // .filter(e => (e.changes as NodeChange<Bullet>[]).length > 0)

    // if (noteStateInputs.length === 0) {
    //   console.warn(`Doc(s) not changed, return`)
    //   return
    // }

    const { data, errors } = await client.mutate<CreateCommitMutation, CreateCommitMutationVariables>({
      mutation: CreateCommitDocument,
      variables: {
        data: { noteStateInputs },
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
      const { noteStates, stateIdToCidDictEntryArray } = data.createCommit
      const stateIdToCid = Object.fromEntries(stateIdToCidDictEntryArray.map(e => [e.k, e.v]))

      for (const state of noteStates) {
        const cid = stateIdToCid[state.id]
        if (cid === undefined) {
          throw 'Commit return state error: cid === undefined'
        }
        const found = docs.find(e => e.cid === cid)
        if (found === undefined) {
          throw 'Commit return state error: return state cid not found matching doc'
        }
        found.committedAt = new Date(data.createCommit.updatedAt).getTime()
        found.committedState = state

        // console.log(found)
        await found.saveCommittedDoc()
        await found.remove() // remove from doc-table
      }
    }
    await this.updateCommittedDocIndicies()
    await this.updateEditingDocIndicies()
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
  async dropAll(): Promise<void> {
    console.log('Droping local database')
    await LocalDatabaseService.dropAll()
    this.mainDoc$.next({ doc: null })
    this.status$.next('droped')
    await this.updateEditingDocIndicies()
  }

  async openDoc({ symbol, note, isModal }: { symbol: string; note: NoteFragment | null; isModal?: true }): Promise<{
    doc: Doc
    isFromSaved: boolean
  }> {
    const _doc$ = isModal ? this.modalDoc$ : this.mainDoc$
    if (_doc$.getValue().doc !== null) {
      throw '_doc$.getValue().doc !== null, call closeDoc() first before open another'
    }
    this.status$.next('loading')

    const found = await Doc.find({ symbol })
    if (found) {
      // TODO: check with remote has note-state updated?
      _doc$.next({ doc: found })
      this.status$.next(null)
      return {
        doc: found,
        isFromSaved: true,
      }
    }

    // No local doc, create one
    let fromDocCid: string | null = null
    if (isModal) {
      const { doc: mainDoc } = this.mainDoc$.getValue()
      if (mainDoc === null) {
        throw 'mainDoc === null: modal doc require main doc exist'
      }
      fromDocCid = mainDoc.cid
    }
    const doc = Doc.createDoc({ symbol, note, fromDocCid })
    _doc$.next({ doc })
    this.status$.next(null)
    return {
      doc,
      isFromSaved: false,
    }
  }

  /**
   * Save to local IndexedDB
   */
  async save(doc: Doc): Promise<void> {
    // console.log('Saving...')
    this.status$.next('saving')
    try {
      await doc.save()
      await this.updateEditingDocIndicies(doc)
    } catch (err) {
      console.error(err)
    }
    this.status$.next(null)
  }

  async sync(): Promise<void> {
    throw 'Not implemented'
  }

  /**
   * Remove doc and all its children doc (use doc-index tree for identifying the children)
   *
   */
  async remove(docCid: string): Promise<void> {
    const rootChildren = this.editingDocIndicies$.getValue()
    if (rootChildren) {
      const nodes = DocIndexService.getDocIndexWithChildren(rootChildren, docCid)
      if (nodes) {
        for (const e of nodes) {
          try {
            await Doc.removeDoc(e.cid)
          } catch (err) {
            console.error(err)
          }
        }
        await this.updateEditingDocIndicies()
      }
    }
  }

  async updateEditingDocIndicies(newDoc?: Doc): Promise<void> {
    const rootChildren = this.editingDocIndicies$.getValue()
    if (rootChildren && newDoc) {
      const [children, { appended }] = DocIndexService.appendDoc(rootChildren, newDoc)
      if (appended) {
        this.editingDocIndicies$.next(children)
      }
      return
    }
    this.editingDocIndicies$.next(DocIndexService.toDocIndexNodes(await Doc.getAllDocs()))
  }

  async updateCommittedDocIndicies(appendDocs?: Doc[]): Promise<void> {
    // this.committedDocEntries$.next(this.toDocEntries(await Doc.getAllCommittedDocs()))
    const cur = this.committedDocIndicies$.getValue()
    if (cur === null) {
      // this.committedDocIndicies$.next(DocIndexService.toDocIndexTreeNodes(await Doc.getAllDocs()))
      return
    }
    // if (insertDoc && TreeService.find(cur, node => node.cid === insertDoc.cid).length === 0) {
    //   // if insert-doc is not in current indicies, append
    //   const indicies = TreeService.toList<DocIndex>(cur)
    //   const nodes = TreeService.fromList<DocIndex>([...indicies, insertDoc.toDocIndex()])
    //   this.editingdDocIndicies$.next(nodes)
    // }
  }
}

export const workspace = new Workspace() // make globally available
