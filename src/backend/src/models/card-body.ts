/* eslint-disable no-await-in-loop */
// import * as _ from 'lodash';
// import dayjs from 'dayjs';
import * as PA from '@prisma/client'
import { Editor, DBLinker, Markerline } from '../../../lib/editor/src'
import { prisma } from '../context'
import { getBotId } from './user'
import { getOrCreateCardBySymbol } from './card'
import { CommentMeta } from './comment'

export type CardBodyMeta = Markerline[]

const NEAT_REPLY_CHOICE = [
  { options: ['<BUY>', '<B>', '<買>', '<LONG>', '<L>', '<多>', '<看多>'], choiceIdx: 0 },
  { options: ['<SELL>', '<S>', '<買>', '<SHORT>', '<空>', '<看空>'], choiceIdx: 1 },
]

async function createNeatReply(mkln: Markerline, userId: string): Promise<PA.Reply> {
  // 適用條件：在webcard裡幫oauther針對某個symbol的快速投票 -> 必須有投票
  if (!mkln.neatReply) throw new Error('非neatReply')
  if (!mkln.src) throw new Error('缺src')
  if (!mkln.stampId) throw new Error('缺stampId')
  if (!mkln.pollChoices) throw new Error('缺pollChoices')
  if (mkln.pollChoices.length !== 1) throw new Error('pollChoices的length不等於1')
  if (!mkln.nestedCard) throw new Error('缺nestedCard')
  if (!mkln.oauthor) throw new Error('缺oauthor')

  // neat-reply的choice需是預設的幾個
  const choice = mkln.pollChoices[0]
  let choiceIdx
  for (const e of NEAT_REPLY_CHOICE) {
    if (e.options.indexOf(choice)) choiceIdx = e.choiceIdx
  }
  if (choiceIdx === undefined) {
    throw new Error('所給的vote-choice非預設的那幾個')
  }

  // 取得卡片，找到對應的comment-id, poll-id
  const card = await getOrCreateCardBySymbol(mkln.nestedCard.symbol)
  const editor = new Editor(card.body.text, (card.body.meta as unknown) as Markerline[])
  const pollMkln = editor
    .getMarkerlines()
    .find(async e => e.pollId && e.commentId && e.createrId === (await getBotId()))
  if (pollMkln === undefined || pollMkln.commentId === undefined) {
    throw new Error('卡片中找不到預設poll')
  }

  // 創reply
  return await prisma.reply.create({
    data: {
      text: `${mkln.str} ^[[${mkln.src}:${mkln.stampId}]]`,
      user: { connect: { id: userId } },
      oauthor: { connect: { name: mkln.oauthor } },
      count: { create: {} },
      comment: { connect: { id: pollMkln.commentId } },
    },
  })

  // TODO: 創vote
  // prisma.vote.create()
}

export async function createCardBody(
  card: PA.Cocard,
  editor: Editor,
  userId: string,
  bodyId?: number,
): Promise<PA.CardBody> {
  const dict: Record<string, DBLinker> = {} // { [marker]: DBLinker }

  for (const e of editor.getMarkerlines()) {
    // TODO: 對於編輯過的marker也需要處理（？）
    if (e.new && e.stampId) {
      // 若是新的markerline，創anchor, comment等等

      // 創anchor
      const anchor = await prisma.anchor.create({
        data: {
          // user: { connect: { email: userEmail } },
          user: { connect: { id: userId } },
          cocard: { connect: { id: card.id } },
          // cocard: isOcard(card) ? undefined : { connect: { id: card.id } },
          // ocard: isOcard(card) ? { connect: { id: card.id } } : undefined,
          count: { create: {} },
          path: e.stampId,
        },
      })

      // 創comment, poll, reply, shortcut-reply
      let commentId, pollId, replyId
      if (e.poll && e.pollChoices && e.marker?.value) {
        const comment = await prisma.comment.create({
          data: {
            meta: ({ inCardIds: [card.id] } as CommentMeta) as any,
            text: e.marker?.value,
            user: { connect: { id: userId } },
            count: { create: {} },
            poll: {
              create: {
                choices: e.pollChoices,
                user: { connect: { id: userId } },
                count: { create: {} },
              },
            },
          },
          include: { poll: true },
        })
        commentId = comment.id
        pollId = comment.poll?.id
      } else if (e.comment && e.marker?.value) {
        const comment = await prisma.comment.create({
          data: {
            meta: ({ inCardIds: [card.id] } as CommentMeta) as any,
            text: e.marker?.value,
            user: { connect: { id: userId } },
            count: { create: {} },
          },
        })
        commentId = comment.id
      } else if (e.neatReply) {
        try {
          const reply = await createNeatReply(e, userId)
          replyId = reply.id
        } catch (err) {
          console.error(err)
        }
      }

      dict[e.stampId] = { createrId: userId, anchorId: anchor.id, commentId, pollId, replyId }
    }
  }

  // （重要）將databse所創的資訊與markerlines同步
  editor.attachDblinker(dict)

  // 更新或創新body，連結prev-body，prev-body會自動與cocard斷開連結
  if (bodyId) {
    return await prisma.cardBody.update({
      data: {
        meta: (editor.getMarkerlines() as CardBodyMeta) as any,
        text: editor.getText(),
      },
      where: { id: bodyId },
    })
  } else {
    return await prisma.cardBody.create({
      data: {
        meta: (editor.getMarkerlines() as CardBodyMeta) as any,
        text: editor.getText(),
        user: { connect: { id: userId } },
        cocard: { connect: { id: card.id } },
        prev: { connect: { id: card.bodyId } },
      },
    })
  }
}
