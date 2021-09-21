import { Hashtag as PrismaHashtag, HashtagStatus, Poll, PollCount } from '@prisma/client'
import prisma from '../prisma'
import { Hashtag, HashtagDraft, HashtagGroup, HashtagGroupDraft } from './types'

// class HashtagOperation {
//   public static check() {}
//   public static parse() {}
//   pubkic static
// }

// async function runHashtagGroupOp(props: {
//   draft: HashtagGroupDraft
//   bulletId: number
//   cardId: number
//   userId: string
// }): Promise<HashtagGroup> {
//   const { draft, bulletId, cardId, userId } = props

//   switch (draft.op) {
//     // case 'DELETE':
//     //   throw 'Not implemented'
//     // case 'UPDATE':
//     //   throw 'Not implemented'
//     case 'CREATE': {
//       const hashtag = await prisma.hashtag.create({
//         data: {
//           bullet: { connect: { id: bulletId } },
//           card: { connect: { id: cardId } },
//           user: { connect: { id: userId } },
//           count: { create: {} },
//           poll: { create: { user: { connect: { id: userId } }, choices: draft.pollChoices, count: { create: {} } } },
//           text: hashtagGroupToString(draft),
//         },
//         include: { poll: true },
//       })
//       if (hashtag.poll) {
//         return {
//           type: 'hashtag-group',
//           ...hashtag,
//           poll: { ...hashtag.poll },
//         }
//       }
//       throw 'Database unexpected error'
//     }
//   }
//   throw 'Not implemented'
// }

// async function runHashtagOp(props: {
//   draft: HashtagDraft
//   bulletId: number
//   cardId: number
//   userId: string
// }): Promise<Hashtag> {
//   const { draft, bulletId, cardId, userId } = props

//   let hashtag = draft.id ? await prisma.hashtag.findUnique({ where: { id: draft.id } }) : undefined

//   if (hashtag === null) {
//     throw new Error('給予的 id 找不到 hashtag')
//   }
//   if (hashtag !== undefined && hashtag !== null && hashtag.userId !== userId) {
//     throw new Error('權限不足: 只可以修改自己創的 hashtag')
//   }

//   switch (draft.op) {
//     case 'DELETE':
//       if (hashtag) {
//         hashtag = await prisma.hashtag.update({
//           data: { status: HashtagStatus.DELETE },
//           where: { id: hashtag.id },
//         })
//       }
//       break
//     case 'UPDATE':
//       if (hashtag) {
//         hashtag = await prisma.hashtag.update({
//           data: { text: draft.text },
//           where: { id: hashtag.id },
//         })
//       }
//       break
//     case 'CREATE':
//       hashtag = await prisma.hashtag.create({
//         data: {
//           bullet: { connect: { id: bulletId } },
//           card: { connect: { id: cardId } },
//           user: { connect: { id: userId } },
//           count: { create: {} },
//           text: draft.text,
//         },
//       })
//       break
//   }

//   if (hashtag) {
//     return {
//       type: 'hashtag',
//       ...hashtag,
//     }
//   }
//   throw 'unexpected error'
// }

// export async function runHastagOpBatch(props: {
//   hashtags: (Hashtag | HashtagDraft | HashtagGroup | HashtagGroupDraft)[]
//   bulletId: number
//   cardId: number
//   userId: string
// }): Promise<(Hashtag | HashtagGroup)[]> {
//   const { hashtags, bulletId, cardId, userId } = props
//   return await Promise.all(
//     hashtags.map(e => {
//       if (e.type === 'hashtag-group-draft') {
//         return runHashtagGroupOp({ draft: e, bulletId, cardId, userId })
//       }
//       if (e.type === 'hashtag-draft') {
//         return runHashtagOp({ draft: e, bulletId, cardId, userId })
//       }
//       return e
//     }),
//   )
// }

// export function getLinkHashtag(bullet: Bullet | BulletDraft) {
//   return bullet.hashtags?.find(e => e.linkBullet)
// }

// function toHashtag(board: Board): Hashtag {
//   return {
//     userId: board.userId,
//     boardId: board.id,
//     boardStatus: board.status,
//     text: board.hashtag,
//   }
// }

// /**
//  * 給予一個創好的board/hashtag，將他插入至對應的bullet並返回
//  * @throws 若找到復數個/零個bullet、若hashtag已經在bullet裡
//  *
//  * TODO: 所有的bullet editing應該要透過operation，而不應允許在其他地方（例如這裡）處理
//  */
// export function insertHashtag(props: { board: Board; root: RootBullet }): [Hashtag, RootBullet] {
//   const { board, root } = props
//   const _root = cloneDeep(root)
//   const found = Node.find({
//     node: _root,
//     matcher: n => n.id === board.bulletId,
//   })
//   if (found.length > 1) throw '找到超過1個bullets，無法插入hashtag'
//   if (found.length === 0) throw '找到0個bullets，無法插入hashtag'
//   const hashtag = toHashtag(board)
//   const [n] = found
//   if (n.hashtags) {
//     const found = n.hashtags.find(e => e.boardId === hashtag.boardId)
//     if (found) throw 'hashtag已經在bullet裡'
//     n.hashtags.push(hashtag)
//   } else {
//     n.hashtags = [hashtag]
//   }
//   return [hashtag, _root]
// }

/**
 * 將 hashtag 插入至給予的 root bullet 中，並在資料庫建立 board
 * 步驟：在給予的 root bullet 找欲插入的 bullet id、轉成 bullet draft、插入 hashtag draft、執行 bullet op、返回更新的root
 * @throws 若找到復數個/零個bullet、若hashtag已經在bullet裡
 *
 * TODO: 所有的 bullet editing 應該要透過 operation，而不應允許在其他地方（例如這裡）處理
 */
// export async function createHashtag(props: {
//   draft: HashtagDraft
//   root: RootBullet
//   bulletId: number
//   cardId: number
//   userId: string
// }): Promise<[Hashtag, RootBullet]> {
//   const { draft, root, bulletId, cardId, userId } = props
//   const rootDraft = Node.toDraft(root)
//   const found = Node.find({
//     node: rootDraft,
//     matcher: n => n.id === bulletId,
//   })
//   if (found.length > 1) throw '找到超過1個bullets，無法插入hashtag'
//   if (found.length === 0) throw '找到0個bullets，無法插入hashtag'
//   // In-place 修改node properties
//   const [n] = found
//   if (!isBulletDraft(n)) throw 'bullet需為draft'
//   n.hashtags = [...(n.hashtags ?? []), draft]
//   const updatedRoot = await runBulletOp({
//     current: root,
//     draft: rootDraft,
//     cardId,
//     userId,
//   })
//   // 從更新的bullet tree找回hashtag
//   const [updated] = Node.find({
//     node: updatedRoot,
//     matcher: n => n.id === bulletId,
//   })
//   const hashtag = updated.hashtags?.find(e => e.text === draft.text)
//   if (hashtag === undefined || isHashtagDraft(hashtag)) {
//     throw new Error()
//   }
//   return [hashtag, updatedRoot]
// }
