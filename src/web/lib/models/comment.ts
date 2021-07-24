import { Comment, Poll } from '@prisma/client'
import prisma from '../prisma'

interface CardStamp {
  cardId: number
  stamp: string
}

export interface CommentMeta {
  // 每個card都帶有一個comment作為discuss-board
  cardId?: number
  // card-body有此comment，不包含dicuss-board的卡片
  inCardIds: number[]
}

// export async function createComment(
//   userId: string,
//   text: string,
//   meta?: CommentMeta,
//   pollChoices?: string[],
// ): Promise<(Comment & { poll: Poll | null }) | Comment> {
//   let comment: (Comment & { poll: Poll | null }) | Comment
//   if (pollChoices) {
//     comment = await prisma.comment.create({
//       data: {
//         meta: meta as any,
//         text,
//         user: { connect: { id: userId } },
//         count: { create: {} },
//         poll: {
//           create: {
//             user: { connect: { id: userId } },
//             choices: pollChoices,
//             count: {
//               create: {
//                 nVotes: pollChoices.map<number>(_e => 0),
//               },
//             },
//           },
//         },
//       },
//       include: { poll: true },
//     })
//   } else {
//     comment = await prisma.comment.create({
//       data: {
//         meta: meta as any,
//         text,
//         user: { connect: { id: userId } },
//         count: { create: {} },
//       },
//     })
//   }
//   return comment
// }
