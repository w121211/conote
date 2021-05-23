/* eslint-disable no-await-in-loop */
// import * as _ from 'lodash';
// import dayjs from 'dayjs';
import * as PA from '@prisma/client'
import { Editor, DBLinker, Markerline } from '../../../lib/editor/src'
import prisma from '../prisma'
import { getOrCreateCardBySymbol } from './card'
import { createComment, CommentMeta } from './comment'
import { getBotId } from './user'
import { createOauthorVote } from './vote'

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
    if (e.options.indexOf(choice)) {
      choiceIdx = e.choiceIdx
      break
    }
  }
  if (choiceIdx === undefined) {
    throw new Error('所給的vote-choice非預設的那幾個')
  }

  // 取得卡片，找到對應的comment-id, poll-id
  const card = await getOrCreateCardBySymbol(mkln.nestedCard.symbol)
  const editor = new Editor(card.body.text, (card.body.meta as unknown) as Markerline[])

  // TODO: 這裡用botId找預設的poll <- 因為botId只建立了一個poll => 需要更好的檢查法
  const botId = await getBotId()
  const pollMkln = editor.getMarkerlines().find(e => e.pollId && e.commentId && e.createrId === botId)

  if (pollMkln === undefined || pollMkln.commentId === undefined || pollMkln.pollId === undefined) {
    // console.log(card)
    // console.log(card.body.meta)
    // console.log(editor.getMarkerlines())
    throw new Error('卡片中找不到預設poll')
  }

  // 創reply
  const reply = await prisma.reply.create({
    data: {
      text: `${mkln.str} ^[[${mkln.src}:${mkln.stampId}]]`,
      user: { connect: { id: userId } },
      oauthor: { connect: { name: mkln.oauthor } },
      count: { create: {} },
      comment: { connect: { id: pollMkln.commentId } },
    },
  })

  // 創vote
  createOauthorVote({
    choiceIdx,
    pollId: pollMkln.pollId,
    oauthorName: mkln.oauthor,
    userId,
  })

  return reply
}

export async function createCardBody(
  card: PA.Cocard,
  editor: Editor,
  userId: string,
  cardBodyId?: number,
): Promise<PA.CardBody> {
  const dict: Record<string, DBLinker> = {} // { [marker]: DBLinker }

  for (const e of editor.getMarkerlines()) {
    // TODO: 對於編輯過的marker也需要處理（？）
    if (e.new && e.stampId) {
      // 若是新的markerline，創anchor, comment等等
      // 創anchor
      const anchor = await prisma.anchor.create({
        data: {
          user: { connect: { id: userId } },
          cocard: { connect: { id: card.id } },
          count: { create: {} },
          path: e.stampId,
        },
      })

      // 創comment, poll, reply, shortcut-reply
      let commentId, pollId, replyId

      if (e.neatReply) {
        const reply = await createNeatReply(e, userId)
        replyId = reply.id
      } else {
        // Checking value
        if (!e.marker?.value) throw new Error()
        if (e.poll && !e.pollChoices) throw new Error()

        const comment = await createComment(
          userId,
          e.marker?.value,
          { inCardIds: [card.id] } as CommentMeta,
          e.pollChoices,
        )

        commentId = comment.id
        if ('poll' in comment) pollId = comment.poll?.id
      }

      dict[e.stampId] = { createrId: userId, anchorId: anchor.id, commentId, pollId, replyId }
    }
  }

  // （重要）將databse所創的資訊與markerlines同步
  editor.attachDblinker(dict)

  // 更新或創新body，連結prev-body，prev-body會自動與cocard斷開連結
  if (cardBodyId) {
    return await prisma.cardBody.update({
      data: {
        meta: (editor.getMarkerlines() as CardBodyMeta) as any,
        text: editor.getText(),
      },
      where: { id: cardBodyId },
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

export async function createWebCardBody(cocardId: number, text: string, userId: string): Promise<PA.CardBody> {
  // 創web-card
  const card = await prisma.cocard.findUnique({ where: { id: cocardId }, include: { body: true, link: true } })
  if (card === null) throw new Error(`找不到cocard: id=${cocardId}`)
  if (card.link.oauthorName === null) throw new Error(`web-card需要有oauthor`)

  const editor = new Editor(
    card.body.text,
    (card.body.meta as unknown) as Markerline[],
    card.linkUrl,
    card.link.oauthorName,
  )
  editor.setText(text)
  editor.flush()

  // 創nested-symbol-card
  for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
    const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)
    const nestedEditor = new Editor(
      nestedCard.body.text,
      (nestedCard.body.meta as unknown) as Markerline[],
      // card.linkUrl,
      // card.link.oauthorName,
    )
    nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new && !e.neatReply))
    nestedEditor.flush()
    await createCardBody(nestedCard, nestedEditor, userId)
  }

  // 必須在最後才創root-card，不然markerlines的new標記會被刪除，因為已經儲存
  return await createCardBody(card, editor, userId)
  // try {
  //   return await createCardBody(card, editor, userId)
  // } catch (err) {
  //   console.error(err)
  // }
}
