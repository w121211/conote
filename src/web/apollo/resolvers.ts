import { NextApiRequest, NextApiResponse } from 'next'
import { AuthenticationError } from 'apollo-server-micro'
// import { compare, hash } from 'bcryptjs'
import { getSession } from '@auth0/nextjs-auth0'
import { Emoji, EmojiCount } from '.prisma/client'
import prisma from '../lib/prisma'
import fetcher from '../lib/fetcher'
import { QueryResolvers, MutationResolvers } from './type-defs.graphqls'
import { hasCount, toStringId } from '../lib/helpers'
import { CardMeta, createCardBody, getCard, getOrCreateCardBySymbol, getOrCreateCardByUrl } from '../lib/models/card'
import { getOrCreateUser } from '../lib/models/user'
import { createVote } from '../lib/models/vote'
import { searchAllSymbols } from '../lib/search/fuzzy'
import { createEmoji, upsertEmojiLike } from '../lib/models/emoji'
import { PollMeta } from '../lib/models/poll'
import { createShot } from '../lib/models/shot'
import { ResolverContext } from './apollo-client'

// function _deleteNull<T>(obj: T) {
//   let k: keyof T
//   for (k in obj) {
//     if (obj[k] === null) {
//       delete obj[k]
//     }
//   }
// }

// function isBulletInput(obj: GqlBulletInput): obj is BulletInput {
//   _deleteNull(obj)
//   return true
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

function isAuthenticated(req: NextApiRequest, res: NextApiResponse): { userId: string; email: string } {
  const session = getSession(req, res)
  if (session?.user && session.user.appUserId) {
    return { userId: session.user.appUserId, email: session.user.email }
  }
  throw new AuthenticationError('Not authenticated')
}

