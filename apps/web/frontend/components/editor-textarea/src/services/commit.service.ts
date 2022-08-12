import { getApolloClient } from '../../../../../apollo/apollo-client'
import {
  CreateCommitDocument,
  CreateCommitMutation,
  CreateCommitMutationVariables,
  NoteDocFragment,
  NoteDraftEntryFragment,
} from '../../../../../apollo/query.graphql'

class CommitService {
  private apolloClient = getApolloClient()

  /**
   * After commit, pair input-note-draft and result-note-doc together
   * @deprecated
   */
  pairNoteDraft_noteDoc(
    inputDrafts: NoteDraftEntryFragment[],
    resultNoteDocs: NoteDocFragment[],
  ): [NoteDraftEntryFragment, NoteDocFragment][] {
    return inputDrafts.map(e => {
      const found = resultNoteDocs.find(
        ({ branchName, symbol }) => e.symbol === symbol,
      )
      if (found) {
        return [e, found]
      }
      console.debug(e, resultNoteDocs)
      throw new Error(
        '[pairNoteDraft_noteDoc] Not found paired note-doc of input-note-draft',
      )
    })
  }

  /**
   *
   */
  async createCommit(draftIds: string[]) {
    const { data, errors } = await this.apolloClient.mutate<
      CreateCommitMutation,
      CreateCommitMutationVariables
    >({
      mutation: CreateCommitDocument,
      variables: { noteDraftIds: draftIds },
    })

    if (data?.createCommit) {
      return data.createCommit
    }
    if (errors) {
      console.error(errors)
      throw new Error('[createCommit] mutation error')
    }
    throw new Error('[createCommit] no return data')
  }
}

export const commitService = new CommitService()
