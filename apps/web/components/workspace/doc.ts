import { isEqual } from 'lodash'
import { nanoid } from 'nanoid'
import { NoteInput, NoteMetaInput, NoteStateInput } from 'graphql-let/__generated__/__types__'
import { NodeChange, TreeChangeService, TreeNode, TreeService } from '@conote/docdiff'
import { NoteFragment, NoteStateFragment } from '../../apollo/query.graphql'
import { Bullet } from '../bullet/bullet'
import { LiElement } from '../editor/slate-custom-types'
import { EditorSerializer } from '../editor/serializer'
import { LocalDatabaseService } from './local-database'

export type DocProps = {
  cid?: string
  fromDocCid: string | null // null for roots, TODO: handle if remote symbol name changed
  noteInput: NoteInput | null
  noteCopy: NoteFragment | null
  editorValue: LiElement[]
  // value: TreeNode<Bullet>[]
  // changes: NodeChange<Bullet>[]
  createdAt?: number
  updatedAt?: number
  committedAt?: number | null
  committedState?: NoteStateFragment | null
}

const isBulletEqual = (a: Bullet, b: Bullet) => {
  return a.head === b.head
}

export class Doc {
  readonly cid: string
  readonly fromDocCid: string | null
  readonly noteCopy: NoteFragment | null // keep the previous state, TODO: sync to the latest note state if remote updated

  noteInput: NoteInput | null // required if note is null
  editorValue: LiElement[]
  // value: TreeNode<Bullet>[]
  // changes: NodeChange<Bullet>[] = []
  createdAt: number
  updatedAt: number
  committedAt: number | null = null
  committedState: NoteStateFragment | null = null

  editorValueLastSaved: LiElement[]
  isEditorValueChangedSinceSave = false
  isWebNote: boolean

  constructor({
    cid,
    fromDocCid,
    noteCopy,
    noteInput,
    editorValue,
    createdAt,
    updatedAt,
    committedAt,
    committedState,
  }: DocProps) {
    if (noteCopy === null && noteInput === null) {
      throw 'noteCopy === null && noteInput === null'
    }
    this.cid = cid ?? nanoid()
    this.fromDocCid = fromDocCid
    this.noteCopy = noteCopy
    this.noteInput = noteInput
    this.editorValue = editorValue
    this.editorValueLastSaved = editorValue
    this.createdAt = createdAt ?? Date.now()
    this.updatedAt = updatedAt ?? Date.now()
    this.committedAt = committedAt ?? null
    this.committedState = committedState ?? null
    this.isWebNote = noteCopy?.link ? true : false
  }

  static createDoc({
    symbol,
    note,
    fromDocCid,
  }: {
    symbol: string // required if note is null
    note: NoteFragment | null
    fromDocCid: string | null
  }): Doc {
    if (note) {
      if (note.state) {
        const value = note.state.body.value as unknown as TreeNode<Bullet>[]
        return new Doc({
          fromDocCid,
          noteCopy: note,
          noteInput: null,
          editorValue: EditorSerializer.toLiArray(value),
        })
      } else {
        // Has note but no note-state -> ie a new webpage-note, use webpage-template
        if (note.link === undefined) {
          throw 'note.link === undefined'
        }
        return new Doc({
          fromDocCid,
          noteCopy: note,
          noteInput: null,
          editorValue: [
            {
              type: 'li',
              children: [{ type: 'lc', cid: nanoid(), children: [{ text: '' }] }],
              // children: [{ type: 'lc', cid: nanoid(), children: [{ text: `a new webpage-note ${symbol}` }] }],
            },
          ],
        })
      }
    }
    // No note -> a new symbol-note
    // TODO: check symbol format is valid
    return new Doc({
      fromDocCid,
      noteCopy: null,
      noteInput: { symbol, meta: {} },
      editorValue: [
        {
          type: 'li',
          children: [{ type: 'lc', cid: nanoid(), children: [{ text: '' }] }],
          // children: [{ type: 'lc', cid: nanoid(), children: [{ text: `a new symbol-note ${symbol}` }] }],
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

  /**
   * Remove the doc by 'cid' from local
   */
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
    // if (noteDoc?.id && noteDoc.id !== doc.prevDocId) {
    //   curDoc = { doc, warn: 'prev_doc_behind' }
    // }
  }

  getChanges(): NodeChange<Bullet>[] {
    const startValue = this.noteCopy?.state?.body.value
      ? (this.noteCopy.state.body.value as unknown as TreeNode<Bullet>[])
      : []
    const changes = TreeChangeService.getChnages(this.getValue(), startValue, isBulletEqual)
    // console.log(this.editorValue)
    // console.log(this.noteCopy?.state?.body.value, this.getValue(), changes)
    return changes
  }

  async getChildren(): Promise<Doc[]> {
    const docs = await Doc.getAllDocs()
    const nodes = TreeService.fromList<Doc>(docs)

    if (node) {
      TreeService.toList([node])
      return docs
    }
    throw 'doc node not found'
  }

  getNoteMetaInput(): NoteMetaInput {
    if (this.noteInput?.meta) {
      return this.noteInput.meta
    }
    if (this.noteCopy?.meta) {
      return this.noteCopy.meta
    }
    return {}
  }

  getSymbol(): string {
    if (this.noteCopy) {
      return this.noteCopy.sym.symbol
    }
    if (this.noteInput) {
      return this.noteInput.symbol
    }
    throw 'doc noteCopy & noteInput are both null'
  }

  getValue(): TreeNode<Bullet>[] {
    return EditorSerializer.toTreeNodes(this.editorValue)
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
      noteInput,
      noteCopy,
      // sourceNoteCopy,
      editorValue,
      createdAt,
      updatedAt,
      committedAt,
      committedState,
    } = this
    return {
      cid,
      fromDocCid,
      noteInput,
      noteCopy,
      // sourceNoteCopy,
      editorValue,
      createdAt,
      updatedAt,
      committedAt,
      committedState,
    }
  }

  toNoteStateInput(): NoteStateInput {
    const { cid, fromDocCid, noteInput, noteCopy, editorValue } = this
    // const changes = this.updateChanges()
    return {
      cid,
      fromDocCid,
      noteInput,
      noteId: noteCopy?.id,
      prevStateId: noteCopy?.state?.id,
      changes: this.getChanges(), // TODO: flatten
      value: EditorSerializer.toTreeNodes(editorValue), // TODO: flatten
    }
  }

  updateNoteMetaInput(metaInput: NoteMetaInput): { isUpdated: boolean } {
    if (this.noteInput?.meta && isEqual(metaInput, this.noteInput.meta)) {
      return { isUpdated: false }
    }
    if (this.noteInput) {
      this.noteInput.meta = metaInput
    } else {
      this.noteInput = {
        symbol: this.getSymbol(),
        meta: metaInput,
      }
    }
    return { isUpdated: true }
  }

  updateNoteSymbol(newSymbol: string): void {
    if (this.noteCopy) {
      console.warn('Rename created note symbol is not supported yet.')
      return
    }
    if (this.getSymbol() === newSymbol) {
      return // no need to change
    }
    if (this.noteInput) {
      this.noteInput.symbol = newSymbol
    }
  }
}
