import {
  NoteDocFragment,
  NoteDraftEntryFragment,
} from '../../../../apollo/query.graphql'

let commitService: CommitService | undefined

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
      const found = resultNoteDocs.find(d => {
        const { branch, symbol } = d
        if (branch && symbol) {
          return e.symbol === symbol
        }
        throw new Error(
          "[pairNoteDraft_noteDoc] Note-doc miss the required properties 'branch', 'symbol' to pair",
        )
      })
      if (found) {
        return [e, found]
      }
      throw new Error(
        '[pairNoteDraft_noteDoc] Not found paired note-doc of input-note-draft',
      )
    })
  }
}

export function getCommitService(): CommitService {
  if (commitService) return commitService

  commitService = new CommitService()
  return commitService
}
