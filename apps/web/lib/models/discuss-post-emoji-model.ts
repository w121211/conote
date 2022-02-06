import { DiscussPostEmoji, DiscussPostEmojiCount, DiscussPostEmojiLike } from '@prisma/client'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import prisma from '../prisma'
import { EmojiLike } from './emoji-like-model'

export const DiscussPostEmojiModel = {
  async create({ discussPostId, code, userId }: { discussPostId: number; code: EmojiCode; userId: string }): Promise<{
    emoji: DiscussPostEmoji & { count: DiscussPostEmojiCount }
    like: DiscussPostEmojiLike
  }> {
    const found = await prisma.discussPostEmoji.findUnique({
      where: { discussPostId_code: { discussPostId, code } },
    })
    if (found) {
      // emoji existed, upsert like
      const { like, count } = await this.upsertLike({ liked: true, discussPostEmojiId: found.id, userId })
      return {
        emoji: { ...found, count },
        like,
      }
    }

    // emoji not exist, create emoji & like
    const emoji = await prisma.discussPostEmoji.create({
      data: {
        discussPost: { connect: { id: discussPostId } },
        code,
        count: { create: {} },
      },
    })
    const { like, count } = await this.upsertLike({ liked: true, discussPostEmojiId: emoji.id, userId })
    return {
      emoji: { ...emoji, count },
      like,
    }
  },

  async upsertLike({
    liked,
    discussPostEmojiId,
    userId,
  }: {
    liked: boolean
    discussPostEmojiId: number
    userId: string
  }): Promise<{
    like: DiscussPostEmojiLike
    count: DiscussPostEmojiCount
  }> {
    const curCount = await prisma.discussPostEmojiCount.findUnique({
      where: { discussPostEmojiId },
    })
    if (curCount === null) {
      throw 'Database unexpected error'
    }

    const curLike = await prisma.discussPostEmojiLike.findUnique({
      where: {
        userId_discussPostEmojiId: { userId, discussPostEmojiId },
      },
    })
    const nextLike = curLike
      ? await prisma.discussPostEmojiLike.update({
          data: { liked },
          where: { id: curLike.id },
        })
      : await prisma.discussPostEmojiLike.create({
          data: {
            liked,
            discussPostEmoji: { connect: { id: discussPostEmojiId } },
            user: { connect: { id: userId } },
          },
        })

    const { dUp } = EmojiLike.compare(nextLike, curLike ?? undefined)
    const nextCount = await prisma.discussPostEmojiCount.update({
      data: { nUps: curCount.nUps + dUp },
      where: { id: curCount.id },
    })
    return { like: nextLike, count: nextCount }
  },
}
