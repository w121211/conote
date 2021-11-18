import { CardEmoji, CardEmojiCount, CardEmojiLike, LikeChoice } from '.prisma/client'
import { EmojiCode } from '../../apollo/query.graphql'
import prisma from '../prisma'
import { EmojiLike } from './emoji-like'

export const CardEmojiModel = {
  async create({ cardId, code, userId }: { cardId: string; code: EmojiCode; userId: string }): Promise<{
    emoji: CardEmoji & { count: CardEmojiCount }
    like: CardEmojiLike
  }> {
    const found = await prisma.cardEmoji.findUnique({
      where: { cardId_code: { cardId, code } },
    })
    if (found) {
      // emoji existed, upsert like
      const { like, count } = await this.upsertLike({ choice: LikeChoice.UP, cardEmojiId: found.id, userId })
      return {
        emoji: { ...found, count },
        like,
      }
    }
    // emoji not exist, create emoji & like
    const emoji = await prisma.cardEmoji.create({
      data: {
        card: { connect: { id: cardId } },
        code,
        count: { create: {} },
      },
    })
    const { like, count } = await this.upsertLike({ choice: LikeChoice.UP, cardEmojiId: emoji.id, userId })
    return {
      emoji: { ...emoji, count },
      like,
    }
  },

  async upsertLike({
    choice,
    cardEmojiId,
    userId,
  }: {
    choice: LikeChoice
    cardEmojiId: string
    userId: string
  }): Promise<{
    like: CardEmojiLike
    count: CardEmojiCount
  }> {
    const curCount = await prisma.cardEmojiCount.findUnique({
      where: { cardEmojiId },
    })
    if (curCount === null) {
      throw 'Database unexpected error'
    }

    const curLike = await prisma.cardEmojiLike.findUnique({
      where: {
        userId_cardEmojiId: { userId, cardEmojiId },
      },
    })
    const nextLike = curLike
      ? await prisma.cardEmojiLike.update({
          data: { choice },
          where: { id: curLike.id },
        })
      : await prisma.cardEmojiLike.create({
          data: {
            choice,
            cardEmoji: { connect: { id: cardEmojiId } },
            user: { connect: { id: userId } },
          },
        })

    const { dUp, dDown } = EmojiLike.compare(nextLike, curLike ?? undefined)
    const nextCount = await prisma.cardEmojiCount.update({
      data: {
        nUps: curCount.nUps + dUp,
        nDowns: curCount.nDowns + dDown,
      },
      where: { id: curCount.id },
    })
    return { like: nextLike, count: nextCount }
  },
}
