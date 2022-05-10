import { GQLNote } from '../interfaces'
import {
  mockGotNoteAndDraft,
  mockGotNoteOnly,
} from '../../test/__mocks__/mock-data'
import {
  NoteBySymbolDocument,
  NoteBySymbolQuery,
  NoteBySymbolQueryVariables,
} from '../../../../apollo/query.graphql'
import { getApolloClient } from '../../../../apollo/apollo-client'

interface INoteService {
  queryNote(symbol: string): Promise<GQLNote | null>
}

class MockNoteService implements INoteService {
  async queryNote(symbol: string): Promise<GQLNote | null> {
    let note: GQLNote | undefined
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

class NoteService implements INoteService {
  private apolloClient = getApolloClient()

  async queryNote(symbol: string): Promise<GQLNote | null> {
    const { data, errors } = await this.apolloClient.query<
      NoteBySymbolQuery,
      NoteBySymbolQueryVariables
    >({
      query: NoteBySymbolDocument,
      variables: { symbol },
    })

    if (errors) {
      console.debug('[NoteBySymbolQuery] error', errors)
      return null
    }
    if (data.note) {
      return data.note
    }
    return null
  }
}

export function getNoteService(mock?: true): INoteService {
  if (mock) {
    return new MockNoteService()
  }
  return new NoteService()
}
