import { BulletDraft } from './types'

// const mirrorLine = (ticker: string, shot: ): BulletDraft => {
// }

export const writeLine = (head: string): BulletDraft => ({
  draft: true,
  op: 'CREATE',
  head,
  children: [],
})
