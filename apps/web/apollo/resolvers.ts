import { inspect } from 'util'
import { AuthenticationError } from 'apollo-server-micro'
// import { compare, hash } from 'bcryptjs'
// import { getSession } from '@auth0/nextjs-auth0'
import {
  BulletEmoji,
  BulletEmojiCount,
  CardEmoji,
  CardEmojiCount,
  DiscussEmoji,
  DiscussEmojiCount,
  DiscussPostEmoji,
  DiscussPostEmojiCount,
} from '@prisma/client'
import { QueryResolvers, MutationResolvers } from 'graphql-let/__generated__/__types__'
import { isAuthenticated, sessionLogin, sessionLogout } from '../lib/auth/auth'
import fetcher from '../lib/fetcher/fetcher'
import { hasCount, toStringId } from '../lib/helpers'
import { BulletEmojiModel } from '../lib/models/bullet-emoji-model'
import { CardMeta, CardModel } from '../lib/models/card-model'
import { CardDigestModel } from '../lib/models/card-digest-model'
import { CardEmojiModel } from '../lib/models/card-emoji-model'
import { CardStateModel } from '../lib/models/card-state-model'
import { CommitModel } from '../lib/models/commit-model'
import { PollMeta } from '../lib/models/poll-model'
import { RateModel } from '../lib/models/rate-model'
import { getOrCreateUser } from '../lib/models/user-model'
import { createVote } from '../lib/models/vote-model'
import { DiscussEmojiModel } from '../lib/models/discuss-emoji-model'
import { DiscussPostEmojiModel } from '../lib/models/discuss-post-emoji-model'
import prisma from '../lib/prisma'
import { SearchDiscussService } from '../lib/search/search-discuss-service'
import { SearchSymbolService } from '../lib/search/search-symbol-service'
import { ResolverContext } from './apollo-client'
import { SearchAuthorService } from '../lib/search/search-author-service'

// function _deleteNull<T>(obj: T) {
//   let k: keyof T
//   for (k in obj) {
//     if (obj[k] === null) {
//       delete obj[k]
//     }
//   }
// }

// function _nullToUndefined<T>(obj: T): { [P in keyof T]: Exclude<T[P], null> } {
//   for (const k in obj) {
//     if (obj[k] === null) {
//       delete obj[k]
//     }
//   }
//   if (isNonNull(obj)) {
//     return obj
//   }
// }

// function isLocalAuthenticated(req: NextApiRequest, res: NextApiResponse): Session {
//   try {
//     return getLoginSession(req)
//   } catch (error) {
//     console.log(error)
//     removeTokenCookie(res)
//     throw new AuthenticationError('')
//   }
// }

// const isAuthenticated = (req: NextApiRequest, res: NextApiResponse): { userId: string; email: string } => {
//   const session = getSession(req, res)
//   if (session?.user && session.user.appUserId) {
//     return { userId: session.user.appUserId, email: session.user.email }
//   }
//   throw new AuthenticationError('Not authenticated')
// }

