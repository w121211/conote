import {
  DiscussEmoji,
  DiscussEmojiCount,
  DiscussEmojiLike,
  DiscussPostEmoji,
  DiscussPostEmojiCount,
  DiscussPostEmojiLike,
  EmojiCode,
  NoteEmoji,
  NoteEmojiCount,
  NoteEmojiLike,
} from '@prisma/client'
import prisma from '../prisma'

type Emoji = DiscussEmoji | DiscussPostEmoji | NoteEmoji

type EmojiCount = DiscussEmojiCount | DiscussPostEmojiCount | NoteEmojiCount

type EmojiLike = DiscussEmojiLike | DiscussPostEmojiLike | NoteEmojiLike

interface PrismaEmoji<T extends Emoji, U extends EmojiCount, V extends EmojiLike> {
  emojiCreate: (subjId: string | number, code: EmojiCode) => Promise<T>

  emojiFindUnique: (subjId: string | number, code: EmojiCode) => Promise<T | null>

  emojiLikeCreate: (emojiId: number, userId: string, liked: boolean) => Promise<V>

  emojiCountFindUnique: (emojiId: number) => Promise<U | null>

  emojiCountUpdate: (emojiCountId: number, nUps: number) => Promise<U>

  emojiLikeFindUnique: (emojiId: number, userId: string) => Promise<V | null>

  emojiLikeUpdate: (emojiLikeId: number, liked: boolean) => Promise<V>
}

const compareEmojiLike = <T extends EmojiLike>(like: T, prevLike?: T): { dUp: number } => {
  let dUp = 0
  if (prevLike) {
    if (prevLike.liked) {
      dUp -= 1
    }
  }
  if (like.liked) {
    dUp += 1
  }
  return { dUp }
}

class EmojiModelFactory<T extends Emoji, U extends EmojiCount, V extends EmojiLike> {
  prismaEmoji: PrismaEmoji<T, U, V>

  constructor(prismaEmoji: PrismaEmoji<T, U, V>) {
    this.prismaEmoji = prismaEmoji
  }

  async create(
    subjId: string | number,
    code: EmojiCode,
    userId: string,
  ): Promise<{
    emoji: T & { count: U }
    like: V
  }> {
    const found = await this.prismaEmoji.emojiFindUnique(subjId, code)
    if (found) {
      // emoji existed, upsert like
      const { like, count } = await this.upsertLike({ liked: true, emojiId: found.id, userId })
      return {
        emoji: { ...found, count },
        like,
      }
    }

    // emoji not exist, create emoji & like
    const emoji = await this.prismaEmoji.emojiCreate(subjId, code)
    const { like, count } = await this.upsertLike({ liked: true, emojiId: emoji.id, userId })
    return {
      emoji: { ...emoji, count },
      like,
    }
  }

  async upsertLike({ liked, emojiId, userId }: { liked: boolean; emojiId: number; userId: string }): Promise<{
    like: V
    count: U
  }> {
    const curCount = await this.prismaEmoji.emojiCountFindUnique(emojiId)
    if (curCount === null) {
      throw 'Database unexpected error'
    }

    const curLike = await this.prismaEmoji.emojiLikeFindUnique(emojiId, userId)
    const nextLike = curLike
      ? await this.prismaEmoji.emojiLikeUpdate(curLike.id, liked)
      : await this.prismaEmoji.emojiLikeCreate(emojiId, userId, liked)

    const { dUp } = compareEmojiLike(nextLike, curLike ?? undefined)
    const nextCount = await this.prismaEmoji.emojiCountUpdate(curCount.id, curCount.nUps + dUp)

    return { like: nextLike, count: nextCount }
  }
}

const DiscussPrismaEmoji: PrismaEmoji<DiscussEmoji, DiscussEmojiCount, DiscussEmojiLike> = {
  emojiCreate(subjId, code) {
    if (typeof subjId === 'number') {
      throw "typeof subjId === 'number'"
    }
    return prisma.discussEmoji.create({
      data: {
        discuss: { connect: { id: subjId } },
        code,
        count: { create: {} },
      },
    })
  },
  emojiFindUnique(subjId, code) {
    if (typeof subjId === 'number') {
      throw "typeof subjId === 'number'"
    }
    return prisma.discussEmoji.findUnique({
      where: { code_discussId: { code, discussId: subjId } },
    })
  },
  emojiCountFindUnique(emojiId) {
    return prisma.discussEmojiCount.findUnique({
      where: { discussEmojiId: emojiId },
    })
  },
  emojiCountUpdate(emojiCountId, nUps) {
    return prisma.discussEmojiCount.update({
      data: { nUps },
      where: { id: emojiCountId },
    })
  },
  emojiLikeCreate(emojiId, userId, liked) {
    return prisma.discussEmojiLike.create({
      data: {
        liked,
        discussEmoji: { connect: { id: emojiId } },
        user: { connect: { id: userId } },
      },
    })
  },
  emojiLikeFindUnique(emojiId, userId) {
    return prisma.discussEmojiLike.findUnique({
      where: { discussEmojiId_userId: { discussEmojiId: emojiId, userId } },
    })
  },
  emojiLikeUpdate(emojiLikeId, liked) {
    return prisma.discussEmojiLike.update({
      data: { liked },
      where: { id: emojiLikeId },
    })
  },
}

