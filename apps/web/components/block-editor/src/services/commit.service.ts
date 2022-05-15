import {
  CommitNoteDraftsDocument,
  CommitNoteDraftsMutation,
  CommitNoteDraftsMutationVariables,
} from '../../../../apollo/query.graphql'
import { getApolloClient } from '../../../../apollo/apollo-client'
import { Doc } from '../interfaces'

let commitService: CommitService | undefined

class CommitService {
  private apolloClient = getApolloClient()

  async commitDocs(docs: Doc[]): Promise<CommitNoteDraftsMutation | null> {
    const draftIds = docs.map(e => {
        if (e.noteDraftCopy) return e.noteDraftCopy.id
        throw new Error(
          '[commitDocs] all docs require to have noteDraftCopy to get draft-id',
        )
      }),
      { data, errors } = await this.apolloClient.mutate<
        CommitNoteDraftsMutation,
        CommitNoteDraftsMutationVariables
      >({
        mutation: CommitNoteDraftsDocument,
        variables: { draftIds },
      })

    if (data) {
      return data
    }
    if (errors) {
      console.error(errors)
      throw new Error('[commitDocs] Graphql mutation error')
    }
    throw new Error('[commitDocs] no return data')
  }
}

export function getCommitService(): CommitService {
  if (commitService) {
    return commitService
  }
  commitService = new CommitService()
  return commitService
}
