import { NoteDraft } from '../interfaces'
import {
  mockGotDraftOnly,
  mockGotNoteAndDraft,
  mockMyAllDrafts,
} from './mock-data'

interface IDraftService {
  queryDraft(symbol: string): Promise<NoteDraft | null>

  queryMyAllDrafts(): Promise<Partial<NoteDraft>[] | null>

  saveDraft(draftInput: NoteDraft, id?: string): Promise<NoteDraft>

  removeDraft(id: string): Promise<{ success: true }>
}

class MockDraftService implements IDraftService {
  async queryDraft(symbol: string): Promise<NoteDraft | null> {
    // throw new Error('not implemented')
    let draft: NoteDraft | undefined
    switch (symbol) {
      case mockGotDraftOnly.title:
        draft = mockGotDraftOnly.draft
        break
      case mockGotNoteAndDraft.title:
        draft = mockGotNoteAndDraft.draft
        break
    }
    return draft ?? null
  }

  async queryMyAllDrafts(): Promise<Partial<NoteDraft>[] | null> {
    // throw new Error('not implemented')
    return mockMyAllDrafts
  }

  async saveDraft(draftInput: NoteDraft, id?: string): Promise<NoteDraft> {
    throw new Error('not implemented')
  }

  async removeDraft(id: string): Promise<{ success: true }> {
    throw new Error('not implemented')
  }
}

export const draftService = new MockDraftService()
