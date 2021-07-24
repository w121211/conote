import { CardHeadContentValue, CardHeadContentValueInjected, PinBoard } from './card'

/**
 * Search in a bullet tree and return the first found
 */
export function findBullets({
  node,
  where,
  curDepth = 0,
}: {
  node: Bullet | BulletInput
  where: {
    head?: string
    pin?: true
    pinCode?: BulletPinCode
    inDepth?: number
  }
  curDepth?: number
}): (Bullet | BulletInput)[] {
  const nextDepth = curDepth + 1
  let found: (Bullet | BulletInput)[] = []

  if (where.head && where.head === node.head) {
    found.push(node)
  } else if (where.pin && node.pin) {
    found.push(node)
  } else if (where.pinCode && where.pinCode === node.pinCode) {
    found.push(node)
  }
  if (where.inDepth === undefined || nextDepth <= where.inDepth) {
    for (const e of node.children ?? []) {
      found = found.concat(findBullets({ node: e, where, curDepth: nextDepth }))
    }
  }
  return found
}

export function injectCardHeadValue({
  bodyRoot,
  value,
}: {
  bodyRoot: Bullet
  value: CardHeadContentValue
}): CardHeadContentValueInjected {
  const pinBoards: PinBoard[] = []
  const found = findBullets({ node: bodyRoot, where: { pin: true } })
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
