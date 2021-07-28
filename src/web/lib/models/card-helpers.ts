import { Node as BulletNode } from '../bullet/node'
import { Bullet } from '../bullet/types'
import { CardHeadContentValue, CardHeadContentValueInjected, PinBoard } from './card'

export function injectCardHeadValue({
  bodyRoot,
  value,
}: {
  bodyRoot: Bullet
  value: CardHeadContentValue
}): CardHeadContentValueInjected {
  const pinBoards: PinBoard[] = []
  const found = BulletNode.find(bodyRoot, { pin: true })
  for (const e of found) {
    if (e.pinCode && e.boardId) {
      pinBoards.push({
        pinCode: e.pinCode,
        boardId: e.boardId,
        pollId: e.pollId,
      })
    } else {
      console.error(e)
      throw new Error()
    }
  }

  return {
    ...value,
    pinBoards,
  }
}
