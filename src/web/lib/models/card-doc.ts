// import { Doc } from "prettier"

// export type CardDocContent = {
//   value: NestedNode<Bullet>[]
//   changes: Change[]
//   subDocIds: string[]
//   // self: RootBullet
//   // mirrors?: RootBulletChildless[]
// }

// /**
//  * 用於資料庫的建立，不考慮輸入資料的檢查等，內部使用
//  */
// async function _createCardBody({
//   cardId,
//   root,
//   userId,
// }: {
//   cardId: string
//   root: RootBulletDraft
//   userId: string
// }): Promise<[CardBody, CardBodyContent]> {
//   const timestamp = Date.now()
//   const cur = await getLatestCardBody(cardId)
//   const nextRoot = await runBulletOp({
//     cardId: cardId,
//     current: cur ? (cur.content as unknown as CardBodyContent).value : undefined,
//     draft: root,
//     timestamp,
//     userId,
//   })
//   const nextContent: CardBodyContent = { value: nextRoot }
//   const body = await prisma.cardBody.create({
//     data: {
//       timestamp,
//       // content: JSON.stringify(nextContent), // TODO: serializer
//       content: nextContent,
//       card: { connect: { id: cardId } },
//       user: { connect: { id: userId } },
//       prev: cur ? { connect: { id: cur.id } } : undefined,
//     },
//   })
//   return [body, nextContent]
// }

// /**
//  * 創card body的標準method，針對self, mirrors一起輸入創建，會進行輸入資料的檢查，
//  * 沒問題後先創mirrors的card body，再創self的card body
//  *
//  * 步驟：
//  * - 檢查此卡片是否允許mirrors
//  * - 對每個mirror，做完以下步驟後存成entry
//  *   - 沒有op，代表此mirror無更新，忽略
//  *   - 是新卡，創card、創body
//  *   - 非新卡，創body
//  * - 對mirrors本身增加、刪除
//  *   - TODO: 需記錄標示
//  * - 儲存
//  *   - self有更新？ -> 存新的self、或存cur self
//  *   - mirrors有更新？ -> 存新的mirros、或存cur mirrors
//  *   - self, mirrors皆無更新 -> 不儲存
//  *
//  * @throws 輸入資料有問題時會報錯，用try-catch方式創card body
//  */
// export async function createCardDoc({
//   cardId,
//   doc,
//   userId,
// }: {
//   cardId: string
//   doc: Doc
//   // bullets: NestedNode<Bullet>[]
//   userId: string
// }): Promise<CardDoc> {

//   doc.check()

//   const body = await getLatestCardBody(cardId)
//   if (body === null) {
//     throw new Error('Card body not found')
//   }
//   const card = await prisma.card.findUnique({ where: { id: cardId } })
//   if (card === null) {
//     throw new Error('Card not found')
//   }

//   const pruned = BulletNode.prune(root)
//   if (pruned && isRootBulletDraft(pruned)) {
//     const checked = await checkDraft(pruned)
//     return await _createCardBody({
//       cardId: card.id,
//       root: checked.draft,
//       userId,
//     })
//   } else {
//     throw 'Require pruned bullet to be root bulletdraft'
//   }
// }

const createCardByURL = async ({ url }: { url: string }) => {
  const { link } = await getOrCreateLink({ url })
}