const Query: Required<QueryResolvers<ResolverContext>> = {
  // tagHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  // tickerHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

  // eventHints: (parent, { term }, { prisma }) => {
  //   return null
  // },

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

  searchAll(_parent, { term }, _context, _info) {
    return searchAllSymbols(term)
  },

  searchTicker(_parent, { term }, _context, _info) {
    throw 'Not implemented yet.'
  },

  searchTopic(_parent, { term }, _context, _info) {
    throw 'Not implemented yet.'
  },

  async latestCardEntries(_parent, { afterId }, _context, _info) {
    // const maxDate = dayjs().startOf('d').subtract(7, 'd')
    const cards = await prisma.card.findMany({
      // where: { createdAt: { gte: maxDate.toDate() } },
      orderBy: { updatedAt: 'desc' },
      cursor: afterId ? { id: afterId } : undefined,
      take: 10,
      skip: afterId ? 1 : 0,
    })
    return cards
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

  async card(_parent, { id, symbol }, _context, _info) {
    if (id) {
      const card = await getCard({ id })
      if (card) {
        return {
          ...card,
          body: toStringId(card.body),
        }
      }
      return null
    }
    if (symbol) {
      const card = await getOrCreateCardBySymbol(symbol)
      return {
        ...card,
        body: toStringId(card.body),
      }
    }
    throw 'Param requires either id or symbol'
  },

  async cardMeta(_parent, { symbol }, _context, _info) {
    const card = await prisma.card.findUnique({
      where: { symbol },
      include: { link: true },
    })
    if (card === null) {
      throw `Card ${symbol} not found`
    }
    return card.meta as unknown as CardMeta
    // const meta: CardMeta = card.meta ? card.meta : {}
    // return meta
  },

  async webpageCard(_parent, { url }, _context, _info) {
    const card = await getOrCreateCardByUrl({ scraper: fetcher, url })
    return {
      ...card,
      body: toStringId(card.body),
    }
  },

  async emojis(_parent, { bulletId }, _context, _info) {
    const emojis = (
      await prisma.emoji.findMany({
        // where: { AND: [{ card: { symbol } }, { status: HashtagStatus.ACTIVE }] },
        where: { bulletId },
        include: { count: true },
      })
    ).filter(
      (
        e,
      ): e is Emoji & {
        count: EmojiCount
      } => e.count !== null,
    )
    return emojis.map(e => {
      return {
        ...e,
        count: { ...toStringId(e.count) },
      }
    })
    // const emojis = (
    //   await prisma.emoji.findMany({
    //     // where: { AND: [{ card: { symbol } }, { status: HashtagStatus.ACTIVE }] },
    //     where: { bulletId },
    //     include: { count: true },
    //   })
    // ).filter(
    //   (
    //     e,
    //   ): e is Hashtag & {
    //     count: HashtagCount
    //     poll: (Poll & { count: PollCount }) | null
    //   } => {
    //     if (e.count === null || (e.poll && e.poll.count === null)) {
    //       throw 'count 不應為 null, database error'
    //     }
    //     return true
    //   },
    // )
    // return hashtags.map(e => {
    //   return {
    //     ..._toStringId(e),
    //     count: { ..._toStringId(e.count) },
    //     poll: e.poll && {
    //       ..._toStringId(e.poll),
    //       count: _toStringId(e.poll.count),
    //     },
    //   }
    // })
  },

  async bullet(_parent, { id }, _context, _info) {
    const bullet = await prisma.bullet.findUnique({
      where: { id },
    })
    return bullet
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

  async shot(_parent, { id }, _context, _info) {
    const shot = await prisma.shot.findUnique({
      where: { id },
    })
    return shot
  },

  async shotsBySource(_parent, { linkId }, _context, _info) {
    const shot = await prisma.shot.findMany({
      where: { linkId },
      orderBy: { updatedAt: 'desc' },
      // cursor: afterId ? { id: afterId } : undefined,
      // take: 10,
      // skip: afterId ? 1 : 0,
    })
    return shot
  },

  async shotsByAuthor(_parent, { authorId, targetId }, _context, _info) {
    const shot = await prisma.shot.findMany({
      where: { AND: { authorId, targetId } },
      orderBy: { updatedAt: 'desc' },
    })
    return shot
  },

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

  async me(_parent, _args, { req, res }, _info) {
    const { email } = isAuthenticated(req, res)
    const user = await getOrCreateUser(email)
    // await prisma.user.findUnique({ where: { id: userId } })
    return user
  },

  async myShots(_parent, { targetId }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const shots = await prisma.shot.findMany({
      where: {
        AND: { targetId, userId },
      },
    })
    return shots
  },

  async myVotes(_parent, { pollId }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const votes = await prisma.vote.findMany({
      where: {
        AND: { pollId, userId },
      },
    })
    return votes.map(e => ({ ...toStringId(e) }))
  },

  async myEmojiLike(_parent, { emojiId }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const like = await prisma.emojiLike.findUnique({
      where: {
        userId_emojiId: { emojiId, userId },
      },
    })
    return like ? toStringId(like) : null
  },

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
  async createSymbolCard(_parent, { data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const card = await getOrCreateCardBySymbol(data.symbol)
    return {
      ...card,
      body: { ...toStringId(card.body) },
    }
  },

  async updateCardMeta(_parent, { symbol, data }, { req, res }, _info) {
    isAuthenticated(req, res)
    const card = await prisma.card.update({
      where: { symbol },
      data: {
        meta: data, // TODO 需要檢查 input
      },
    })
    const meta = card.meta as unknown as CardMeta
    return meta
  },

  async createCardBody(_parent, { cardSymbol, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const card = await prisma.card.findUnique({ where: { symbol: cardSymbol } })
    if (card === null) {
      throw 'Card not found'
    }
    const [body] = await createCardBody({
      cardId: card.id,
      root: data.root,
      userId,
    })
    // console.log(body)
    return toStringId(body)
  },

  async createPoll(_parent, { data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
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

  async createVote(_parent, { pollId, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const vote = await createVote({
      choiceIdx: data.choiceIdx,
      pollId,
      userId,
    })
    return toStringId(vote)
  },

  // async createComment(_parent, { boardId, pollId, data }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const board = await prisma.board.findUnique({
  //     include: { count: true },
  //     where: { id: parseInt(boardId) },
  //   })
  //   if (board === null) throw new Error(`Given boardId not found`)
  //   // if (post.status !== PostStatus.ACTIVE) throw new Error("post is not active")

  //   let vote: Vote | undefined
  //   if (pollId && data.vote?.choiceIdx) {
  //     vote = await createVote({
  //       choiceIdx: data.vote.choiceIdx,
  //       pollId: parseInt(pollId),
  //       userId,
  //     })
  //   }
  //   const comment = await prisma.comment.create({
  //     include: { count: true, vote: true },
  //     data: {
  //       content: data.content,
  //       user: { connect: { id: userId } },
  //       // oauthor: { connect: { name: e.oauthor } },
  //       count: { create: {} },
  //       board: { connect: { id: parseInt(boardId) } },
  //       vote: vote && { connect: { id: vote.id } },
  //     },
  //   })
  //   // await prisma.commentCount.update({
  //   //   data: { nReplies: comment.count.nComments + 1 },
  //   //   where: { commentId: comment.id }
  //   // })

  //   if (comment.count) {
  //     return {
  //       ..._toStringId(comment),
  //       count: _toStringId(comment.count),
  //       vote: comment.vote && _toStringId(comment.vote),
  //     }
  //   } else {
  //     throw new Error()
  //   }
  // },

  // async createAuthorVote(_parent, { pollId, authorName, data }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const vote = await createAuthorVote({
  //     choiceIdx: data.choiceIdx,
  //     pollId: parseInt(pollId),
  //     authorName,
  //     userId,
  //   })
  //   return _toStringId(vote)
  // },

  // async createOauthorComment(_parent, { boardId, pollId, oauthorName, data }, { req, res }, _info) {
  //   throw 'Consider to remove'
  //   const { userId } = isAuthenticated(req, res)
  //   const board = await prisma.board.findUnique({
  //     include: { count: true },
  //     where: { id: parseInt(boardId) },
  //   })
  //   if (board === null) throw new Error(`Given boardId not found`)
  //   // if (post.status !== PostStatus.ACTIVE) throw new Error("post is not active")
  //   let vote: Vote | undefined
  //   if (pollId && data.vote?.choiceIdx !== undefined) {
  //     vote = await createOauthorVote({
  //       choiceIdx: data.vote.choiceIdx,
  //       pollId: parseInt(pollId),
  //       oauthorName,
  //       userId,
  //     })
  //   }
  //   const comment = await prisma.comment.create({
  //     include: { count: true },
  //     data: {
  //       content: data.content,
  //       user: { connect: { id: userId } },
  //       oauthor: { connect: { name: oauthorName } },
  //       count: { create: {} },
  //       board: { connect: { id: parseInt(boardId) } },
  //       vote: vote && { connect: { id: vote.id } },
  //     },
  //   })
  //   // await prisma.commentCount.update({
  //   //   data: { nReplies: comment.count.nComments + 1 },
  //   //   where: { commentId: comment.id }
  //   // })
  //   if (comment.count) {
  //     return {
  //       ..._toStringId(comment),
  //       count: _toStringId(comment.count),
  //     }
  //   } else {
  //     throw new Error()
  //   }
  // },

  async createEmoji(_parent, { bulletId, text }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const { emoji, like } = await createEmoji({ bulletId, text, userId })
    return {
      emoji: {
        ...emoji,
        count: toStringId(emoji.count),
      },
      like: toStringId(like),
    }
  },

  async upsertEmojiLike(_parent, { emojiId, data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const { like, count } = await upsertEmojiLike({
      choice: data.choice,
      emojiId,
      userId,
    })
    return {
      like: toStringId(like),
      count: toStringId(count),
    }
  },

  async createShot(_parent, { data }, { req, res }, _info) {
    const { userId } = isAuthenticated(req, res)
    const { choice, targetId, authorId, linkId } = data
    const shot = await createShot({ choice, targetCardId: targetId, userId, authorId, linkId })
    return shot
  },

  async updateShot(_parent, { id, data }, { req, res }, _info) {
    throw 'Not implemented yet.'
  },

  // async createCommentLike(_parent, { commentId, data }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const count = await prisma.commentCount.findUnique({ where: { commentId: parseInt(commentId) } })
  //   if (count === null) {
  //     throw new Error('Prisma error')
  //   }
  //   const like = await prisma.commentLike.create({
  //     data: {
  //       choice: data.choice,
  //       user: { connect: { id: userId } },
  //       comment: { connect: { id: parseInt(commentId) } },
  //     },
  //   })
  //   const { dUp, dDown } = deltaLike(like)
  //   const updatedCount = await prisma.commentCount.update({
  //     data: {
  //       nUps: count.nUps + dUp,
  //       nDowns: count.nDowns + dDown,
  //     },
  //     where: { commentId: like.commentId },
  //   })
  //   return {
  //     like: { ..._toStringId(like), choice: like.choice },
  //     count: _toStringId(updatedCount),
  //   }
  // },

  // async updateCommentLike(_parent, { id, data }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const prevLike = await prisma.commentLike.findUnique({ where: { id: parseInt(id) } })
  //   if (prevLike === null || prevLike?.userId !== userId || data.choice === prevLike.choice) {
  //     throw new Error('No matched data')
  //   }
  //   const count = await prisma.commentCount.findUnique({ where: { commentId: prevLike.commentId } })
  //   if (count === null) {
  //     throw new Error('Prisma error, update fail')
  //   }
  //   const like = await prisma.commentLike.update({
  //     data: { choice: data.choice },
  //     where: { id: prevLike.id },
  //   })
  //   const { dUp, dDown } = deltaLike(like, prevLike)
  //   const updatedCount = await prisma.commentCount.update({
  //     data: {
  //       nUps: count.nUps + dUp,
  //       nDowns: count.nDowns + dDown,
  //     },
  //     where: { commentId: like.commentId },
  //   })
  //   return {
  //     like: { ..._toStringId(like), choice: like.choice },
  //     count: _toStringId(updatedCount),
  //   }
  // },

  // async createBoardLike(_parent, { boardId, data }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const count = await prisma.boardCount.findUnique({
  //     where: { boardId: parseInt(boardId) },
  //   })
  //   if (count === null) {
  //     throw new Error('Prisma error')
  //   }
  //   const like = await prisma.boardLike.create({
  //     data: {
  //       choice: data.choice,
  //       user: { connect: { id: userId } },
  //       board: { connect: { id: parseInt(boardId) } },
  //     },
  //   })
  //   const { dUp, dDown } = deltaLike(like)
  //   const updatedCount = await prisma.boardCount.update({
  //     data: {
  //       nUps: count.nUps + dUp,
  //       nDowns: count.nDowns + dDown,
  //     },
  //     where: { boardId: like.boardId },
  //   })
  //   return {
  //     like: { ..._toStringId(like), choice: like.choice },
  //     count: _toStringId(updatedCount),
  //   }
  // },

  // async updateBoardLike(_parent, { id, data }, { req, res }, _info) {
  //   const { userId } = isAuthenticated(req, res)
  //   const prevLike = await prisma.boardLike.findUnique({ where: { id: parseInt(id) } })
  //   if (prevLike === null || prevLike?.userId !== userId || data.choice === prevLike.choice) {
  //     throw new Error('No matched data')
  //   }
  //   const count = await prisma.boardCount.findUnique({ where: { boardId: prevLike.boardId } })
  //   if (count === null) {
  //     throw new Error('Prisma error, update fail')
  //   }
  //   const like = await prisma.boardLike.update({
  //     data: { choice: data.choice },
  //     where: { id: prevLike.id },
  //   })
  //   const { dUp, dDown } = deltaLike(like, prevLike)
  //   const updatedCount = await prisma.boardCount.update({
  //     data: {
  //       nUps: count.nUps + dUp,
  //       nDowns: count.nDowns + dDown,
  //     },
  //     where: { boardId: like.boardId },
  //   })
  //   return {
  //     like: { ..._toStringId(like), choice: like.choice },
  //     count: _toStringId(updatedCount),
  //   }
  // },

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

  // updateComment: (parent, { id, data }, { prisma, req }) => {
  //   return prisma.comment.update({
  //     data: { content: data.cotent },
  //     where: { id: parseInt(id) }
  //   })
  // },

  // createVotePost: async function (parent, { pollId, choiceId, data }, { prisma, req }) {
  //   return prisma.post.create({
  //     data: {
  //       cat: data.cat,
  //       text: data.text,
  //       user: { connect: { id: req.userId } },
  //       poll: pollId ? { connect: { id: parseInt(pollId) } } : undefined,
  //       symbols: { connect: (data.symbolIds as string[]).map(x => ({ name: x })) },
  //       count: { create: {} },
  //       votes: {
  //         create: [
  //           {
  //             user: { connect: { id: req.userId } },
  //             poll: { connect: { id: parseInt(pollId) } },
  //             choice: { connect: { id: parseInt(choiceId) } }
  //           }
  //         ]
  //       }
  //     },
  //     include: {
  //       count: true,
  //       symbols: true,
  //       votes: true,
  //       // poll: true,
  //     },
  //   })
  // },

  // createPoll: async (parent, { data }, { prisma, req }) => {
  //   const start = dayjs().startOf('d')
  //   const end = start.add(data.nDays, 'd')
  //   return prisma.poll.create({
  //     data: {
  //       cat: data.cat,
  //       title: data.title,
  //       text: data.text,
  //       start: start.toDate(),
  //       end: end.toDate(),
  //       nDays: data.nDays,
  //       choices: {
  //         create: data.choices.map((e: String) => (
  //           {
  //             text: e,
  //             user: { connect: { id: req.userId } }
  //           }
  //         ))
  //       },
  //       user: { connect: { id: req.userId } },
  //       count: { create: {} },
  //       symbols: { connect: (data.symbolIds as string[]).map(e => ({ name: e })) },
  //     },
  //     include: {
  //       choices: true,
  //       symbols: true,
  //       count: true,
  //       posts: { include: { count: true } },
  //     },
  //   })
  // },

  // createPollLike: async (parent, { pollId, data }, { prisma, req }) => {
  //   const like = await prisma.pollLike.create({
  //     data: {
  //       choice: data.choice,
  //       user: { connect: { id: req.userId } },
  //       poll: { connect: { id: parseInt(pollId) } },
  //     }
  //   })
  // const count = await prisma.pollCount.findUnique({ where: { pollId: like.pollId } })
  //   if (count === null) throw new Error('Something went wrong')

  //   const delta = deltaLike(like)
  //   const updatedCount = await prisma.pollCount.update({
  //     data: {
  //       nUps: count.nUps + delta.dUps,
  //       nDowns: count.nDowns + delta.dDowns,
  //     },
  //     where: { pollId: like.pollId }
  //   })
  //   return { like, count: updatedCount }
  // },

  // updatePollLike: async (parent, { id, data }, { prisma, req }) => {
  //   const oldLike = await prisma.pollLike.findOne({
  //     where: { id: parseInt(id) }
  //   })
  //   if (oldLike === null || data.choice === oldLike.choice)
  //     throw new Error('No matched data')

  //   const like = await prisma.pollLike.update({
  //     data: { choice: data.choice },
  //     where: { id: oldLike.id }
  //   })

  //   const delta = deltaLike(like, oldLike)
  //   const count = await prisma.pollCount.findOne({ where: { pollId: like.pollId } })
  //   if (count === null) throw new Error('Something went wrong')

  //   const updatedCount = await prisma.pollCount.update({
  //     data: {
  //       nUps: count.nUps + delta.dUps,
  //       nDowns: count.nDowns + delta.dDowns,
  //     },
  //     where: { pollId: like.pollId }
  //   })
  //   return { like, count: updatedCount }
  // },

  // createCommit: (parent, { data }, { prisma, req }) => {
  //   // invite random reviewers by creating commitReview
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // updateCommit: (parent, { id, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // updateCommitReview: (parent, { id, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // applyCommitReview: (parent, { id, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // createFollow: (parent, { symbolId, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },

  // updateFollow: (parent, { symbolId, data }, { prisma, req }) => {
  //   return prisma.comment.create({ userId: req.userId, ...data })
  // },
}

export default { Query, Mutation }
