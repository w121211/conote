import { NoteDraft } from '../interfaces'
import {
  mockGotDraftOnly,
  mockGotNoteAndDraft,
  mockMyAllDrafts,
} from '../../test/__mocks__/mock-data'

type DiscussInput = {
  title: string
  content?: string
}

interface IDiscussService {
  createDiscuss(
    blockId: string,
    discussStr: string,
    discussInput: DiscussInput,
  ): Promise<void>
}

class MockDiscussService implements IDiscussService {
  async createDiscuss(blockId, blockStr, discussInput) {
    // events.updateStr()
    return mockDiscuss
  }
}

export const discussService = new MockDiscussService()
