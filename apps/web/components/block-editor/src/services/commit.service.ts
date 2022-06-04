import {
  NoteDocFragment,
  NoteDraftEntryFragment,
} from '../../../../apollo/query.graphql'

class CommitService {
  // private apolloClient = getApolloClient()

  /**
   * After commit, pair input-note-draft and result-note-doc together
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
      throw new Error(
        '[pairNoteDraft_noteDoc] Not found paired note-doc of input-note-draft',
      )
    })
  }
}

// let commitService: CommitService | undefined

// export function getCommitService(): CommitService {
//   if (commitService) return commitService
//   commitService = new CommitService()
//   return commitService
// }

export const commitService = new CommitService()
