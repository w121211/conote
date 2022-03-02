import { LikeChoice, NoteEmoji, NoteEmojiCount, NoteEmojiLike } from '@prisma/client'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import prisma from '../prisma'
import { EmojiLike } from './emoji-like-model'

export const NoteEmojiModel = {
  async create({ noteId, code, userId }: { noteId: string; code: EmojiCode; userId: string }): Promise<{
    emoji: NoteEmoji & { count: NoteEmojiCount }
    like: NoteEmojiLike
  }> {
    const found = await prisma.noteEmoji.findUnique({
      where: { noteId_code: { noteId, code } },
    })
    if (found) {
      // emoji existed, upsert like
      const { like, count } = await this.upsertLike({ choice: LikeChoice.UP, noteEmojiId: found.id, userId })
      return {
        emoji: { ...found, count },
        like,
      }
    }
    // emoji not exist, create emoji & like
    const emoji = await prisma.noteEmoji.create({
      data: {
        note: { connect: { id: noteId } },
        code,
        count: { create: {} },
      },
    })
    const { like, count } = await this.upsertLike({ choice: LikeChoice.UP, noteEmojiId: emoji.id, userId })
    return {
      emoji: { ...emoji, count },
      like,
    }
  },

  async upsertLike({
    choice,
    noteEmojiId,
    userId,
  }: {
    choice: LikeChoice
    noteEmojiId: string
    userId: string
  }): Promise<{
    like: NoteEmojiLike
    count: NoteEmojiCount
  }> {
    const curCount = await prisma.noteEmojiCount.findUnique({
      where: { noteEmojiId },
    })
    if (curCount === null) {
      throw 'Database unexpected error'
    }

    const curLike = await prisma.noteEmojiLike.findUnique({
      where: {
        userId_noteEmojiId: { userId, noteEmojiId },
      },
    })
    const nextLike = curLike
      ? await prisma.noteEmojiLike.update({
          data: { choice },
          where: { id: curLike.id },
        })
      : await prisma.noteEmojiLike.create({
          data: {
            choice,
            noteEmoji: { connect: { id: noteEmojiId } },
            user: { connect: { id: userId } },
          },
        })

    const { dUp } = EmojiLike.compareOld(nextLike, curLike ?? undefined)
    const nextCount = await prisma.noteEmojiCount.update({
      data: {
        nUps: curCount.nUps + dUp,
        // nDowns: curCount.nDowns + dDown,
      },
      where: { id: curCount.id },
    })
    return { like: nextLike, count: nextCount }
  },
}
