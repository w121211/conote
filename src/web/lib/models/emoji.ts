import { Emoji, EmojiCount, EmojiLike, LikeChoice } from '.prisma/client'
import { EmojiText } from '../../apollo/query.graphql'
import { deltaLike } from '../helpers'
import { getBotId } from '../models/user'
import prisma from '../prisma'

export async function upsertEmojiLike({
  choice,
  emojiId,
  userId,
}: {
  choice: LikeChoice
  emojiId: string
  userId: string
}): Promise<{
  like: EmojiLike
  count: EmojiCount
}> {
  const curCount = await prisma.emojiCount.findUnique({
    where: { emojiId },
  })
  if (curCount === null) {
    throw 'Database unexpected error'
  }

  const curLike = await prisma.emojiLike.findUnique({
    where: {
      userId_emojiId: { userId, emojiId },
    },
  })
  const nextLike = curLike
    ? await prisma.emojiLike.update({
        data: { choice },
        where: { id: curLike.id },
      })
    : await prisma.emojiLike.create({
        data: {
          choice,
          emoji: { connect: { id: emojiId } },
          user: { connect: { id: userId } },
        },
      })

  const { dUp, dDown } = deltaLike(nextLike, curLike ?? undefined)
  const nextCount = await prisma.emojiCount.update({
    data: {
      nUps: curCount.nUps + dUp,
      nDowns: curCount.nDowns + dDown,
    },
    where: { emojiId },
  })
  return { like: nextLike, count: nextCount }
}

export async function createEmoji(props: { bulletId: string; text: EmojiText; userId: string }): Promise<{
  emoji: Emoji & { count: EmojiCount }
  like: EmojiLike
}> {
  const { bulletId, text, userId } = props
  // const botId = await getBotId()
  // const bullet = await prisma.bullet.findUnique({
  //   where: { id: bulletId },
  //   include: { emojis: { include: { count: true } } },
  // })
  // if (bullet === null) {
  //   throw 'bullet not found'
  // }
  const found = await prisma.emoji.findUnique({
    where: { bulletId_text: { bulletId, text } },
  })
  if (found) {
    // emoji 已存在，upsert like
    const { like, count } = await upsertEmojiLike({ choice: LikeChoice.UP, emojiId: found.id, userId })
    return {
      emoji: {
        ...found,
        count,
      },
      like,
    }
  }

  // emoji 未存在，創 emoji & like
  const botId = await getBotId() // TODO: 目前僅限 bot 創 emoji
  const emoji = await prisma.emoji.create({
    data: {
      userId: botId,
      bulletId,
      text,
      count: { create: {} },
    },
  })
  const { like, count } = await upsertEmojiLike({ choice: LikeChoice.UP, emojiId: emoji.id, userId })
  return {
    emoji: {
      ...emoji,
      count,
    },
    like,
  }
}
