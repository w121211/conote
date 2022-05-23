import { Block } from '../../components/block-editor/src/interfaces'
import { NoteDocContent, NoteDocMeta } from '../interfaces'

export function isMetaChanged(prevMeta: NoteDocMeta, curMeta: NoteDocMeta) {
  throw 'not implement'
}

export function getContentDiff(
  prevContent: NoteDocContent,
  curContent: NoteDocContent,
) {
  throw 'not implement'
}

function getBlocksDiff(prevBlocks: Block[], curBlocks: Block[]) {
  throw 'not implement'
}
