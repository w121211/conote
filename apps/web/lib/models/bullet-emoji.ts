import { BulletEmoji, BulletEmojiCount, BulletEmojiLike, LikeChoice } from '@prisma/client'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import prisma from '../prisma'
import { EmojiLike } from './emoji-like'

export const BulletEmojiModel = {
  async create({ bulletId, code, userId }: { bulletId: string; code: EmojiCode; userId: string }): Promise<{
    emoji: BulletEmoji & { count: BulletEmojiCount }
    like: BulletEmojiLike
  }> {
    const found = await prisma.bulletEmoji.findUnique({
      where: { bulletId_code: { bulletId, code } },
    })
    if (found) {
      // emoji existed, upsert like
      const { like, count } = await this.upsertLike({ choice: LikeChoice.UP, bulletEmojiId: found.id, userId })
      return {
        emoji: { ...found, count },
        like,
      }
    }
    // emoji not exist, create emoji & like
    const emoji = await prisma.bulletEmoji.create({
      data: {
        bullet: { connect: { id: bulletId } },
        code,
        count: { create: {} },
      },
    })
    const { like, count } = await this.upsertLike({ choice: LikeChoice.UP, bulletEmojiId: emoji.id, userId })
    return {
      emoji: { ...emoji, count },
      like,
    }
  },

  async upsertLike({
    choice,
    bulletEmojiId,
    userId,
  }: {
    choice: LikeChoice
    bulletEmojiId: string
    userId: string
  }): Promise<{
    like: BulletEmojiLike
    count: BulletEmojiCount
  }> {
    const curCount = await prisma.bulletEmojiCount.findUnique({
      where: { bulletEmojiId },
    })
    if (curCount === null) {
      throw 'Database unexpected error'
    }

    const curLike = await prisma.bulletEmojiLike.findUnique({
      where: {
        userId_bulletEmojiId: { userId, bulletEmojiId },
      },
    })
    const nextLike = curLike
      ? await prisma.bulletEmojiLike.update({
          data: { choice },
          where: { id: curLike.id },
        })
      : await prisma.bulletEmojiLike.create({
          data: {
            choice,
            bulletEmoji: { connect: { id: bulletEmojiId } },
            user: { connect: { id: userId } },
          },
        })

    const { dUp, dDown } = EmojiLike.compare(nextLike, curLike ?? undefined)
    const nextCount = await prisma.bulletEmojiCount.update({
      data: {
        nUps: curCount.nUps + dUp,
        nDowns: curCount.nDowns + dDown,
      },
      where: { id: curCount.id },
    })
    return { like: nextLike, count: nextCount }
  },
}
