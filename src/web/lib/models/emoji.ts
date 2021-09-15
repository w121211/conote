import { Hashtag, HashtagCount, HashtagLike, LikeChoice } from '.prisma/client'
import { EmojiText } from '../../apollo/query.graphql'
import { deltaLike } from '../helper'
import { getBotId } from '../models/user'
import prisma from '../prisma'

function hasCount(obj: Hashtag & { count: HashtagCount | null }): obj is Hashtag & { count: HashtagCount } {
  return obj.count !== null
}

export async function upsertEmojiLike(props: { choice: LikeChoice; hashtagId: number; userId: string }): Promise<{
  like: HashtagLike
  count: HashtagCount
}> {
  const { choice, hashtagId, userId } = props
  const curCount = await prisma.hashtagCount.findUnique({
    where: { hashtagId },
  })
  if (curCount === null) {
    throw 'Database unexpected error'
  }

  const curLike = await prisma.hashtagLike.findUnique({
    where: {
      userId_hashtagId: {
        userId,
        hashtagId,
      },
    },
  })
  const nextLike = curLike
    ? await prisma.hashtagLike.update({
        data: { choice },
        where: { id: curLike.id },
      })
    : await prisma.hashtagLike.create({
        data: {
          choice,
          user: { connect: { id: userId } },
          hashtag: { connect: { id: hashtagId } },
        },
      })

  const { dUp, dDown } = deltaLike(nextLike, curLike ?? undefined)
  const nextCount = await prisma.hashtagCount.update({
    data: {
      nUps: curCount.nUps + dUp,
      nDowns: curCount.nDowns + dDown,
    },
    where: { hashtagId },
  })
  return { like: nextLike, count: nextCount }
}

export async function createEmoji(props: { bulletId: number; emojiText: EmojiText; userId: string }): Promise<{
  emoji: Hashtag & { count: HashtagCount }
  like: HashtagLike
}> {
  const { bulletId, emojiText, userId } = props
  const botId = await getBotId()
  const bullet = await prisma.bullet.findUnique({
    where: { id: bulletId },
    include: { hashtags: { include: { count: true } } },
  })
  if (bullet === null) {
    throw 'bullet not found'
  }

  const found = bullet?.hashtags.find(e => e.text === emojiText)
  if (found) {
    // 該 emoji 已存在，upsert like
    const { like, count } = await upsertEmojiLike({ choice: LikeChoice.UP, hashtagId: found.id, userId })
    return {
      emoji: {
        ...found,
        count,
      },
      like,
    }
  }

  // 創 emoji & like
  const hashtag = await prisma.hashtag.create({
    data: {
      userId: botId,
      bulletId,
      cardId: bullet.cardId,
      text: emojiText,
      count: { create: {} },
    },
  })
  const { like, count } = await upsertEmojiLike({ choice: LikeChoice.UP, hashtagId: hashtag.id, userId })
  return {
    emoji: {
      ...hashtag,
      count,
    },
    like,
  }
}