const Query: Required<QueryResolvers<ResolverContext>> = {
  async author(_parent, { id, name }, _context, _info) {
    if (id) {
      return await prisma.author.findUnique({
        where: { id },
      })
    }
    if (name) {
      return await prisma.author.findUnique({
        where: { name },
      })
    }
    throw 'Parameter input error'
  },

  async bullet(_parent, { id }, _context, _info) {
    return await prisma.bullet.findUnique({
      where: { id },
    })
  },

  async bulletEmojis(_parent, { bulletId }, _context, _info) {
    const emojis = (
      await prisma.bulletEmoji.findMany({
        // where: { AND: [{ card: { symbol } }, { status: HashtagStatus.ACTIVE }] },
        where: { bulletId },
        include: { count: true },
      })
    ).filter(
      (
        e,
      ): e is BulletEmoji & {
        count: BulletEmojiCount
      } => e.count !== null,
    )
    return emojis.map(e => {
      return {
        ...e,
        count: { ...toStringId(e.count) },
      }
    })
  },

  async card(_parent, { id, symbol, url }, _context, _info) {
    if (id && symbol === undefined && url === undefined) {
      return await CardModel.get(id)
    }
    if (symbol && id === undefined && url === undefined) {
      return await CardModel.getBySymbol(symbol)
    }
    if (url && id === undefined && symbol === undefined) {
      return await CardModel.getOrCreateByUrl({ scraper: fetcher, url })
    }
    throw 'Param requires to be either id, symbol or url'
  },

  async cardState(_parent, { id }, _context, _info) {
    return await CardStateModel.get(id)
  },

  async cardEmojis(_parent, { cardId }, _context, _info) {
    const emojis = (
      await prisma.cardEmoji.findMany({
        where: { cardId },
        include: { count: true },
      })
    ).filter(
      (
        e,
      ): e is CardEmoji & {
        count: CardEmojiCount
      } => e.count !== null,
    )
    return emojis.map(e => {
      return {
        ...e,
        count: { ...toStringId(e.count) },
      }
    })
  },

  // async cardMeta(_parent, { symbol }, _context, _info) {
  //   const card = await prisma.card.findUnique({
  //     where: { symbol },
  //     include: { link: true },
  //   })
  //   if (card === null) {
  //     throw `Card ${symbol} not found`
  //   }
  //   return card.meta as unknown as CardMeta
  //   // const meta: CardMeta = card.meta ? card.meta : {}
  //   // return meta
  // },

  async cardDigests(_parent, { afterCommitId }, _context, _info) {
    return await CardDigestModel.getLatest(afterCommitId ?? undefined)
  },

  async discuss(_parent, { id }, _context, _info) {
    const discuss = await prisma.discuss.findUnique({
      where: { id },
      include: { count: true },
    })
    if (discuss && discuss.count) {
      const a = {
        ...discuss,
        meta: {},
        count: { ...toStringId(discuss.count) },
      }
      return a
    }
    return null
  },

  async discussEmojis(_parent, { discussId }, _context, _info) {
    const emojis = (
      await prisma.discussEmoji.findMany({
        where: { discussId },
        include: { count: true },
      })
    ).filter(
      (
        e,
      ): e is DiscussEmoji & {
        count: DiscussEmojiCount
      } => e.count !== null,
    )
    return emojis.map(e => {
      return {
        ...e,
        id: e.id.toString(),
        count: { ...toStringId(e.count) },
      }
    })
  },

  async discussPosts(_parent, { discussId }, _context, _info) {
    const posts = (
      await prisma.discussPost.findMany({
        where: { discussId },
      })
    ).map(e => toStringId(e))
    return posts
  },

  async discussPostEmojis(_parent, { discussPostId }, _context, _info) {
    const emojis = (
      await prisma.discussPostEmoji.findMany({
        where: { discussPostId: parseInt(discussPostId) },
        include: { count: true },
      })
    ).filter(
      (
        e,
      ): e is DiscussPostEmoji & {
        count: DiscussPostEmojiCount
      } => e.count !== null,
    )
    return emojis.map(e => {
      return {
        ...toStringId(e),
        count: { ...toStringId(e.count) },
      }
    })
  },

  async link(_parent, { id, url }, _context, _info) {
    if (id) {
      return await prisma.link.findUnique({ where: { id } })
    }
    if (url) {
      return await prisma.link.findUnique({ where: { url } })
    }
    throw 'Param requires either id or url'
  },

  async me(_parent, _args, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    // const user = await getOrCreateUser(uid, email)
    // await prisma.user.findUnique({ where: { id: userId } })
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (user === null) {
      throw 'Unexpected error'
    }
    return user
  },

  async myBulletEmojiLike(_parent, { bulletEmojiId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const like = await prisma.bulletEmojiLike.findUnique({
      where: {
        userId_bulletEmojiId: { bulletEmojiId, userId },
      },
    })
    return like ? toStringId(like) : null
  },

  async myCardEmojiLike(_parent, { cardEmojiId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const like = await prisma.cardEmojiLike.findUnique({
      where: {
        userId_cardEmojiId: { cardEmojiId, userId },
      },
    })
    return like ? toStringId(like) : null
  },

  async myDiscussEmojiLike(_parent, { discussEmojiId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const like = await prisma.discussEmojiLike.findUnique({
      where: {
        userId_discussEmojiId: { discussEmojiId: parseInt(discussEmojiId), userId },
      },
    })
    return like ? toStringId(like) : null
  },

  async myDiscussPostEmojiLike(_parent, { discussPostEmojiId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const like = await prisma.discussPostEmojiLike.findUnique({
      where: {
        userId_discussPostEmojiId: { discussPostEmojiId: parseInt(discussPostEmojiId), userId },
      },
    })
    return like ? toStringId(like) : null
  },

  async myRates(_parent, { symId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const rates = await prisma.rate.findMany({
      where: {
        AND: { symId, userId },
      },
      orderBy: { updatedAt: 'desc' },
    })
    return rates
  },

  async myVotes(_parent, { pollId }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const votes = await prisma.vote.findMany({
      where: {
        AND: { pollId, userId },
      },
    })
    return votes.map(e => ({ ...toStringId(e) }))
  },

  async poll(_parent, { id }, _context, _info) {
    const poll = await prisma.poll.findUnique({
      include: { count: true },
      where: { id },
    })
    if (poll && hasCount(poll)) {
      return {
        ...poll,
        meta: poll.meta as unknown as PollMeta,
        count: { ...toStringId(poll.count) },
      }
    }
    return null
  },

  searchAuthor(_parent, { term }, _context, _info) {
    return SearchAuthorService.search(term)
  },

  searchDiscuss(_parent, { term }, _context, _info) {
    return SearchDiscussService.search(term)
  },

  searchSymbol(_parent, { term, type }, _context, _info) {
    return SearchSymbolService.search(term, type ?? undefined)
  },

  async rate(_parent, { id }, _context, _info) {
    return await prisma.rate.findUnique({
      where: { id },
    })
  },

  async ratesBySource(_parent, { linkId }, _context, _info) {
    const rate = await prisma.rate.findMany({
      where: { linkId },
      orderBy: { updatedAt: 'desc' },
      // cursor: afterId ? { id: afterId } : undefined,
      // take: 10,
      // skip: afterId ? 1 : 0,
    })
    return rate
  },

  async ratesByAuthor(_parent, { authorId, symId }, _context, _info) {
    const rates = await prisma.rate.findMany({
      where: { AND: { authorId, symId } },
      orderBy: { updatedAt: 'desc' },
    })
    return rates
  },

  // tagHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  // tickerHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  // eventHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  // async board(_parent, { id }, _context, _info) {
  // throw 'Consider to remove'
  // const board = await prisma.board.findUnique({
  //   include: {
  //     count: true,
  //     poll: { include: { count: true } },
  //   },
  //   where: { id: parseInt(id) },
  // })
  // if (board && board.count && board.poll && board.poll.count) {
  //   return {
  //     ..._toStringId(board),
  //     count: _toStringId(board.count),
  //     poll: board.poll && {
  //       ..._toStringId(board.poll),
  //       count: _toStringId(board.poll.count),
  //     },
  //   }
  // } else if (board && board.count && board.poll === null) {
  //   return {
  //     ..._toStringId(board),
  //     count: _toStringId(board.count),
  //     poll: undefined,
  //   }
  // }
  // throw new Error()
  // },

  // async comments(_parent, { boardId, afterId }, _context, _info) {
  // throw 'Consider to remove'
  // const comments = await prisma.comment.findMany({
  //   include: { count: true, vote: true },
  //   where: { boardId: parseInt(boardId) },
  //   orderBy: { createdAt: 'desc' },
  //   cursor: afterId ? { id: parseInt(afterId) } : undefined,
  //   take: 100,
  // })
  // return comments.map(e => {
  //   if (e.count) {
  //     return {
  //       ..._toStringId(e),
  //       oauthorName: e.oauthorName ?? undefined,
  //       count: _toStringId(e.count),
  //       vote: e.vote && _toStringId(e.vote),
  //     }
  //   }
  //   throw new Error()
  // })
  // },

  // botPolls: async (parent, { symbolName }, { prisma }) => {
  //   const maxDate = dayjs().startOf("d").subtract(7, "d")
  //   // TODO: 應該要經過「挑選」，只挑重要的出來
  //   const polls = await prisma.poll.findMany({
  //     take: 100,
  //     where: {
  //       createdAt: { gte: maxDate.toDate() },
  //       symbols: symbolId ? { some: { id: parseInt(symbolId) } } : undefined,
  //     },
  //     orderBy: { createdAt: "desc" },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       choices: true,
  //       posts: { include: { count: true } },
  //     },
  //     cursor: afterId ? { id: parseInt(afterId) } : undefined,
  //   })
  //   // prisma-bug-hack：假如傳回來的post-id與afterId相同，代表已經沒有更多post
  //   if (polls.length === 1 && polls[0].id === parseInt(afterId))
  //     return []
  //   return polls
  // },

  // latestPolls: async (parent, { symbolId, afterId }, { prisma }) => {
  //   const maxDate = dayjs().startOf("d").subtract(7, "d")
  //   // TODO: 應該要經過「挑選」，只挑重要的出來
  //   const polls = await prisma.poll.findMany({
  //     take: 100,
  //     where: {
  //       createdAt: { gte: maxDate.toDate() },
  //       symbols: symbolId ? { some: { id: parseInt(symbolId) } } : undefined,
  //     },
  //     orderBy: { createdAt: "desc" },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       choices: true,
  //       posts: { include: { count: true, votes: true } },
  //     },
  //     cursor: afterId ? { id: parseInt(afterId) } : undefined,
  //   })
  //   // prisma-bug-hack：假如傳回來的post-id與afterId相同，代表已經沒有更多post
  //   if (polls.length === 1 && polls[0].id === parseInt(afterId))
  //     return []
  //   return polls
  // },

  // repliedPosts: (parent, { parentId, afterId }, { prisma }) => {
  //   // const maxDate = dayjs().startOf("d").subtract(7, "d")
  //   // await prisma.postCount.findMany({
  //   //   where: {
  //   //     post: {
  //   //       parentId: parseInt(parentId),
  //   //       cat: PostCat.REPLY
  //   //     }
  //   //   },
  //   //   orderBy: { nUps: "desc" },
  //   //   include: {
  //   //     post: true
  //   //   }
  //   // })
  //   // TODO: `orderBy`要按照按讚數來排序
  //   return prisma.post.findMany({
  //     take: 30,
  //     where: {
  //       // createdAt: { gte: maxDate.toDate() },
  //       cat: PostCat.REPLY,
  //     },
  //     orderBy: {
  //       createdAt: "desc",
  //     },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       poll: { include: { count: true } },
  //     },
  //     // cursor: { id: afterId }
  //   })
  // },

  // myPosts: (parent, args, { prisma, req }) => {
  //   // TODO: @me: 發文、按讚的、投過票的、comment的
  //   return prisma.post.findMany({
  //     take: 30,
  //     orderBy: { createdAt: "desc" },
  //     where: { userId: req.userId },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       poll: {
  //         include: { count: true }
  //       },
  //     },
  //   })
  // },

  // // symbolPosts: (parent, { symbolId, after = null }, { prisma }) => {
  // //   // return prisma.symbol.findOne({ where: { id: symbolId } })
  // //   //   .posts({ first: 30 })
  // //   return prisma.post.findMany({ where: { symbols: { every: { id: symbolId } } } })
  // // },

  // risingPosts: (parent, args, ctx) => {
  //   return []
  // },

  // trendPosts: (parent, args, ctx) => {
  //   return []
  // },

  // post: (parent, { id }, { prisma }) => {
  //   return prisma.post.findOne({
  //     where: { id: parseInt(id) },
  //     include: {
  //       symbols: true,
  //       count: true,
  //       poll: { include: { count: true } },
  //       // parent: { select: { id: true, cat: true, title: true } },
  //       // children: { select: { id: true, cat: true, title: true } }
  //     },
  //   })
  // },

  // symbol: (parent, { name }, { prisma }) => {
  //   return prisma.symbol.findOne({ where: { name } })
  // },

  // ticks: (parent, { symbolId, afterId }, { prisma }) => {
  //   return prisma.tick.findMany({
  //     take: 100,
  //     where: { symbolId },
  //     orderBy: { at: "desc" },
  //     cursor: { id: afterId }
  //   })
  // },

  // async myVotes(_parent, { after }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const votes = await prisma.vote.findMany({ where: { userId }, take: 50 })
  //   return votes.map(e => ({ ..._toStringId(e) }))
  // },

  // async myCommentLikes(_parent, { after }, { req, res }, _info) {
  //   // return prisma.replyLike.findMany({ where: { userId: req.userId }, take: 50 })
  //   const { userId } = isAuthenticated(req, res)
  //   const likes = await prisma.commentLike.findMany({ where: { userId }, take: 50 })
  //   return likes.map(e => ({ ..._toStringId(e) }))
  // },

  // async myBoardLikes(_parent, { after }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const likes = await prisma.boardLike.findMany({ where: { userId }, take: 50 })
  //   return likes.map(e => ({ ..._toStringId(e) }))
  // },

  // async myBulletLikes(_parent, { after }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const likes = await prisma.bulletLike.findMany({ where: { userId }, take: 50 })
  //   return likes.map(e => ({ ..._toStringId(e) }))
  // },

  // myFollows: (parent, { after }, { prisma, req }) => {
  //   return prisma.follow.findMany({ where: { userId: req.userId, followed: true } })
  // },
}

const Mutation: Required<MutationResolvers<ResolverContext>> = {
  async createBulletEmoji(_parent, { bulletId, code }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { emoji, like } = await BulletEmojiModel.create({ bulletId, code, userId })
    return {
      emoji: {
        ...emoji,
        count: toStringId(emoji.count),
      },
      like: toStringId(like),
    }
  },

  async upsertBulletEmojiLike(_parent, { bulletEmojiId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { like, count } = await BulletEmojiModel.upsertLike({
      choice: data.choice,
      bulletEmojiId,
      userId,
    })
    return {
      like: toStringId(like),
      count: toStringId(count),
    }
  },

  async createCardEmoji(_parent, { cardId, code }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { emoji, like } = await CardEmojiModel.create({ cardId, code, userId })
    return {
      emoji: {
        ...emoji,
        count: toStringId(emoji.count),
      },
      like: toStringId(like),
    }
  },

  async upsertCardEmojiLike(_parent, { cardEmojiId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { like, count } = await CardEmojiModel.upsertLike({
      choice: data.choice,
      cardEmojiId,
      userId,
    })
    return {
      like: toStringId(like),
      count: toStringId(count),
    }
  },

  // async updateCardMeta(_parent, { cardId, data }, { req }, _info) {
  //   await isAuthenticated(req)
  //   const card = await prisma.card.update({
  //     where: { id: cardId },
  //     data: {
  //       meta: data, // TODO 需要檢查 input
  //     },
  //   })
  //   const meta = card.meta as unknown as CardMeta
  //   return meta
  // },

  async createDiscuss(_parent, { cardId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { title, content } = data
    const discuss = await prisma.discuss.create({
      data: {
        user: { connect: { id: userId } },
        cards: { connect: [{ id: cardId }] },
        meta: {},
        title,
        content,
        // choices: data.choices,
        count: { create: {} },
      },
      include: { count: true },
    })
    if (hasCount(discuss)) {
      return {
        ...discuss,
        meta: {},
        count: toStringId(discuss.count),
      }
    }
    throw 'Internal error'
  },

  async updateDiscuss(_parent, { id, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const discuss = await prisma.discuss.findUnique({
      where: { id },
    })
    if (discuss?.userId === userId) {
      const { title, content } = data
      const discuss = await prisma.discuss.update({
        where: { id },
        data: {
          title,
          content,
        },
        include: { count: true },
      })
      if (hasCount(discuss)) {
        return {
          ...discuss,
          meta: {},
          count: toStringId(discuss.count),
        }
      }
      throw 'Internal error'
    }
    throw 'Not authorized, only author is allowed to update discuss'
  },

  async connectDiscussToCard(_parent, { discussId, cardId, disconnect }, { req }, _info) {
    await isAuthenticated(req)
    const discuss = disconnect
      ? await prisma.discuss.update({
          where: { id: discussId },
          data: {
            cards: { disconnect: [{ id: cardId }] },
          },
        })
      : await prisma.discuss.update({
          where: { id: discussId },
          data: {
            cards: { connect: [{ id: cardId }] },
          },
        })
    if (discuss) {
      return true
    }
    throw 'Internal error'
  },

  async createDiscussEmoji(_parent, { discussId, code }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { emoji, like } = await DiscussEmojiModel.create({ discussId, code, userId })
    return {
      emoji: {
        ...toStringId(emoji),
        count: toStringId(emoji.count),
      },
      like: toStringId(like),
    }
  },

  async upsertDiscussEmojiLike(_parent, { discussEmojiId, liked }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { like, count } = await DiscussEmojiModel.upsertLike({
      liked,
      discussEmojiId: parseInt(discussEmojiId),
      userId,
    })
    return {
      like: toStringId(like),
      count: toStringId(count),
    }
  },

  async createDiscussPost(_parent, { discussId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { content } = data
    const post = await prisma.discussPost.create({
      data: {
        user: { connect: { id: userId } },
        discuss: { connect: { id: discussId } },
        content,
      },
    })
    return toStringId(post)
  },

  async updateDiscussPost(_parent, { id, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const post = await prisma.discussPost.findUnique({
      where: { id: parseInt(id) },
    })
    if (post?.userId === userId) {
      const { content } = data
      const post = await prisma.discussPost.update({
        where: { id: parseInt(id) },
        data: { content },
      })
      return toStringId(post)
    }
    throw 'Not authorized, only author is allowed to update discuss'
  },

  async createDiscussPostEmoji(_parent, { discussPostId, code }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { emoji, like } = await DiscussPostEmojiModel.create({ discussPostId: parseInt(discussPostId), code, userId })
    return {
      emoji: {
        ...toStringId(emoji),
        count: toStringId(emoji.count),
      },
      like: toStringId(like),
    }
  },

  async upsertDiscussPostEmojiLike(_parent, { discussPostEmojiId, liked }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { like, count } = await DiscussPostEmojiModel.upsertLike({
      liked,
      discussPostEmojiId: parseInt(discussPostEmojiId),
      userId,
    })
    return {
      like: toStringId(like),
      count: toStringId(count),
    }
  },

  async createCommit(_parent, { data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { commit, stateGidToCid } = await CommitModel.create(data, userId)
    return {
      ...commit,
      stateIdToCidDictEntryArray: Object.entries(stateGidToCid).map<{ k: string; v: string }>(([k, v]) => ({ k, v })),
    }
  },

  async createPoll(_parent, { data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const poll = await prisma.poll.create({
      data: {
        user: { connect: { id: userId } },
        choices: data.choices,
        count: { create: {} },
      },
      include: { count: true },
    })
    if (hasCount(poll)) {
      return {
        ...poll,
        count: toStringId(poll.count),
      }
    }
    throw 'Database internal error'
  },

  async createRate(_parent, { data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const { choice, targetId, authorId, linkId } = data

    const card = await prisma.card.findUnique({
      where: { id: targetId },
      include: { sym: true },
    })
    if (card === null) {
      throw 'Target card not found'
    }
    return await RateModel.create({ choice, symbol: card.sym.symbol, userId, authorId, linkId })
  },

  async updateRate(_parent, { id, data }, { req }, _info) {
    throw 'Not implemented yet.'
  },

  async createVote(_parent, { pollId, data }, { req }, _info) {
    const { userId } = await isAuthenticated(req)
    const vote = await createVote({
      choiceIdx: data.choiceIdx,
      pollId,
      userId,
    })
    return toStringId(vote)
  },

  async sessionLogin(_parent, { idToken, csrfToken }, { req, res }, _info) {
    const claims = await sessionLogin(req, res, idToken)
    if (claims.email) {
      const user = await getOrCreateUser(claims.uid, claims.email)
      return user
    }
    throw new AuthenticationError('Require email')
  },

  async sessionLogout(_parent, _args, { req, res }, _info) {
    await sessionLogout(req, res)
    return true
  },

  // async signIn(_parent, { email, password }, { res }, _info) {
  //   console.log(res)
  //   const user = await prisma.user.findUnique({
  //     where: { email },
  //   })
  //   if (user && (await compare(password, user.password))) {
  //     setLoginSession(res, { userId: user.id })

  //     console.log(`User ${user.email} sign in succeess`)

  //     return { token: 'false-token', user }
  //   }

  //   throw new UserInputError('Could not find a match for username and password')
  //   // const valid = await compare(password, user.password)
  //   // if (!valid) throw new UserInputError('Could not find a match for username and password')

  //   // const token = sign({ userId: user.id }, APP_SECRET)
  //   // res.cookie('token', `Bearer ${token}`, {
  //   //   httpOnly: true,
  //   //   maxAge: 1000 * 60 * 60 * 24,
  //   //   // secure: true,  // https only
  //   // })
  //   // const token = sign({ id: user.id }, APP_SECRET, { algorithm: 'HS256', expiresIn: '1d' })
  // },

  // async signUp(_parent, { email, password }, { res }, _info) {
  //   removeTokenCookie(res)

  //   const user = await prisma.user.create({
  //     data: {
  //       email,
  //       password: await hash(password, 10),
  //       // profile: { create: {} },
  //       // dailyProfile: { create: {} },
  //     },
  //   })
  //   return user
  // },

  // signOut(_parent, _args, { res }, _info) {
  //   removeTokenCookie(res)
  //   return true
  // },

  // ------

  // updateVote: (parent, { pollId, data }, { prisma, req }) => {
  //   return prisma.pollVote.update({ userId: req.userId, ...data })
  // },
}

export default { Query, Mutation }
