import { Note } from '../interfaces'
import {
  mockGotNoteAndDraft,
  mockGotNoteOnly,
} from '../../test/__mocks__/mock-data'

interface INoteService {
  queryNote(symbol: string): Promise<Note | null>
}

class MockNoteService implements INoteService {
  async queryNote(symbol: string): Promise<Note | null> {
    // throw new Error('not implemented')
    let note: Note | undefined
    switch (symbol) {
      case mockGotNoteOnly.title:
        note = mockGotNoteOnly.note
        break
      case mockGotNoteAndDraft.title:
        note = mockGotNoteAndDraft.note
        break
    }
    return note ?? null
  }
}

export const noteService = new MockNoteService()
