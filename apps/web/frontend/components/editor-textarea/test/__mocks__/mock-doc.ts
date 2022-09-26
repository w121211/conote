import { nanoid } from 'nanoid'
import {
  NoteDocContentBody,
  NoteDocContentHead,
} from '../../../../../lib/interfaces'
import { mockNoteDrafts } from '../../../../../test/__mocks__/note-draft.mock'
import type { Doc } from '../../src/interfaces'

const mockNoteDraftCopyArray: Doc['noteDraftCopy'][] = mockNoteDrafts.map(e => {
  const { meta, contentHead, contentBody, ...rest } = e
  return {
    branchName: 'branchName',
    updatedAt: 'updatedAt',
    ...rest,
    meta: {
      __typename: 'NoteDraftMeta',
      ...meta,
    },
    contentHead: {
      __typename: 'NoteDocContentHead',
      ...contentHead,
    },
    contentBody: {
      __typename: 'NoteDocContentBody',
      ...contentBody,
    },
  }
})

export const mockDocs: Doc[] = mockNoteDraftCopyArray.map(e => ({
  noteCopy: null,
  contentHead: e.contentHead as NoteDocContentHead,
  contentBody: e.contentBody as NoteDocContentBody,
  uid: nanoid(),
  blockUid: e.contentBody.blocks[0].uid,
  noteDraftCopy: e,
}))
