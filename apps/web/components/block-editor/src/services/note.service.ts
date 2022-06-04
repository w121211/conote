import {
  NoteByBranchSymbolDocument,
  NoteByBranchSymbolQuery,
  NoteByBranchSymbolQueryVariables,
  NoteFragment,
} from '../../../../apollo/query.graphql'
import { getApolloClient } from '../../../../apollo/apollo-client'

class NoteService {
  private apolloClient = getApolloClient()

  async queryNote(symbol: string): Promise<NoteFragment | null> {
    const { data, errors } = await this.apolloClient.query<
      NoteByBranchSymbolQuery,
      NoteByBranchSymbolQueryVariables
    >({
      query: NoteByBranchSymbolDocument,
      variables: { branch: 'default', symbol },
    })

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

// export function getNoteService(): NoteService {
//   return new NoteService()
// }

export const noteService = new NoteService()
