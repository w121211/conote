export const MERGE_POLL_V1_0 = {
  spec: 'merge_poll-v1_0',

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
