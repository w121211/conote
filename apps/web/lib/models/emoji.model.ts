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

interface EmojiHelper<
  TEmoji extends Emoji,
  TEmojiCount extends EmojiCount,
  TEmojiLike extends EmojiLike,
> {
  emojiCreate: (subjId: string | number, code: EmojiCode) => Promise<TEmoji>

  emojiFindById: (id: number) => Promise<TEmoji | null>

  emojiFindUnique: (
    subjId: string | number,
    code: EmojiCode,
  ) => Promise<TEmoji | null>

  emojiLikeCreate: (
    emojiId: number,
    userId: string,
    liked: boolean,
  ) => Promise<TEmojiLike>

  emojiCountFindUnique: (emojiId: number) => Promise<TEmojiCount | null>

  emojiCountUpdate: (emojiCountId: number, nUps: number) => Promise<TEmojiCount>

  emojiLikeFindUnique: (
    emojiId: number,
    userId: string,
  ) => Promise<TEmojiLike | null>

  emojiLikeUpdate: (emojiLikeId: number, liked: boolean) => Promise<TEmojiLike>

  getSubjId: (emoji: TEmoji) => string | number
}

//
// Helpers
//
//
//
//
//
//

function compareEmojiLike<T extends EmojiLike>(like: T): { dUp: number } {
  const dUp = like.liked ? 1 : -1
  return { dUp }
}

const discussEmojiHelper: EmojiHelper<
  DiscussEmoji,
  DiscussEmojiCount,
  DiscussEmojiLike
> = {
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

  emojiFindById(id) {
    return prisma.discussEmoji.findUnique({ where: { id } })
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

  getSubjId(emoji) {
    return emoji.discussId
  },
}

const discussPostEmojiHelper: EmojiHelper<
  DiscussPostEmoji,
  DiscussPostEmojiCount,
  DiscussPostEmojiLike
> = {
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

  emojiFindById(id) {
    return prisma.discussPostEmoji.findUnique({ where: { id } })
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
      where: {
        userId_discussPostEmojiId: { discussPostEmojiId: emojiId, userId },
      },
    })
  },

  emojiLikeUpdate(emojiLikeId, liked) {
    return prisma.discussPostEmojiLike.update({
      data: { liked },
      where: { id: emojiLikeId },
    })
  },

  getSubjId(emoji) {
    return emoji.discussPostId
  },
}

const noteEmojiHelper: EmojiHelper<NoteEmoji, NoteEmojiCount, NoteEmojiLike> = {
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

  emojiFindById(id) {
    return prisma.noteEmoji.findUnique({ where: { id } })
  },

  emojiFindUnique(subjId, code) {
    if (typeof subjId === 'number') {
      throw "typeof subjId === 'number'"
    }
    return prisma.noteEmoji.findUnique({
      where: { code_noteId: { code, noteId: subjId } },
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

  getSubjId(emoji) {
    return emoji.noteId
  },
}

//
// Factory class
//
//
//
//
//
//

class EmojiModelFactory<
  TEmoji extends Emoji,
  TEmojiCount extends EmojiCount,
  TEmojiLike extends EmojiLike,
> {
  private helper: EmojiHelper<TEmoji, TEmojiCount, TEmojiLike>

  private upndownReverseCode: Record<string, EmojiCode> = {
    UP: 'DOWN',
    DOWN: 'UP',
  }

  constructor(helper: EmojiHelper<TEmoji, TEmojiCount, TEmojiLike>) {
    this.helper = helper
  }

  private async upsertEmojiLike(
    emojiId: number,
    userId: string,
    liked: boolean,
  ) {
    const curCount = await this.helper.emojiCountFindUnique(emojiId)
    if (curCount === null)
      throw new Error('Database unexpected error: curCount === null')

    const curLike = await this.helper.emojiLikeFindUnique(emojiId, userId),
      nextLike = curLike
        ? await this.helper.emojiLikeUpdate(curLike.id, liked)
        : await this.helper.emojiLikeCreate(emojiId, userId, liked),
      { dUp } = compareEmojiLike(nextLike),
      nextCount = await this.helper.emojiCountUpdate(
        curCount.id,
        curCount.nUps + dUp,
      )

    return { like: nextLike, count: nextCount }
  }

  /**
   * emojiToUnlike exist?
   * -> user-like on emoji-to-unlike exist?
   * -> user-like is true?
   * -> update user-like to false
   */
  private async upsertLikeOnUpndownEmoji(emojiToLike: TEmoji, userId: string) {
    if (!['UP', 'DOWN'].includes(emojiToLike.code)) {
      throw new Error('emoji.code not equals to UP or DOWN')
    }

    const results: {
      emoji: TEmoji
      count: TEmojiCount
      like: TEmojiLike
    }[] = []

    const subjId = this.helper.getSubjId(emojiToLike),
      reverseCode = this.upndownReverseCode[emojiToLike.code],
      emojiToUnlike =
        reverseCode && (await this.helper.emojiFindUnique(subjId, reverseCode)),
      emojiToUnlike_userLike =
        emojiToUnlike &&
        (await this.helper.emojiLikeFindUnique(emojiToUnlike.id, userId))

    if (emojiToUnlike && emojiToUnlike_userLike?.liked) {
      const { count, like } = await this.upsertEmojiLike(
        emojiToUnlike.id,
        userId,
        false,
      )
      results.push({ emoji: emojiToUnlike, count, like })
    }

    const { count, like } = await this.upsertEmojiLike(
      emojiToLike.id,
      userId,
      true,
    )
    results.push({ emoji: emojiToLike, count, like })

    return results
  }

  /**
   * Upsert like on an emoji, if emoji-id is not given, try to create an emoji by the given subj
   *
   * Special cases:
   * - like an 'upvote-emoji' will automatically unlike 'downvote-emoji' if possible, and vice versa
   *
   * @returns mutate emojis (with corresponding count and like)
   *
   */
  async upsertLike({
    userId,
    liked,
    emojiId,
    subj,
  }: {
    userId: string
    liked: boolean
    emojiId?: number
    subj?: {
      subjId: string | number
      code: EmojiCode
    }
  }): Promise<
    {
      emoji: TEmoji
      count: TEmojiCount
      like: TEmojiLike
    }[]
  > {
    if (emojiId === undefined && subj === undefined)
      throw new Error('emojiId === undefined && subj === undefined')

    let emoji: TEmoji | null | undefined
    if (emojiId) {
      emoji = await this.helper.emojiFindById(emojiId)
    } else if (emojiId === undefined && subj) {
      const { subjId, code } = subj,
        found = await this.helper.emojiFindUnique(subjId, code)
      emoji = found ?? (await this.helper.emojiCreate(subjId, code))
    }

    if (emoji === undefined || emoji === null)
      throw new Error('emoji === undefined || emoji === null')

    // Special case
    if ((emoji.code === 'UP' || emoji.code === 'DOWN') && liked === true) {
      return await this.upsertLikeOnUpndownEmoji(emoji, userId)
    }

    const { count, like } = await this.upsertEmojiLike(emoji.id, userId, liked)
    return [{ emoji, count, like }]
  }
}

export const discussEmojiModel = new EmojiModelFactory(discussEmojiHelper)

export const discussPostEmojiModel = new EmojiModelFactory(
  discussPostEmojiHelper,
)

export const noteEmojiModel = new EmojiModelFactory(noteEmojiHelper)
