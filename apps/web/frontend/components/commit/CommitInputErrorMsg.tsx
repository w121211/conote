import { NoteDraftEntryFragment } from '../../../apollo/query.graphql'
import type { CommitInputErrorItem } from '../../../lib/interfaces'
import { CommitInputErrorCode } from '../../../share/constants'

function toErrorMessage(error: CommitInputErrorItem): string {
  switch (error.code) {
    case CommitInputErrorCode.CONTENT_EMPTY:
      return 'Content is empty'
    case CommitInputErrorCode.CONTENT_NOT_CHANGE:
      return 'Content does not change to the previous doc.'
    case CommitInputErrorCode.DISCUSS_ID_NOT_FOUND:
      return 'One or more discussion not found.'
    case CommitInputErrorCode.DISCUSS_NOT_CREATE:
      return 'One or more discussions have not been created.'
    case CommitInputErrorCode.FROM_DOC_NOT_HEAD:
      return 'Previous doc is behind the head.'
  }
}

const CommitInputErrorMsg = ({
  items,
  entries,
}: {
  items: CommitInputErrorItem[]
  entries: NoteDraftEntryFragment[]
}) => {
  const items_ = items.map(e => {
    const entry = entries.find(a => a.id === e.draftId)
    if (entry === undefined)
      throw new Error('Unexpected error: entry === undefined')
    return { ...e, ...entry }
  })

  return (
    <div>
      {items_.map(e => (
        <div key={e.draftId}>
          {e.symbol} - {toErrorMessage(e)}
        </div>
      ))}
    </div>
  )
}

export default CommitInputErrorMsg