const DiscussPostPrismaEmoji: PrismaEmoji<DiscussPostEmoji, DiscussPostEmojiCount, DiscussPostEmojiLike> = {
  emojiCreate(subjId, code) {
    if (typeof subjId === 'string') {
      throw "typeof subjId === 'string'"
    }
    return prisma.discussPostEmoji.create({
      data: {
        discussPost: { connect: { id: subjId } },
        code,
        count: { create: {} },
      },
    })
  },
  emojiFindUnique(subjId, code) {
    if (typeof subjId === 'string') {
      throw "typeof subjId === 'string'"
    }
    return prisma.discussPostEmoji.findUnique({
      where: { code_discussPostId: { code, discussPostId: subjId } },
    })
  },
  emojiCountFindUnique(emojiId) {
    return prisma.discussPostEmojiCount.findUnique({
      where: { discussPostEmojiId: emojiId },
    })
  },
  emojiCountUpdate(emojiCountId, nUps) {
    return prisma.discussPostEmojiCount.update({
      data: { nUps },
      where: { id: emojiCountId },
    })
  },
  emojiLikeCreate(emojiId, userId, liked) {
    return prisma.discussPostEmojiLike.create({
      data: {
        liked,
        discussPostEmoji: { connect: { id: emojiId } },
        user: { connect: { id: userId } },
      },
    })
  },
  emojiLikeFindUnique(emojiId, userId) {
    return prisma.discussPostEmojiLike.findUnique({
      where: { userId_discussPostEmojiId: { discussPostEmojiId: emojiId, userId } },
    })
  },
  emojiLikeUpdate(emojiLikeId, liked) {
    return prisma.discussPostEmojiLike.update({
      data: { liked },
      where: { id: emojiLikeId },
    })
  },
}

const NotePrismaEmoji: PrismaEmoji<NoteEmoji, NoteEmojiCount, NoteEmojiLike> = {
  emojiCreate(subjId, code) {
    if (typeof subjId === 'number') {
      throw "typeof subjId === 'number'"
    }
    return prisma.noteEmoji.create({
      data: {
        note: { connect: { id: subjId } },
        code,
        count: { create: {} },
      },
    })
  },
  emojiFindUnique(subjId, code) {
    if (typeof subjId === 'number') {
      throw "typeof subjId === 'number'"
    }
    return prisma.noteEmoji.findUnique({
      where: { noteId_code: { code, noteId: subjId } },
    })
  },
  emojiCountFindUnique(emojiId) {
    return prisma.noteEmojiCount.findUnique({
      where: { noteEmojiId: emojiId },
    })
  },
  emojiCountUpdate(emojiCountId, nUps) {
    return prisma.noteEmojiCount.update({
      data: { nUps },
      where: { id: emojiCountId },
    })
  },
  emojiLikeCreate(emojiId, userId, liked) {
    return prisma.noteEmojiLike.create({
      data: {
        liked,
        noteEmoji: { connect: { id: emojiId } },
        user: { connect: { id: userId } },
      },
    })
  },
  emojiLikeFindUnique(emojiId, userId) {
    return prisma.noteEmojiLike.findUnique({
      where: { noteEmojiId_userId: { noteEmojiId: emojiId, userId } },
    })
  },
  emojiLikeUpdate(emojiLikeId, liked) {
    return prisma.noteEmojiLike.update({
      data: { liked },
      where: { id: emojiLikeId },
    })
  },
}

export const DiscussEmojiModel = new EmojiModelFactory(DiscussPrismaEmoji)

export const DiscussPostEmojiModel = new EmojiModelFactory(DiscussPostPrismaEmoji)

export const NoteEmojiModel = new EmojiModelFactory(NotePrismaEmoji)
