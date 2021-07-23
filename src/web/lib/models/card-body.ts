// export type MirrorOperation = BulletOperation

// TODO: 改成用bullet存？ 可以直接用bullet ops
export type MirrorEntry = {
  cardSymbol: string
  cardBodyId: number // 儲存編輯後創的body id，可能與最新body不一樣
  // op?: MirrorOperation
}

export type CardBodyContent = {
  root: Bullet
  mirrorEntries?: MirrorEntry[]
}

/**
 * 步驟：
 * - 檢查此卡片是否允許mirrors
 * - 對每個mirror，做完以下步驟後存成entry
 *   - 沒有op，代表此mirror無更新，忽略
 *   - 是新卡，創card、創body
 *   - 非新卡，創body
 * - 對mirrors本身增加、刪除
 *   - TODO: 需記錄標示
 * - 儲存
 *   - self有更新？ -> 存新的self、或存cur self
 *   - mirrors有更新？ -> 存新的mirros、或存cur mirrors
 *   - self, mirrors皆無更新 -> 不儲存
 */

async function _createCardBody({
  cardId,
  mirrorEntries,
  rootInput,
  userId,
}: {
  cardId: number
  mirrorEntries?: MirrorEntry[]
  rootInput: BulletInput
  userId: string
}): Promise<CardBody> {
  const cur = await getCurrentCardBody(cardId)
  const curContent: CardBodyContent = cur && JSON.parse(cur.content)
  const curDict = curContent && bulletToDict(curContent.root)

  // Run bullet op
  const timestamp = Date.now()
  const root = await runBulletInputOp({
    cardId: cardId,
    input: rootInput,
    curDict,
    timestamp,
    userId,
  })
  if (root === null) {
    throw new Error()
  }

  // TODO: serializer
  const content: CardBodyContent = { root, mirrorEntries }

  return await prisma.cardBody.create({
    data: {
      timestamp,
      content: JSON.stringify(content),
      card: { connect: { id: cardId } },
      user: { connect: { id: userId } },
      prev: cur ? { connect: { id: cur.id } } : undefined,
    },
  })
}

async function createCardBody({
  cardId,
  mirrorEntries,
  rootInput,
  userId,
}: {
  cardId: number
  mirrorEntries?: MirrorEntry[]
  rootInput: BulletInput
  userId: string
}): Promise<CardBody> {
  const cur = await getCurrentCardBody(cardId)
  const curContent: CardBodyContent = cur && JSON.parse(cur.content)
  const curDict = curContent && bulletToDict(curContent.root)

  // Run bullet op
  const timestamp = Date.now()
  const root = await runBulletInputOp({
    cardId: cardId,
    input: rootInput,
    curDict,
    timestamp,
    userId,
  })
  if (root === null) {
    throw new Error()
  }

  // TODO: serializer
  const content: CardBodyContent = { root, mirrorEntries }

  return await prisma.cardBody.create({
    data: {
      timestamp,
      content: JSON.stringify(content),
      card: { connect: { id: cardId } },
      user: { connect: { id: userId } },
      prev: cur ? { connect: { id: cur.id } } : undefined,
    },
  })
}
