import { Doc } from '../../src/interfaces'
import { mockBlocks } from './mock-block'

const titleBlock = mockBlocks[0]

const doc: Doc = {
  title: titleBlock.str,
  blockUid: titleBlock.uid,
  // noteCopy?: Note // the latest note by query
  // noteDraftCopy?: NoteDraft // the latest note-draft
  // noteMeta?: NoteMeta // updates in note meta
}

export const mockDoc = {
  doc,
  blocks: mockBlocks,
}
