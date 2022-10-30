import type { FetchPolicy } from '@apollo/client'
import { getApolloClient } from '../../../../../apollo/apollo-client'
import {
  NoteByBranchSymbolDocument,
  NoteByBranchSymbolQuery,
  NoteByBranchSymbolQueryVariables,
  NoteFragment,
} from '../../../../../apollo/query.graphql'
import { BRANCH_NAME_DEFAULT } from '../../../../../share/constants'

class NoteService {
  private apolloClient = getApolloClient()

  async queryNote(
    symbol: string,
    fetchPolicy?: FetchPolicy,
  ): Promise<NoteFragment | null> {
    const { data, errors } = await this.apolloClient.query<
      NoteByBranchSymbolQuery,
      NoteByBranchSymbolQueryVariables
    >({
      query: NoteByBranchSymbolDocument,
      variables: { branch: BRANCH_NAME_DEFAULT, symbol },
      fetchPolicy,
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
