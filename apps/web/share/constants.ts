export const MERGE_POLL_V1_0 = {
  spec: 'merge_poll-v1_0',

  openInDays: 3,

  // Array of [code, description], accept-choice is always the first item
  codes: [
    ['accept', 'Accept'],
    ['reject-bias', 'Bias content'],
    ['reject-abuse', 'Abuse or hateful content'],
    ['reject-offtopic', 'Off-topic content'],
    ['reject-delete_valuable', 'Delete valuable content'],
    ['reject-not_improve', 'Modifications do not improve the original content'],
    ['reject-writing_style', 'Not follow community writing style'],
    ['reject-others', 'Others'],
  ],
}

export enum CommitInputErrorCode {
  CONTENT_EMPTY = 'CONTENT_EMPTY',
  CONTENT_NOT_CHANGE = 'CONTENT_NOT_CHANGE',
  FROM_DOC_NOT_HEAD = 'FROM_DOC_NOT_HEAD',
  DISCUSS_NOT_CREATE = 'DISCUSS_NOT_CREATE',
}

export enum EditorAlertCode {
  // Share with note-doc alert
  DOC_WAIT_MERGE = 'DOC_WAIT_MERGE',
  FROM_DOC_NOTE_HEAD = 'FROM_DOC_NOTE_HEAD',

  // Editor only
  MISS_INDENT = 'MISS_INDENT',
}
