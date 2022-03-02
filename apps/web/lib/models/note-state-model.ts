import { NoteState } from '@prisma/client'
import { NodeChange, TreeNode } from '@conote/docdiff'
import { Bullet } from '../../components/bullet/bullet'
import prisma from '../prisma'

export type NoteStateBody = {
  prevStateId: string | null // initial state
  changes: NodeChange<Bullet>[]
  value: TreeNode<Bullet>[]
  // sourceCardId: string | null
  fromNoteId?: string // doc is created from which during editing, not strong binding
}

export type NoteStateParsed = Omit<NoteState, 'body'> & {
  body: NoteStateBody
}

export const NoteStateModel = {
  _encodeBody() {
    throw 'Not implemented'
  },

  _decodeBody() {
    throw 'Not implemented'
  },

  async get(id: string): Promise<NoteStateParsed | null> {
    const state = await prisma.noteState.findFirst({
      where: { id },
    })
    return state ? this.parse(state) : null
  },

  async getLastNoteState(noteId: string): Promise<NoteStateParsed | null> {
    const state = await prisma.noteState.findFirst({
      where: { noteId },
      orderBy: { createdAt: 'desc' },
    })
    return state ? this.parse(state) : null
  },

  parse(state: NoteState): NoteStateParsed {
    // TODO: validation require
    return {
      ...state,
      body: state.body as unknown as NoteStateBody,
    }
  },
}
