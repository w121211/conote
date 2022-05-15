import { GQLNote } from '../interfaces'
import {
  mockGotNoteAndDraft,
  mockGotNoteOnly,
} from '../../test/__mocks__/mock-data'
import {
  NoteByBranchSymbolDocument,
  NoteByBranchSymbolQuery,
  NoteByBranchSymbolQueryVariables,
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
      NoteByBranchSymbolQuery,
      NoteByBranchSymbolQueryVariables
    >({
      query: NoteByBranchSymbolDocument,
      variables: { branch: 'branch', symbol },
    })

    console.log(data)

    if (errors) {
      // console.debug('[NoteBySymbolQuery] error', errors)
      return null
    }
    if (data.noteByBranchSymbol) {
      return data.noteByBranchSymbol
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
