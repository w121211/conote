/* eslint-disable no-await-in-loop */
// import * as _ from 'lodash';
// import dayjs from 'dayjs';
import * as PA from '@prisma/client'
import { Editor, DBLinker, Markerline } from '../../../lib/editor/src'
import prisma from '../prisma'
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
<<<<<<< HEAD
  const pollMkln = editor
    .getMarkerlines()
    .find(async e => e.pollId && e.commentId && e.createrId === (await getBotId()))
  if (pollMkln === undefined || pollMkln.commentId === undefined) {
=======

  // TODO: 這裡適用botId找預設的poll ie botId只建立了一個poll
  const botId = await getBotId()
  const pollMkln = editor.getMarkerlines().find(e => e.pollId && e.commentId && e.createrId === botId)
  // .find(async e => e.pollId && e.commentId && e.createrId === (await getBotId()))
  if (pollMkln === undefined || pollMkln.commentId === undefined) {
    // console.log(card)
    // console.log(card.body.meta)
    console.log(editor.getMarkerlines())
>>>>>>> backend-dev
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
<<<<<<< HEAD
  bodyId?: number,
=======
  cardBodyId?: number,
>>>>>>> backend-dev
): Promise<PA.CardBody> {
  const dict: Record<string, DBLinker> = {} // { [marker]: DBLinker }

  for (const e of editor.getMarkerlines()) {
    // TODO: 對於編輯過的marker也需要處理（？）
    if (e.new && e.stampId) {
      // 若是新的markerline，創anchor, comment等等
<<<<<<< HEAD

=======
>>>>>>> backend-dev
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
<<<<<<< HEAD
        try {
          const reply = await createNeatReply(e, userId)
          replyId = reply.id
        } catch (err) {
          console.error(err)
        }
=======
        const reply = await createNeatReply(e, userId)
        replyId = reply.id
>>>>>>> backend-dev
      }

      dict[e.stampId] = { createrId: userId, anchorId: anchor.id, commentId, pollId, replyId }
    }
  }

  // （重要）將databse所創的資訊與markerlines同步
  editor.attachDblinker(dict)

  // 更新或創新body，連結prev-body，prev-body會自動與cocard斷開連結
<<<<<<< HEAD
  if (bodyId) {
=======
  if (cardBodyId) {
>>>>>>> backend-dev
    return await prisma.cardBody.update({
      data: {
        meta: (editor.getMarkerlines() as CardBodyMeta) as any,
        text: editor.getText(),
      },
<<<<<<< HEAD
      where: { id: bodyId },
=======
      where: { id: cardBodyId },
>>>>>>> backend-dev
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

<<<<<<< HEAD
export async function createWebCardBody(id: number, text: string, userId: string): Promise<PA.CardBody> {
  // 創web-card
  // const [link] = await getOrCreateLink(url)
  // const card = await getOrCreateCardByLink(link)
  const card = await prisma.cocard.findUnique({ where: { id }, include: { body: true } })
  if (card === null) {
    throw new Error(`找不到cocard: id=${id}`)
  }

  const editor = new Editor(card.body.text, (card.body.meta as unknown) as Markerline[], card.linkUrl)
=======
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
>>>>>>> backend-dev
  editor.setText(text)
  editor.flush()

  // 創nested-symbol-card
  for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
    const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)
<<<<<<< HEAD
    const nestedEditor = new Editor(nestedCard.body.text)
=======
    const nestedEditor = new Editor(
      nestedCard.body.text,
      (nestedCard.body.meta as unknown) as Markerline[],
      // card.linkUrl,
      // card.link.oauthorName,
    )
>>>>>>> backend-dev
    nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new && !e.neatReply))
    nestedEditor.flush()
    await createCardBody(nestedCard, nestedEditor, userId)
  }

  // 必須在最後才創root-card，不然markerlines的new標記會被刪除，因為已經儲存
  return await createCardBody(card, editor, userId)
<<<<<<< HEAD
=======
  // try {
  //   return await createCardBody(card, editor, userId)
  // } catch (err) {
  //   console.error(err)
  // }
>>>>>>> backend-dev
}
