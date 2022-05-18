import {
  NoteByBranchSymbolDocument,
  NoteByBranchSymbolQuery,
  NoteByBranchSymbolQueryVariables,
  NoteFragment,
} from '../../../../apollo/query.graphql'
import { getApolloClient } from '../../../../apollo/apollo-client'

interface INoteService {
  queryNote(symbol: string): Promise<NoteFragment | null>
}

// class MockNoteService implements INoteService {
//   async queryNote(symbol: string): Promise<NoteFragment | null> {
//     let note: NoteFragment | undefined
//     switch (symbol) {
//       case mockGotNoteOnly.title:
//         note = mockGotNoteOnly.note
//         break
//       case mockGotNoteAndDraft.title:
//         note = mockGotNoteAndDraft.note
//         break
//     }
//     return note ?? null
//   }
// }

class NoteService implements INoteService {
  private apolloClient = getApolloClient()

  async queryNote(symbol: string): Promise<NoteFragment | null> {
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
  // if (mock) {
  //   return new MockNoteService()
  // }
  return new NoteService()
}
