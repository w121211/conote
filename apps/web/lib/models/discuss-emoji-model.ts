import { DiscussEmoji, DiscussEmojiCount, DiscussEmojiLike } from '@prisma/client'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import prisma from '../prisma'
import { EmojiLike } from './emoji-like-model'

export const DiscussEmojiModel = {
  async create({ discussId, code, userId }: { discussId: string; code: EmojiCode; userId: string }): Promise<{
    emoji: DiscussEmoji & { count: DiscussEmojiCount }
    like: DiscussEmojiLike
  }> {
    const found = await prisma.discussEmoji.findUnique({
      where: { discussId_code: { discussId, code } },
    })
    if (found) {
      // emoji existed, upsert like
      const { like, count } = await this.upsertLike({ liked: true, discussEmojiId: found.id, userId })
      return {
        emoji: { ...found, count },
        like,
      }
    }
    // emoji not exist, create emoji & like
    const emoji = await prisma.discussEmoji.create({
      data: {
        discuss: { connect: { id: discussId } },
        code,
        count: { create: {} },
      },
    })
    const { like, count } = await this.upsertLike({ liked: true, discussEmojiId: emoji.id, userId })
    return {
      emoji: { ...emoji, count },
      like,
    }
  },

  async upsertLike({
    liked,
    discussEmojiId,
    userId,
  }: {
    liked: boolean
    discussEmojiId: number
    userId: string
  }): Promise<{
    like: DiscussEmojiLike
    count: DiscussEmojiCount
  }> {
    const curCount = await prisma.discussEmojiCount.findUnique({
      where: { discussEmojiId },
    })
    if (curCount === null) {
      throw 'Database unexpected error'
    }

    const curLike = await prisma.discussEmojiLike.findUnique({
      where: {
        userId_discussEmojiId: { userId, discussEmojiId },
      },
    })
    const nextLike = curLike
      ? await prisma.discussEmojiLike.update({
          data: { liked },
          where: { id: curLike.id },
        })
      : await prisma.discussEmojiLike.create({
          data: {
            liked,
            discussEmoji: { connect: { id: discussEmojiId } },
            user: { connect: { id: userId } },
          },
        })

    const { dUp } = EmojiLike.compare(nextLike, curLike ?? undefined)
    const nextCount = await prisma.discussEmojiCount.update({
      data: { nUps: curCount.nUps + dUp },
      where: { id: curCount.id },
    })
    return { like: nextLike, count: nextCount }
  },
}
